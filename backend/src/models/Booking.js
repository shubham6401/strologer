const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    executiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    consultationTopic: {
      type: String,
      required: [true, 'Please specify the consultation topic'],
      trim: true,
    },
    problemDescription: {
      type: String,
      default: '',
      maxlength: [2000, 'Problem description cannot exceed 2000 characters'],
    },
    clientBirthDetails: {
      fullName: { type: String, default: '' },
      gender: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      timeOfBirth: { type: String, default: '' },
      placeOfBirth: { type: String, default: '' },
    },
    selectedDuration: {
      type: Number,
      required: [true, 'Please select consultation duration in minutes'],
      min: [5, 'Duration must be at least 5 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    pricePerMinuteSnapshot: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please select preferred date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please select preferred time slot'],
    },
    paymentStatus: {
      type: String,
      enum: [
        'PAYMENT_PENDING',
        'SCREENSHOT_SUBMITTED',
        'UNDER_VERIFICATION',
        'PAYMENT_VERIFIED',
        'PAYMENT_REJECTED',
      ],
      default: 'PAYMENT_PENDING',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: [
        'CREATED',
        'PAYMENT_SUBMITTED',
        'PAYMENT_VERIFIED',
        'SCHEDULED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'CREATED',
      index: true,
    },
    paymentScreenshot: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      uploadedAt: { type: Date },
      transactionRef: { type: String, default: '' },
      resubmissionCount: { type: Number, default: 0 },
    },
    paymentVerificationDetails: {
      verifiedAt: { type: Date },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: { type: String, default: '' },
    },
    paymentRejectionReason: {
      type: String,
      default: '',
    },
    paymentRejectionHistory: [
      {
        reason: { type: String },
        rejectedAt: { type: Date, default: Date.now },
        screenshotUrl: { type: String },
      },
    ],
    scheduledStartTime: {
      type: Date,
    },
    scheduledEndTime: {
      type: Date,
    },
    zoomMeetingId: {
      type: String,
      default: '',
    },
    zoomMeetingUrl: {
      type: String,
      default: '',
    },
    zoomPasscode: {
      type: String,
      default: '',
    },
    joinWindowMinutes: {
      type: Number,
      default: 10,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
    executiveNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    clientRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    clientReview: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overlapping scheduled consultations for the same executive
bookingSchema.index({ executiveId: 1, scheduledStartTime: 1, scheduledEndTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
