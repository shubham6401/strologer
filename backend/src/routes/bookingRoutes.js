const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyCustomerBookings,
  getCustomerBookingDetails,
  submitPaymentProof,
  submitReview,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Enforce Normal User authentication
router.use(protect);
router.use(authorize('NORMAL_USER'));

// Booking endpoints
router.post('/', createBooking);
router.get('/my-bookings', getMyCustomerBookings);
router.get('/:id', getCustomerBookingDetails);
router.post('/:id/payment-proof', upload.single('screenshot'), submitPaymentProof);
router.post('/:id/review', submitReview);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

