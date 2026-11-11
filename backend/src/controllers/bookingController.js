const Booking = require('../models/Booking');
const ExecutiveProfile = require('../models/ExecutiveProfile');
const User = require('../models/User');
const { uploadToStorage } = require('../middleware/upload');
const { sendNotification } = require('../services/notificationService');

// Helper to generate memorable unique booking reference
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `ASTRO-${year}-${randomSuffix}`;
};

// Create a new consultation booking
exports.createBooking = async (req, res, next) => {
  try {
    const {
      executiveId,
      consultationTopic,
      problemDescription,
      clientBirthDetails,
      selectedDuration,
      preferredDate,
      preferredTime,
    } = req.body;

    if (!executiveId || !consultationTopic || !selectedDuration || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (astrologer, topic, duration, date, and time).',
      });
    }

    const duration = Number(selectedDuration);
    if (isNaN(duration) || duration < 5 || duration > 180) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid consultation duration between 5 and 180 minutes.',
      });
    }

    // Check Executive and their profile
    const executive = await User.findById(executiveId);
    if (!executive || executive.role !== 'EXECUTIVE') {
      return res.status(404).json({
        success: false,
        message: 'The selected astrologer could not be found.',
      });
    }

    const executiveProfile = await ExecutiveProfile.findOne({ userId: executiveId });
    if (!executiveProfile) {
      return res.status(404).json({
        success: false,
        message: 'Astrologer profile is not configured.',
      });
    }

    // Backend calculates total amount strictly from server-side price snapshot
    const ratePerMinute = executiveProfile.pricePerMinute || 20;
    const totalAmount = duration * ratePerMinute;
    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      customerId: req.user._id,
      executiveId,
      consultationTopic,
      problemDescription: problemDescription || '',
      clientBirthDetails: clientBirthDetails || req.user.birthDetails || {},
      selectedDuration: duration,
      pricePerMinuteSnapshot: ratePerMinute,
      totalAmount,
      preferredDate: new Date(preferredDate),
      preferredTime,
      paymentStatus: 'PAYMENT_PENDING',
      bookingStatus: 'CREATED',
      statusHistory: [
        {
          status: 'CREATED',
          changedAt: new Date(),
          comment: `Booking initialized for ${duration} mins at ₹${ratePerMinute}/min.`,
        },
      ],
    });

    // Notify Executive of new booking request
    await sendNotification({
      userId: executiveId,
      title: 'New Consultation Booking Received',
      message: `New booking request ${bookingId} for ${consultationTopic} (${duration} mins, ₹${totalAmount}) received from ${req.user.name}.`,
      type: 'BOOKING_NEW',
      relatedBookingId: booking._id,
      recipientEmail: executive.email,
    });

    res.status(201).json({
      success: true,
      message: 'Consultation booking created. Please proceed to complete the payment.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Get all bookings
exports.getMyCustomerBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.query;
    const filter = { customerId: req.user._id };

    if (status && status !== 'ALL') {
      filter.bookingStatus = status;
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      filter.paymentStatus = paymentStatus;
    }

    const bookings = await Booking.find(filter)
      .populate('executiveId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    // Attach executive profile details (title, specialization, etc.)
    const executiveIds = bookings.map((b) => b.executiveId?._id).filter(Boolean);
    const profiles = await ExecutiveProfile.find({ userId: { $in: executiveIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const enriched = bookings.map((b) => {
      const bObj = b.toObject();
      if (b.executiveId) {
        const p = profileMap.get(b.executiveId._id.toString());
        bObj.executiveProfile = p
          ? {
              title: p.title,
              specialization: p.specialization,
              upiId: p.upiId,
              qrCode: p.qrCode,
              paymentInstructions: p.paymentInstructions,
            }
          : null;
      }
      return bObj;
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      bookings: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Get single booking details (with executive payment info & Zoom link access control)
exports.getCustomerBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user._id, // Enforce customer IDOR protection
    }).populate('executiveId', 'name email phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or unauthorized access.',
      });
    }

    const executiveProfile = await ExecutiveProfile.findOne({
      userId: booking.executiveId._id,
    });

    const bookingData = booking.toObject();
    bookingData.executiveProfile = executiveProfile
      ? {
          title: executiveProfile.title,
          specialization: executiveProfile.specialization,
          qrCode: executiveProfile.qrCode,
          upiId: executiveProfile.upiId,
          upiName: executiveProfile.upiName,
          paymentInstructions: executiveProfile.paymentInstructions,
          zoomSettingsInstructions: executiveProfile.zoomSettings?.customInstructions,
        }
      : null;

    // Time window calculation for Zoom Meeting Join button
    const now = new Date();
    let canJoinNow = false;
    let secondsUntilStart = null;
    let secondsRemainingInSession = null;

    if (booking.scheduledStartTime && booking.bookingStatus === 'SCHEDULED') {
      const startTime = new Date(booking.scheduledStartTime);
      const endTime = new Date(booking.scheduledEndTime);
      const windowStart = new Date(startTime.getTime() - (booking.joinWindowMinutes || 10) * 60 * 1000);

      secondsUntilStart = Math.max(0, Math.floor((startTime.getTime() - now.getTime()) / 1000));
      secondsRemainingInSession = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));

      // Allowed to join if within 10 minutes before start and before consultation ends
      if (now >= windowStart && now <= endTime) {
        canJoinNow = true;
      }
    }

    bookingData.timeStatus = {
      canJoinNow,
      secondsUntilStart,
      secondsRemainingInSession,
      joinWindowMinutes: booking.joinWindowMinutes || 10,
    };

    res.status(200).json({
      success: true,
      booking: bookingData,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Submit or Resubmit Payment Screenshot
exports.submitPaymentProof = async (req, res, next) => {
  try {
    const { transactionRef } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a screenshot or photo of your payment transaction.',
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user._id, // Enforce customer authorization
    }).populate('executiveId', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.paymentStatus === 'PAYMENT_VERIFIED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been verified and confirmed.',
      });
    }

    const uploadResult = await uploadToStorage(req.file, 'screenshots');

    const isResubmission = Boolean(booking.paymentScreenshot && booking.paymentScreenshot.url);
    const newCount = (booking.paymentScreenshot?.resubmissionCount || 0) + (isResubmission ? 1 : 0);

    booking.paymentScreenshot = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      uploadedAt: new Date(),
      transactionRef: transactionRef || '',
      resubmissionCount: newCount,
    };

    booking.paymentStatus = 'UNDER_VERIFICATION';
    booking.bookingStatus = 'PAYMENT_SUBMITTED';

    booking.statusHistory.push({
      status: 'UNDER_VERIFICATION',
      changedAt: new Date(),
      comment: isResubmission
        ? `Payment proof resubmitted with Ref: ${transactionRef || 'N/A'}`
        : `Payment proof submitted with Ref: ${transactionRef || 'N/A'}`,
    });

    await booking.save();

    // Notify Executive of payment submission
    await sendNotification({
      userId: booking.executiveId._id,
      title: isResubmission ? 'Payment Proof Resubmitted' : 'New Payment Proof Submitted',
      message: `${req.user.name} submitted payment screenshot for booking ${booking.bookingId} (₹${booking.totalAmount}). Please inspect and verify.`,
      type: isResubmission ? 'PAYMENT_SUBMITTED' : 'PAYMENT_SUBMITTED',
      relatedBookingId: booking._id,
      recipientEmail: booking.executiveId.email,
    });

    res.status(200).json({
      success: true,
      message: 'Payment screenshot submitted successfully. The astrologer will verify the transaction.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Submit rating & review after consultation
exports.submitReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5 stars.',
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.bookingStatus !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'You can only review consultations that have been marked as completed.',
      });
    }

    booking.clientRating = Number(rating);
    if (review) booking.clientReview = review.trim();
    await booking.save();

    // Recalculate executive's overall rating
    const executiveBookings = await Booking.find({
      executiveId: booking.executiveId,
      clientRating: { $exists: true, $ne: null },
    });

    if (executiveBookings.length > 0) {
      const avg =
        executiveBookings.reduce((sum, b) => sum + b.clientRating, 0) /
        executiveBookings.length;
      await ExecutiveProfile.findOneAndUpdate(
        { userId: booking.executiveId },
        {
          rating: Number(avg.toFixed(1)),
          reviewCount: executiveBookings.length,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Customer: Cancel Booking (if still pending payment)
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.bookingStatus === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Completed consultations cannot be cancelled.',
      });
    }

    booking.bookingStatus = 'CANCELLED';
    booking.cancellationReason = reason || 'Cancelled by customer.';

    booking.statusHistory.push({
      status: 'CANCELLED',
      changedAt: new Date(),
      comment: `Cancelled by customer: ${reason || 'No reason provided'}`,
    });

    await booking.save();

    // Notify Executive
    await sendNotification({
      userId: booking.executiveId,
      title: 'Booking Cancelled by Customer',
      message: `Booking ${booking.bookingId} (${booking.consultationTopic}) was cancelled by customer.`,
      type: 'CONSULTATION_CANCELLED',
      relatedBookingId: booking._id,
    });

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

