const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ExecutiveProfile = require('../models/ExecutiveProfile');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

dotenv.config();

// SVG QR Code data URLs for realistic test payments
const sampleQr1 = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=radheshyam@upi&pn=Pt.%20Radheshyam%20Mishra&am=0&cu=INR';
const sampleQr2 = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=ananya.astro@okhdfcbank&pn=Dr.%20Ananya%20Vashistha&am=0&cu=INR';
const sampleReceiptImage = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/strologer_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ExecutiveProfile.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed]: Cleared existing collections');

    // 1. Create Executive 1
    const exec1User = await User.create({
      name: 'Pt. Radheshyam Mishra',
      email: 'executive1@example.com',
      phone: '+91 98765 43210',
      password: 'Pass@123',
      role: 'EXECUTIVE',
      profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    });

    const exec1Profile = await ExecutiveProfile.create({
      userId: exec1User._id,
      title: 'Jyotish Acharya & Gold Medalist',
      biography:
        'With over 22 years of devoted research in classical Parashari Jyotish and remedial astrology, Acharya Radheshyam Mishra has enlightened more than 15,000 seekers globally. Former visiting faculty at Varanasi Vedic Vidyapeeth, he combines rigorous scriptural precision with compassionate, practical guidance.',
      experience: 22,
      specialization: [
        'Kundli Analysis',
        'Career & Business Astrology',
        'Marriage Compatibility',
        'Vedic Remedies',
        'Kaal Sarp & Manglik Shanti',
      ],
      qualifications: [
        'Jyotish Acharya (Sampurnanand Sanskrit University)',
        'Gold Medalist in Vedic Astro-Sciences',
        'Vedic Shastra Ratna',
      ],
      languages: ['Hindi', 'Sanskrit', 'English'],
      pricePerMinute: 25,
      qrCode: {
        url: sampleQr1,
        publicId: 'seed-qr-exec1',
        uploadedAt: new Date(),
      },
      upiId: 'radheshyam@upi',
      upiName: 'Pt. Radheshyam Mishra',
      paymentInstructions:
        'Please scan the QR code using Google Pay, PhonePe, Paytm, or BHIM. After paying, take a screenshot clearly showing the 12-digit UPI Reference / UTR Number and upload it below.',
      availability: {
        isAvailable: true,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: '09:00',
        endTime: '19:30',
        slotDurationMinutes: 30,
        maxBookingsPerDay: 15,
      },
      zoomSettings: {
        personalMeetingUrl: 'https://us04web.zoom.us/j/84920183921?pwd=VedicAstroPt1',
        meetingPasscode: 'VEDIC108',
        customInstructions: 'Please sit in a quiet space with your birth details, time, and questions ready.',
      },
      approvalStatus: 'APPROVED',
      rating: 4.9,
      reviewCount: 48,
      totalConsultations: 124,
      featured: true,
    });

    // 2. Create Executive 2
    const exec2User = await User.create({
      name: 'Dr. Ananya Vashistha',
      email: 'executive2@example.com',
      phone: '+91 98765 12345',
      password: 'Pass@123',
      role: 'EXECUTIVE',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    });

    const exec2Profile = await ExecutiveProfile.create({
      userId: exec2User._id,
      title: 'Senior Vastu & KP Astrologer',
      biography:
        'Dr. Ananya Vashistha brings 16 years of analytical brilliance to KP Astrology, Vastu Shastra, and Numerology. Holding a doctorate in applied metaphysics, she provides scientific energy alignments for high-net-worth individuals, business founders, and modern families seeking clarity without superstition.',
      experience: 16,
      specialization: [
        'Vastu Shastra Consultation',
        'KP Astrology (Krishnamurti Paddhati)',
        'Gemstone Recommendations',
        'Numerology & Name Harmonization',
        'Corporate Vedic Consultation',
      ],
      qualifications: [
        'Ph.D in Applied Metaphysics & Astro-Vastu',
        'KP Astrology Certified Specialist',
        'Master Numerologist (International Guild)',
      ],
      languages: ['English', 'Hindi', 'Bengali'],
      pricePerMinute: 35,
      qrCode: {
        url: sampleQr2,
        publicId: 'seed-qr-exec2',
        uploadedAt: new Date(),
      },
      upiId: 'ananya.astro@okhdfcbank',
      upiName: 'Dr. Ananya Vashistha',
      paymentInstructions:
        'Kindly pay the exact amount using any UPI application. Ensure the transaction reference number is visible on the uploaded receipt.',
      availability: {
        isAvailable: true,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '11:00',
        endTime: '20:00',
        slotDurationMinutes: 30,
        maxBookingsPerDay: 10,
      },
      zoomSettings: {
        personalMeetingUrl: 'https://us04web.zoom.us/j/93847281923?pwd=DrAnanyaAstro2',
        meetingPasscode: 'VASTU35',
        customInstructions: 'Have your floor plan ready if booking a Vastu consultation.',
      },
      approvalStatus: 'APPROVED',
      rating: 4.8,
      reviewCount: 36,
      totalConsultations: 89,
      featured: true,
    });

    // 3. Create Normal User 1
    const user1 = await User.create({
      name: 'Vikramaditya Rathore',
      email: 'user1@example.com',
      phone: '+91 91234 56789',
      password: 'Pass@123',
      role: 'NORMAL_USER',
      birthDetails: {
        dateOfBirth: '1994-08-15',
        timeOfBirth: '06:30',
        placeOfBirth: 'Varanasi, Uttar Pradesh',
        gender: 'male',
      },
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    });

    // 4. Create Normal User 2
    const user2 = await User.create({
      name: 'Priya Sundaram',
      email: 'user2@example.com',
      phone: '+91 98111 22334',
      password: 'Pass@123',
      role: 'NORMAL_USER',
      birthDetails: {
        dateOfBirth: '1997-12-04',
        timeOfBirth: '14:20',
        placeOfBirth: 'Bengaluru, Karnataka',
        gender: 'female',
      },
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    });

    console.log('[Seed]: Created demo accounts (2 Executives, 2 Normal Users)');

    // 5. Seed Bookings
    const today = new Date();
    const scheduledStart = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now for immediate test join!
    const scheduledEnd = new Date(scheduledStart.getTime() + 20 * 60 * 1000);

    // Booking A: User 1 with Exec 1 -> Under Verification with Screenshot
    const bookingA = await Booking.create({
      bookingId: 'ASTRO-2026-1001',
      customerId: user1._id,
      executiveId: exec1User._id,
      consultationTopic: 'Kundli & Janam Patrika Analysis',
      problemDescription: 'Seeking guidance regarding career transition and upcoming Mahadasha transit effects.',
      clientBirthDetails: user1.birthDetails,
      selectedDuration: 30,
      pricePerMinuteSnapshot: 25,
      totalAmount: 750,
      preferredDate: new Date(today.getTime() + 86400000),
      preferredTime: '11:00 AM',
      paymentStatus: 'UNDER_VERIFICATION',
      bookingStatus: 'PAYMENT_SUBMITTED',
      paymentScreenshot: {
        url: sampleReceiptImage,
        publicId: 'seed-receipt-1',
        uploadedAt: new Date(),
        transactionRef: 'UPI-984729103847',
        resubmissionCount: 0,
      },
      statusHistory: [
        { status: 'CREATED', changedAt: new Date(Date.now() - 3600000), comment: 'Booking initialized' },
        { status: 'PAYMENT_SUBMITTED', changedAt: new Date(), comment: 'Screenshot uploaded with UTR: UPI-984729103847' },
      ],
    });

    // Booking B: User 2 with Exec 1 -> Verified & Scheduled (Starting in 15 mins!)
    const bookingB = await Booking.create({
      bookingId: 'ASTRO-2026-1002',
      customerId: user2._id,
      executiveId: exec1User._id,
      consultationTopic: 'Career, Job & Business Guidance',
      problemDescription: 'Evaluating new partnership offer and timing for funding round.',
      clientBirthDetails: user2.birthDetails,
      selectedDuration: 20,
      pricePerMinuteSnapshot: 25,
      totalAmount: 500,
      preferredDate: today,
      preferredTime: '05:30 PM',
      paymentStatus: 'PAYMENT_VERIFIED',
      bookingStatus: 'SCHEDULED',
      paymentScreenshot: {
        url: sampleReceiptImage,
        publicId: 'seed-receipt-2',
        uploadedAt: new Date(Date.now() - 7200000),
        transactionRef: 'UPI-119283746592',
      },
      paymentVerificationDetails: {
        verifiedAt: new Date(Date.now() - 3600000),
        verifiedBy: exec1User._id,
        notes: 'Verified via GPay business transaction statement.',
      },
      scheduledStartTime: scheduledStart,
      scheduledEndTime: scheduledEnd,
      zoomMeetingId: '84920183921',
      zoomMeetingUrl: 'https://us04web.zoom.us/j/84920183921?pwd=VedicAstroPt1',
      zoomPasscode: 'VEDIC108',
      joinWindowMinutes: 10,
      statusHistory: [
        { status: 'CREATED', changedAt: new Date(Date.now() - 7200000), comment: 'Booking created' },
        { status: 'PAYMENT_VERIFIED', changedAt: new Date(Date.now() - 3600000), comment: 'Verified' },
        { status: 'SCHEDULED', changedAt: new Date(Date.now() - 1800000), comment: 'Consultation scheduled' },
      ],
    });

    // Booking C: User 1 with Exec 2 -> Completed with rating & review
    const bookingC = await Booking.create({
      bookingId: 'ASTRO-2026-1003',
      customerId: user1._id,
      executiveId: exec2User._id,
      consultationTopic: 'Vastu Shastra Consultation',
      problemDescription: 'Energy balancing and home office entrance orientation.',
      clientBirthDetails: user1.birthDetails,
      selectedDuration: 45,
      pricePerMinuteSnapshot: 35,
      totalAmount: 1575,
      preferredDate: new Date(Date.now() - 7 * 86400000),
      preferredTime: '03:00 PM',
      paymentStatus: 'PAYMENT_VERIFIED',
      bookingStatus: 'COMPLETED',
      paymentScreenshot: {
        url: sampleReceiptImage,
        publicId: 'seed-receipt-3',
        uploadedAt: new Date(Date.now() - 7 * 86400000),
      },
      paymentVerificationDetails: {
        verifiedAt: new Date(Date.now() - 7 * 86400000),
        verifiedBy: exec2User._id,
        notes: 'Payment confirmed.',
      },
      scheduledStartTime: new Date(Date.now() - 7 * 86400000),
      scheduledEndTime: new Date(Date.now() - 7 * 86400000 + 45 * 60000),
      zoomMeetingId: '93847281923',
      zoomMeetingUrl: 'https://us04web.zoom.us/j/93847281923?pwd=DrAnanyaAstro2',
      executiveNotes: 'Suggested North-East water element placement and brass helix remedy.',
      clientRating: 5,
      clientReview:
        'Exceptional clarity! Dr. Ananya gave precise non-destructive Vastu remedies that brought immediate peace to our home. Worth every rupee.',
      statusHistory: [
        { status: 'COMPLETED', changedAt: new Date(Date.now() - 7 * 86400000), comment: 'Completed' },
      ],
    });

    // Booking D: User 2 with Exec 2 -> Payment Pending
    const bookingD = await Booking.create({
      bookingId: 'ASTRO-2026-1004',
      customerId: user2._id,
      executiveId: exec2User._id,
      consultationTopic: 'Gemstone & Vedic Remedies Guidance',
      problemDescription: 'Seeking advice for auspicious gemstone for mental peace.',
      clientBirthDetails: user2.birthDetails,
      selectedDuration: 15,
      pricePerMinuteSnapshot: 35,
      totalAmount: 525,
      preferredDate: new Date(Date.now() + 2 * 86400000),
      preferredTime: '04:00 PM',
      paymentStatus: 'PAYMENT_PENDING',
      bookingStatus: 'CREATED',
    });

    // 6. Create Notifications
    await Notification.create([
      {
        userId: exec1User._id,
        title: 'New Payment Screenshot Received',
        message: `Vikramaditya Rathore has uploaded a payment screenshot for booking ASTRO-2026-1001 (₹750). Please verify.`,
        type: 'PAYMENT_SUBMITTED',
        relatedBookingId: bookingA._id,
        read: false,
      },
      {
        userId: user2._id,
        title: 'Consultation Scheduled & Ready',
        message: `Your consultation with Pt. Radheshyam Mishra is confirmed for ${scheduledStart.toLocaleTimeString()}. The Zoom join button is active.`,
        type: 'CONSULTATION_SCHEDULED',
        relatedBookingId: bookingB._id,
        read: false,
      },
    ]);

    console.log('[Seed]: Successfully populated initial test data and sample bookings!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

