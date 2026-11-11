const User = require('../models/User');
const ExecutiveProfile = require('../models/ExecutiveProfile');
const Booking = require('../models/Booking');
const { uploadToStorage } = require('../middleware/upload');
const { createZoomMeeting } = require('../services/zoomService');
const { sendNotification } = require('../services/notificationService');

// Get executive profile
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await ExecutiveProfile.findOne({ userId: req.user._id }).populate(
      'userId',
      'name email phone profileImage'
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// Update executive profile details
exports.updateMyProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      title,
      biography,
      experience,
      specialization,
      qualifications,
      languages,
    } = req.body;

    // Update User model fields
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    // Update ExecutiveProfile model fields
    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    if (title !== undefined) profile.title = title;
    if (biography !== undefined) profile.biography = biography;
    if (experience !== undefined) profile.experience = Number(experience);
    if (specialization !== undefined) {
      profile.specialization = Array.isArray(specialization)
        ? specialization
        : specialization.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (qualifications !== undefined) {
      profile.qualifications = Array.isArray(qualifications)
        ? qualifications
        : qualifications.split(',').map((q) => q.trim()).filter(Boolean);
    }
    if (languages !== undefined) {
      profile.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map((l) => l.trim()).filter(Boolean);
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile Photograph
exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file.' });
    }

    const uploadResult = await uploadToStorage(req.file, 'profiles');
    const user = await User.findById(req.user._id);
    user.profileImage = uploadResult.url;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully.',
      profileImage: user.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

// Update Consultation Pricing
exports.updatePricing = async (req, res, next) => {
  try {
    const { pricePerMinute } = req.body;
    const numPrice = Number(pricePerMinute);

    if (isNaN(numPrice) || numPrice < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid price per minute (minimum ₹1).',
      });
    }

    const profile = await ExecutiveProfile.findOneAndUpdate(
      { userId: req.user._id },
      { pricePerMinute: numPrice },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Consultation fee updated to ₹${numPrice}/minute.`,
      pricePerMinute: profile.pricePerMinute,
    });
  } catch (error) {
    next(error);
  }
};

// Upload Payment QR Code
exports.uploadPaymentQr = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a QR code image.' });
    }

    const uploadResult = await uploadToStorage(req.file, 'qr-codes');
    const { upiId, upiName, paymentInstructions } = req.body;

    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    profile.qrCode = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      uploadedAt: new Date(),
    };

    if (upiId !== undefined) profile.upiId = upiId.trim();
    if (upiName !== undefined) profile.upiName = upiName.trim();
    if (paymentInstructions !== undefined) profile.paymentInstructions = paymentInstructions.trim();

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Payment QR code uploaded and saved successfully.',
      qrCode: profile.qrCode,
      upiId: profile.upiId,
      upiName: profile.upiName,
      paymentInstructions: profile.paymentInstructions,
    });
  } catch (error) {
    next(error);
  }
};

// Remove Payment QR Code
exports.removePaymentQr = async (req, res, next) => {
  try {
    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    profile.qrCode = {
      url: '',
      publicId: '',
      uploadedAt: null,
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Payment QR code removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Update Payment Info without re-uploading QR
exports.updatePaymentInfo = async (req, res, next) => {
  try {
    const { upiId, upiName, paymentInstructions } = req.body;

    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    if (upiId !== undefined) profile.upiId = upiId.trim();
    if (upiName !== undefined) profile.upiName = upiName.trim();
    if (paymentInstructions !== undefined) profile.paymentInstructions = paymentInstructions.trim();

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Payment details updated successfully.',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get Bookings for this Executive
exports.getBookings = async (req, res, next) => {
  try {
    const { paymentStatus, bookingStatus, search } = req.query;

    const filter = { executiveId: req.user._id };

    if (paymentStatus && paymentStatus !== 'ALL') {
      filter.paymentStatus = paymentStatus;
    }

    if (bookingStatus && bookingStatus !== 'ALL') {
      filter.bookingStatus = bookingStatus;
    }

    let query = Booking.find(filter)
      .populate('customerId', 'name email phone profileImage birthDetails')
      .sort({ createdAt: -1 });

    const bookings = await query;

    let filteredBookings = bookings;
    if (search) {
      const s = search.toLowerCase();
      filteredBookings = bookings.filter((b) => {
        return (
          b.bookingId.toLowerCase().includes(s) ||
          b.consultationTopic.toLowerCase().includes(s) ||
          (b.customerId && b.customerId.name.toLowerCase().includes(s)) ||
          (b.customerId && b.customerId.phone.includes(s))
        );
      });
    }

    res.status(200).json({
      success: true,
      count: filteredBookings.length,
      bookings: filteredBookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get single booking details (Executive)
exports.getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id, // IDOR check
    }).populate('customerId', 'name email phone profileImage birthDetails');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not assigned to you.',
      });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// Verify Customer Payment (Manual verification)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id, // Enforce executive ownership
    }).populate('customerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking request not found.' });
    }

    if (booking.paymentStatus === 'PAYMENT_VERIFIED') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been verified.',
      });
    }

    if (!booking.paymentScreenshot || !booking.paymentScreenshot.url) {
      return res.status(400).json({
        success: false,
        message: 'Cannot verify payment: No payment proof screenshot has been submitted yet.',
      });
    }

    booking.paymentStatus = 'PAYMENT_VERIFIED';
    booking.bookingStatus = 'PAYMENT_VERIFIED';
    booking.paymentVerificationDetails = {
      verifiedAt: new Date(),
      verifiedBy: req.user._id,
      notes: notes || 'Payment verified against bank/UPI statement.',
    };

    booking.statusHistory.push({
      status: 'PAYMENT_VERIFIED',
      changedAt: new Date(),
      comment: notes || 'Payment verified by executive.',
    });

    await booking.save();

    // Send Notification to customer
    await sendNotification({
      userId: booking.customerId._id,
      title: 'Payment Verified! Consultation Ready to Schedule',
      message: `Your payment of ₹${booking.totalAmount} for booking ${booking.bookingId} (${booking.consultationTopic}) has been verified. Your astrologer will schedule your Zoom session shortly.`,
      type: 'PAYMENT_VERIFIED',
      relatedBookingId: booking._id,
      recipientEmail: booking.customerId.email,
    });

    res.status(200).json({
      success: true,
      message: 'Payment successfully verified. You may now schedule the Zoom consultation.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Reject Customer Payment
exports.rejectPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for rejecting the payment screenshot.',
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id,
    }).populate('customerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking request not found.' });
    }

    booking.paymentStatus = 'PAYMENT_REJECTED';
    booking.paymentRejectionReason = reason.trim();
    booking.paymentRejectionHistory.push({
      reason: reason.trim(),
      rejectedAt: new Date(),
      screenshotUrl: booking.paymentScreenshot?.url || '',
    });

    booking.statusHistory.push({
      status: 'PAYMENT_REJECTED',
      changedAt: new Date(),
      comment: `Payment rejected: ${reason.trim()}`,
    });

    await booking.save();

    // Notify Customer
    await sendNotification({
      userId: booking.customerId._id,
      title: 'Payment Verification Action Required',
      message: `Your payment verification for booking ${booking.bookingId} was declined. Reason: "${reason.trim()}". Please resubmit your payment screenshot.`,
      type: 'PAYMENT_REJECTED',
      relatedBookingId: booking._id,
      recipientEmail: booking.customerId.email,
    });

    res.status(200).json({
      success: true,
      message: 'Payment rejected. Customer has been notified to resubmit proof.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Schedule Consultation & Generate Zoom Link
exports.scheduleConsultation = async (req, res, next) => {
  try {
    const { scheduledStartTime, customMeetingUrl, manualPasscode } = req.body;

    if (!scheduledStartTime) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the consultation start date and time.',
      });
    }

    const startTimeDate = new Date(scheduledStartTime);
    if (isNaN(startTimeDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid start time format.' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id,
    }).populate('customerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.paymentStatus !== 'PAYMENT_VERIFIED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule consultation before payment has been verified.',
      });
    }

    // Calculate End Time automatically based on duration
    const durationMinutes = booking.selectedDuration || 30;
    const endTimeDate = new Date(startTimeDate.getTime() + durationMinutes * 60 * 1000);

    // Prevent Overlapping Consultations for this executive
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      executiveId: req.user._id,
      bookingStatus: 'SCHEDULED',
      $or: [
        {
          scheduledStartTime: { $lt: endTimeDate },
          scheduledEndTime: { $gt: startTimeDate },
        },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Conflict detected: You already have another consultation scheduled between ${new Date(
          conflict.scheduledStartTime
        ).toLocaleTimeString()} and ${new Date(conflict.scheduledEndTime).toLocaleTimeString()}.`,
      });
    }

    // Fetch executive Zoom fallback if available
    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    const fallbackUrl = customMeetingUrl || profile?.zoomSettings?.personalMeetingUrl;
    const passcode = manualPasscode || profile?.zoomSettings?.meetingPasscode;

    // Create Zoom Meeting (Automated API or secure fallback)
    const zoomResult = await createZoomMeeting({
      topic: booking.consultationTopic,
      startTime: startTimeDate,
      duration: durationMinutes,
      fallbackUrl,
      manualPasscode: passcode,
    });

    booking.scheduledStartTime = startTimeDate;
    booking.scheduledEndTime = endTimeDate;
    booking.zoomMeetingId = zoomResult.meetingId;
    booking.zoomMeetingUrl = zoomResult.joinUrl;
    booking.zoomPasscode = zoomResult.passcode || '';
    booking.bookingStatus = 'SCHEDULED';

    booking.statusHistory.push({
      status: 'SCHEDULED',
      changedAt: new Date(),
      comment: `Consultation scheduled from ${startTimeDate.toISOString()} to ${endTimeDate.toISOString()}`,
    });

    await booking.save();

    // Notify Customer
    const formattedDate = startTimeDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = startTimeDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await sendNotification({
      userId: booking.customerId._id,
      title: 'Consultation Scheduled!',
      message: `Your ${booking.consultationTopic} consultation is scheduled on ${formattedDate} at ${formattedTime}. Zoom details and live countdown are available in your dashboard.`,
      type: 'CONSULTATION_SCHEDULED',
      relatedBookingId: booking._id,
      recipientEmail: booking.customerId.email,
    });

    res.status(200).json({
      success: true,
      message: 'Consultation scheduled successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Reschedule Consultation
exports.rescheduleConsultation = async (req, res, next) => {
  try {
    const { scheduledStartTime } = req.body;
    if (!scheduledStartTime) {
      return res.status(400).json({ success: false, message: 'Please provide new start time.' });
    }

    const startTimeDate = new Date(scheduledStartTime);
    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id,
    }).populate('customerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const durationMinutes = booking.selectedDuration || 30;
    const endTimeDate = new Date(startTimeDate.getTime() + durationMinutes * 60 * 1000);

    // Conflict check
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      executiveId: req.user._id,
      bookingStatus: 'SCHEDULED',
      $or: [
        {
          scheduledStartTime: { $lt: endTimeDate },
          scheduledEndTime: { $gt: startTimeDate },
        },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Conflict detected with another consultation at this time slot.',
      });
    }

    booking.scheduledStartTime = startTimeDate;
    booking.scheduledEndTime = endTimeDate;

    booking.statusHistory.push({
      status: 'RESCHEDULED',
      changedAt: new Date(),
      comment: `Rescheduled to ${startTimeDate.toISOString()}`,
    });

    await booking.save();

    await sendNotification({
      userId: booking.customerId._id,
      title: 'Consultation Rescheduled',
      message: `Your consultation ${booking.bookingId} has been rescheduled to ${startTimeDate.toLocaleString('en-IN')}.`,
      type: 'CONSULTATION_RESCHEDULED',
      relatedBookingId: booking._id,
      recipientEmail: booking.customerId.email,
    });

    res.status(200).json({
      success: true,
      message: 'Consultation rescheduled successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Mark consultation completed
exports.markCompleted = async (req, res, next) => {
  try {
    const { executiveNotes } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id,
    }).populate('customerId', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.bookingStatus = 'COMPLETED';
    if (executiveNotes) booking.executiveNotes = executiveNotes;

    booking.statusHistory.push({
      status: 'COMPLETED',
      changedAt: new Date(),
      comment: 'Consultation completed successfully.',
    });

    await booking.save();

    // Increment completed consultations count
    await ExecutiveProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { totalConsultations: 1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Consultation marked as completed.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      executiveId: req.user._id,
    }).populate('customerId', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.bookingStatus = 'CANCELLED';
    booking.cancellationReason = cancellationReason || 'Cancelled by executive.';

    booking.statusHistory.push({
      status: 'CANCELLED',
      changedAt: new Date(),
      comment: booking.cancellationReason,
    });

    await booking.save();

    await sendNotification({
      userId: booking.customerId._id,
      title: 'Consultation Booking Cancelled',
      message: `Your consultation booking ${booking.bookingId} was cancelled. Reason: ${booking.cancellationReason}`,
      type: 'CONSULTATION_CANCELLED',
      relatedBookingId: booking._id,
      recipientEmail: booking.customerId.email,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Earnings Dashboard Data
exports.getEarningsSummary = async (req, res, next) => {
  try {
    const executiveId = req.user._id;

    // All bookings for this executive
    const allBookings = await Booking.find({ executiveId });

    // Verified bookings
    const verifiedBookings = allBookings.filter(
      (b) => b.paymentStatus === 'PAYMENT_VERIFIED'
    );

    const totalVerifiedGross = verifiedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const platformCommissionPercent = 10; // 10% platform facilitation fee
    const netEarnings = Math.round(totalVerifiedGross * (1 - platformCommissionPercent / 100));

    // Completed consultations
    const completedCount = allBookings.filter((b) => b.bookingStatus === 'COMPLETED').length;

    // Scheduled consultations
    const scheduledCount = allBookings.filter((b) => b.bookingStatus === 'SCHEDULED').length;

    // Pending payment verification
    const pendingVerifications = allBookings.filter(
      (b) => b.paymentStatus === 'SCREENSHOT_SUBMITTED' || b.paymentStatus === 'UNDER_VERIFICATION'
    );
    const pendingValue = pendingVerifications.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Cancelled count
    const cancelledCount = allBookings.filter((b) => b.bookingStatus === 'CANCELLED').length;

    // Monthly breakdown (last 6 months)
    const monthlyStats = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    verifiedBookings.forEach((b) => {
      const date = b.paymentVerificationDetails?.verifiedAt || b.createdAt;
      const d = new Date(date);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthlyStats[key]) {
        monthlyStats[key] = { month: key, gross: 0, net: 0, consultations: 0 };
      }
      monthlyStats[key].gross += b.totalAmount || 0;
      monthlyStats[key].net += Math.round((b.totalAmount || 0) * 0.9);
      monthlyStats[key].consultations += 1;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalVerifiedGross,
        netEarnings,
        platformCommissionPercent,
        completedCount,
        scheduledCount,
        pendingVerificationCount: pendingVerifications.length,
        pendingValue,
        cancelledCount,
        totalBookingsCount: allBookings.length,
      },
      monthlyBreakdown: Object.values(monthlyStats),
      recentTransactions: verifiedBookings.slice(0, 8),
    });
  } catch (error) {
    next(error);
  }
};

// Update Availability
exports.updateAvailability = async (req, res, next) => {
  try {
    const { isAvailable, workingDays, startTime, endTime, slotDurationMinutes, maxBookingsPerDay } = req.body;

    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    if (isAvailable !== undefined) profile.availability.isAvailable = Boolean(isAvailable);
    if (workingDays) profile.availability.workingDays = workingDays;
    if (startTime) profile.availability.startTime = startTime;
    if (endTime) profile.availability.endTime = endTime;
    if (slotDurationMinutes) profile.availability.slotDurationMinutes = Number(slotDurationMinutes);
    if (maxBookingsPerDay) profile.availability.maxBookingsPerDay = Number(maxBookingsPerDay);

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Availability settings saved successfully.',
      availability: profile.availability,
    });
  } catch (error) {
    next(error);
  }
};

// Update Zoom Settings
exports.updateZoomSettings = async (req, res, next) => {
  try {
    const { personalMeetingUrl, meetingPasscode, customInstructions } = req.body;

    const profile = await ExecutiveProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Executive profile not found.' });
    }

    if (personalMeetingUrl !== undefined) profile.zoomSettings.personalMeetingUrl = personalMeetingUrl.trim();
    if (meetingPasscode !== undefined) profile.zoomSettings.meetingPasscode = meetingPasscode.trim();
    if (customInstructions !== undefined) profile.zoomSettings.customInstructions = customInstructions.trim();

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Zoom settings updated successfully.',
      zoomSettings: profile.zoomSettings,
    });
  } catch (error) {
    next(error);
  }
};

