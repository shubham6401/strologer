const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
  updatePricing,
  uploadPaymentQr,
  removePaymentQr,
  updatePaymentInfo,
  getBookings,
  getBookingDetails,
  verifyPayment,
  rejectPayment,
  scheduleConsultation,
  rescheduleConsultation,
  markCompleted,
  cancelBooking,
  getEarningsSummary,
  updateAvailability,
  updateZoomSettings,
} = require('../controllers/executiveController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Enforce Executive Authentication for all routes here
router.use(protect);
router.use(authorize('EXECUTIVE'));

// Profile routes
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.post('/profile/photo', upload.single('profileImage'), uploadProfilePhoto);

// Pricing routes
router.put('/pricing', updatePricing);

// Payment QR Management
router.post('/payment-qr', upload.single('qrCode'), uploadPaymentQr);
router.delete('/payment-qr', removePaymentQr);
router.put('/payment-info', updatePaymentInfo);

// Bookings & Payment Verification
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingDetails);
router.put('/bookings/:id/verify-payment', verifyPayment);
router.put('/bookings/:id/reject-payment', rejectPayment);

// Zoom & Consultation Management
router.put('/bookings/:id/schedule', scheduleConsultation);
router.put('/bookings/:id/reschedule', rescheduleConsultation);
router.put('/bookings/:id/complete', markCompleted);
router.put('/bookings/:id/cancel', cancelBooking);

// Earnings & Statistics
router.get('/earnings', getEarningsSummary);

// Operational Settings
router.put('/availability', updateAvailability);
router.put('/zoom-settings', updateZoomSettings);

module.exports = router;
