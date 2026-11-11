const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'BOOKING_NEW',
        'PAYMENT_SUBMITTED',
        'PAYMENT_VERIFIED',
        'PAYMENT_REJECTED',
        'CONSULTATION_SCHEDULED',
        'CONSULTATION_RESCHEDULED',
        'CONSULTATION_REMINDER',
        'CONSULTATION_CANCELLED',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    relatedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);

