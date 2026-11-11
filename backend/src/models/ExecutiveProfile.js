const mongoose = require('mongoose');

const executiveProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Acharya',
      trim: true,
    },
    biography: {
      type: String,
      default: 'Dedicated Vedic astrologer guiding seekers through authentic planetary wisdom and remedial measures.',
      maxlength: [3000, 'Biography cannot exceed 3000 characters'],
    },
    experience: {
      type: Number,
      default: 5,
      min: [0, 'Experience cannot be negative'],
    },
    specialization: {
      type: [String],
      default: ['Kundli Analysis', 'Career Guidance', 'Marriage Consultation'],
    },
    qualifications: {
      type: [String],
      default: ['Jyotish Praveena', 'Vedic Shastra Visharad'],
    },
    languages: {
      type: [String],
      default: ['Hindi', 'English'],
    },
    pricePerMinute: {
      type: Number,
      required: [true, 'Please specify your per-minute consultation fee'],
      min: [1, 'Price per minute must be at least ₹1'],
      default: 20,
    },
    qrCode: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      uploadedAt: { type: Date },
    },
    upiId: {
      type: String,
      default: '',
      trim: true,
    },
    upiName: {
      type: String,
      default: '',
      trim: true,
    },
    paymentInstructions: {
      type: String,
      default: 'Please scan the UPI QR code above using any UPI app (GPay, PhonePe, Paytm, BHIM). Once paid, upload the transaction screenshot clearly showing the 12-digit UTR/Ref number for manual verification.',
    },
    availability: {
      isAvailable: { type: Boolean, default: true },
      workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      startTime: { type: String, default: '10:00' }, // HH:mm
      endTime: { type: String, default: '20:00' },   // HH:mm
      slotDurationMinutes: { type: Number, default: 30 },
      maxBookingsPerDay: { type: Number, default: 12 },
    },
    zoomSettings: {
      personalMeetingUrl: { type: String, default: '' },
      meetingPasscode: { type: String, default: '' },
      customInstructions: { type: String, default: 'Please join using a stable internet connection in a quiet room with your birth details handy.' },
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 15,
    },
    totalConsultations: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ExecutiveProfile', executiveProfileSchema);

