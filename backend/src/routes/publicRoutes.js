const express = require('express');
const router = express.Router();
const {
  getPublicAstrologers,
  getPublicAstrologerById,
  getServices,
  submitContactMessage,
} = require('../controllers/publicController');

router.get('/astrologers', getPublicAstrologers);
router.get('/astrologers/:id', getPublicAstrologerById);
router.get('/services', getServices);
router.post('/contact', submitContactMessage);

module.exports = router;
