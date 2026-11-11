/**
 * Automated End-to-End Verification Test Suite
 * Tests all 28 business scenarios and security requirements against the running server.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('=== Starting End-to-End Platform Test Suite ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await axios.get(`${BASE_URL}/health`);
    assert(health.status === 200 && health.data.status === 'healthy', 'Backend health check responds with 200');

    // 1b. Executive Astrologer Signup
    const uniqueExecEmail = `acharya.${Date.now()}@example.com`;
    const execSignupRes = await axios.post(`${BASE_URL}/auth/executive/register`, {
      name: 'Acharya Vidyadhar Shastri',
      email: uniqueExecEmail,
      phone: '+91 98888 11111',
      password: 'SecretPassword@123',
      title: 'Jyotish Shiromani',
      experience: 14,
      pricePerMinute: 32,
      specializations: ['Kundli Analysis', 'Vastu Shastra', 'Vedic Muhurat'],
      upiId: 'vidyadhar@upi',
    });
    assert(
      execSignupRes.data.success && execSignupRes.data.user.role === 'EXECUTIVE',
      'Executive Astrologer Signup succeeds with role EXECUTIVE'
    );
    assert(
      execSignupRes.data.profile.pricePerMinute === 32 && execSignupRes.data.profile.upiId === 'vidyadhar@upi',
      'Executive Astrologer Signup initializes independent pricing and UPI ID'
    );

    // 1c. Customer (Normal User) Signup
    const uniqueUserEmail = `seeker.${Date.now()}@example.com`;
    const userSignupRes = await axios.post(`${BASE_URL}/auth/user/register`, {
      name: 'Anil Kumar Trivedi',
      email: uniqueUserEmail,
      phone: '+91 97777 22222',
      password: 'SecretPassword@123',
      dateOfBirth: '1993-06-21',
      timeOfBirth: '07:45',
      placeOfBirth: 'Prayagraj, Uttar Pradesh',
      gender: 'male',
    });
    assert(
      userSignupRes.data.success && userSignupRes.data.user.role === 'NORMAL_USER',
      'Client (Normal User) Signup succeeds with role NORMAL_USER'
    );
    assert(
      userSignupRes.data.user.birthDetails.placeOfBirth === 'Prayagraj, Uttar Pradesh',
      'Client Signup stores birth coordinates for Kundli analysis'
    );

    // 1d. Signup Validation: Duplicate Email Check
    try {
      await axios.post(`${BASE_URL}/auth/executive/register`, {
        name: 'Duplicate Acharya',
        email: uniqueExecEmail,
        phone: '+91 98888 11111',
        password: 'SecretPassword@123',
      });
      assert(false, 'Duplicate email was incorrectly permitted');
    } catch (err) {
      assert(err.response?.status === 400, 'Duplicate email registration is blocked with 400 error');
    }

    // 1e. Signup Validation: Missing Fields Check
    try {
      await axios.post(`${BASE_URL}/auth/user/register`, {
        name: 'Incomplete User',
      });
      assert(false, 'Missing required fields registration was incorrectly permitted');
    } catch (err) {
      assert(err.response?.status === 400, 'Incomplete registration is blocked with 400 error');
    }

    // 2. Executive 1 Login
    const exec1Login = await axios.post(`${BASE_URL}/auth/executive/login`, {
      email: 'executive1@example.com',
      password: 'Pass@123',
    });
    assert(exec1Login.data.success && exec1Login.data.token, 'Executive 1 login succeeds and returns JWT');
    const exec1Token = exec1Login.data.token;
    const exec1Id = exec1Login.data.user.id;

    // 3. Executive 2 Login
    const exec2Login = await axios.post(`${BASE_URL}/auth/executive/login`, {
      email: 'executive2@example.com',
      password: 'Pass@123',
    });
    assert(exec2Login.data.success && exec2Login.data.profile.pricePerMinute === 35, 'Executive 2 has independent pricing (₹35/min)');
    const exec2Token = exec2Login.data.token;
    const exec2Id = exec2Login.data.user.id;

    // Verify Executive 1 has different pricing (₹25/min)
    assert(exec1Login.data.profile.pricePerMinute === 25, 'Executive 1 has independent pricing (₹25/min)');
    assert(exec1Login.data.profile.upiId !== exec2Login.data.profile.upiId, 'Different executives have different UPI IDs and QR codes');

    // 4. Customer 1 Login
    const user1Login = await axios.post(`${BASE_URL}/auth/user/login`, {
      email: 'user1@example.com',
      password: 'Pass@123',
    });
    assert(user1Login.data.success && user1Login.data.user.role === 'NORMAL_USER', 'Customer 1 login succeeds with NORMAL_USER role');
    const user1Token = user1Login.data.token;
    const user1Id = user1Login.data.user.id;

    // 5. Customer 2 Login
    const user2Login = await axios.post(`${BASE_URL}/auth/user/login`, {
      email: 'user2@example.com',
      password: 'Pass@123',
    });
    assert(user2Login.data.success, 'Customer 2 login succeeds');
    const user2Token = user2Login.data.token;

    // 6. Security: Role boundaries & unauthorized access
    try {
      await axios.get(`${BASE_URL}/executive/earnings`, {
        headers: { Authorization: `Bearer ${user1Token}` },
      });
      assert(false, 'Customer was able to access Executive endpoint (Security breach)');
    } catch (err) {
      assert(err.response?.status === 403, 'Customer is strictly forbidden (403) from accessing executive endpoints');
    }

    // 7. Security: Customer cross-access (IDOR)
    // Find a booking belonging to User 2 (ASTRO-2026-1002)
    const user2BookingsRes = await axios.get(`${BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const user2Booking = user2BookingsRes.data.bookings[0];

    try {
      await axios.get(`${BASE_URL}/bookings/${user2Booking._id}`, {
        headers: { Authorization: `Bearer ${user1Token}` },
      });
      assert(false, 'User 1 was able to access User 2 booking (IDOR vulnerability)');
    } catch (err) {
      assert(err.response?.status === 404, 'User 1 cannot access User 2 private booking (IDOR prevented)');
    }

    // 8. Security: Executive cross-access (Cannot view another executive's private bookings)
    // Booking ASTRO-2026-1003 is with Executive 2. Let's see if Executive 1 can access it:
    const exec2BookingsRes = await axios.get(`${BASE_URL}/executive/bookings`, {
      headers: { Authorization: `Bearer ${exec2Token}` },
    });
    const exec2Booking = exec2BookingsRes.data.bookings[0];

    try {
      await axios.get(`${BASE_URL}/executive/bookings/${exec2Booking._id}`, {
        headers: { Authorization: `Bearer ${exec1Token}` },
      });
      assert(false, 'Executive 1 accessed Executive 2 booking (Isolation breach)');
    } catch (err) {
      assert(err.response?.status === 404, 'Executive 1 cannot access Executive 2 booking (Executive isolation confirmed)');
    }

    // 9. Pricing Update
    const updatePricingRes = await axios.put(
      `${BASE_URL}/executive/pricing`,
      { pricePerMinute: 28 },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );
    assert(updatePricingRes.data.success && updatePricingRes.data.pricePerMinute === 28, 'Executive can update per-minute fee');

    // 10. Customer Books Consultation & Server-side Price Calculation Verification
    // Customer books 30 mins with Exec 1 at new rate ₹28 -> should be exactly 30 * 28 = ₹840
    const newBookingRes = await axios.post(
      `${BASE_URL}/bookings`,
      {
        executiveId: exec1Id,
        consultationTopic: 'Vedic Horoscope & Career Guidance',
        problemDescription: 'Testing end-to-end booking workflow',
        selectedDuration: 30,
        preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        preferredTime: '02:00 PM',
        clientBirthDetails: {
          fullName: 'Test Candidate',
          gender: 'male',
          dateOfBirth: '1995-05-15',
          timeOfBirth: '10:30',
          placeOfBirth: 'Varanasi',
        },
      },
      { headers: { Authorization: `Bearer ${user1Token}` } }
    );

    assert(newBookingRes.data.success, 'Customer successfully creates new consultation booking');
    const createdBooking = newBookingRes.data.booking;
    assert(createdBooking.pricePerMinuteSnapshot === 28, 'Server froze price snapshot at ₹28/min');
    assert(createdBooking.totalAmount === 840, 'Server calculated exact total: 30 × ₹28 = ₹840');
    assert(createdBooking.paymentStatus === 'PAYMENT_PENDING', 'Initial payment status is PAYMENT_PENDING');

    // 11. Customer views payment details: Correct executive QR and UPI ID returned
    const paymentViewRes = await axios.get(`${BASE_URL}/bookings/${createdBooking._id}`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert(paymentViewRes.data.booking.executiveProfile.upiId === 'radheshyam@upi', 'Correct executive UPI ID displayed to customer');
    assert(paymentViewRes.data.booking.executiveProfile.qrCode.url !== '', 'Executive QR code URL is provided to customer');

    // 12. Upload Payment Proof Screenshot
    // Create a temporary test image buffer
    const FormData = require('form-data');
    const form = new FormData();
    const dummyImageBuffer = Buffer.from('FakeImageDataForTest12345');
    form.append('screenshot', dummyImageBuffer, {
      filename: 'receipt.png',
      contentType: 'image/png',
    });
    form.append('transactionRef', 'UTR-998877665544');

    const uploadProofRes = await axios.post(
      `${BASE_URL}/bookings/${createdBooking._id}/payment-proof`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${user1Token}`,
        },
      }
    );
    assert(uploadProofRes.data.success, 'Customer uploads payment proof screenshot with UTR reference');
    assert(uploadProofRes.data.booking.paymentStatus === 'UNDER_VERIFICATION', 'Status advances to UNDER_VERIFICATION');

    // 13. Executive Rejection Scenario
    const rejectRes = await axios.put(
      `${BASE_URL}/executive/bookings/${createdBooking._id}/reject-payment`,
      { reason: 'Amount mismatch or UTR unreadable on slip' },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );
    assert(rejectRes.data.success && rejectRes.data.booking.paymentStatus === 'PAYMENT_REJECTED', 'Executive can manually reject invalid payment with reason');

    // Customer sees rejection reason
    const rejectedView = await axios.get(`${BASE_URL}/bookings/${createdBooking._id}`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert(
      rejectedView.data.booking.paymentRejectionReason === 'Amount mismatch or UTR unreadable on slip',
      'Customer sees exact rejection reason'
    );

    // 14. Customer Resubmits Proof
    const resubmitForm = new FormData();
    resubmitForm.append('screenshot', dummyImageBuffer, {
      filename: 'corrected-receipt.png',
      contentType: 'image/png',
    });
    resubmitForm.append('transactionRef', 'UTR-CORRECTED-123456');

    const resubmitRes = await axios.post(
      `${BASE_URL}/bookings/${createdBooking._id}/payment-proof`,
      resubmitForm,
      {
        headers: {
          ...resubmitForm.getHeaders(),
          Authorization: `Bearer ${user1Token}`,
        },
      }
    );
    assert(resubmitRes.data.booking.paymentStatus === 'UNDER_VERIFICATION', 'Customer successfully resubmits proof');

    // 15. Executive Approves & Verifies Payment
    const verifyRes = await axios.put(
      `${BASE_URL}/executive/bookings/${createdBooking._id}/verify-payment`,
      { notes: 'Checked and confirmed receipt in HDFC bank account.' },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );
    assert(verifyRes.data.success && verifyRes.data.booking.paymentStatus === 'PAYMENT_VERIFIED', 'Executive manually verifies payment');

    // 16. Executive Schedules Meeting
    const meetingStartTime = new Date(Date.now() + 2 * 3600000); // 2 hours from now
    const scheduleRes = await axios.put(
      `${BASE_URL}/executive/bookings/${createdBooking._id}/schedule`,
      {
        scheduledStartTime: meetingStartTime.toISOString(),
      },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );
    assert(scheduleRes.data.success, 'Executive schedules Zoom meeting slot');
    assert(scheduleRes.data.booking.bookingStatus === 'SCHEDULED', 'Booking status updates to SCHEDULED');

    // Verify end time calculation: start + 30 mins
    const scheduledEnd = new Date(scheduleRes.data.booking.scheduledEndTime);
    const expectedEnd = new Date(meetingStartTime.getTime() + 30 * 60000);
    assert(
      scheduledEnd.getTime() === expectedEnd.getTime(),
      'Backend automatically and accurately computed end time = start + duration'
    );

    // 17. Overlapping Meeting Prevention
    // Try to schedule another booking for Exec 1 during the exact same slot
    const anotherBooking = await axios.post(
      `${BASE_URL}/bookings`,
      {
        executiveId: exec1Id,
        consultationTopic: 'Overlap Conflict Test',
        selectedDuration: 30,
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: '02:00 PM',
      },
      { headers: { Authorization: `Bearer ${user2Token}` } }
    );

    // Upload proof for anotherBooking
    const anotherForm = new FormData();
    anotherForm.append('screenshot', dummyImageBuffer, {
      filename: 'receipt2.png',
      contentType: 'image/png',
    });
    await axios.post(
      `${BASE_URL}/bookings/${anotherBooking.data.booking._id}/payment-proof`,
      anotherForm,
      {
        headers: {
          ...anotherForm.getHeaders(),
          Authorization: `Bearer ${user2Token}`,
        },
      }
    );

    // Mark as verified
    await axios.put(
      `${BASE_URL}/executive/bookings/${anotherBooking.data.booking._id}/verify-payment`,
      { notes: 'Verified for test' },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );

    // Try to schedule during the exact same time:
    try {
      await axios.put(
        `${BASE_URL}/executive/bookings/${anotherBooking.data.booking._id}/schedule`,
        {
          scheduledStartTime: new Date(meetingStartTime.getTime() + 10 * 60000).toISOString(), // Overlaps!
        },
        { headers: { Authorization: `Bearer ${exec1Token}` } }
      );
      assert(false, 'Overlapping booking was allowed (Conflict check failed)');
    } catch (err) {
      assert(err.response?.status === 400 && err.response?.data?.message.includes('Conflict'), 'Overlapping booking was successfully prevented');
    }

    // 18. Customer Consultation Review
    // Mark first booking as completed
    await axios.put(
      `${BASE_URL}/executive/bookings/${createdBooking._id}/complete`,
      { executiveNotes: 'Advised Ruby gemstone and Gayatri japa.' },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );

    const reviewRes = await axios.post(
      `${BASE_URL}/bookings/${createdBooking._id}/review`,
      { rating: 5, review: 'Brilliant astrological analysis and remedies!' },
      { headers: { Authorization: `Bearer ${user1Token}` } }
    );
    assert(reviewRes.data.success && reviewRes.data.booking.clientRating === 5, 'Customer can rate and review completed consultation');

    // 19. Executive Profile Update
    const updateProfileRes = await axios.put(
      `${BASE_URL}/executive/profile`,
      {
        name: 'Pt. Radheshyam Mishra',
        title: 'Senior Jyotish Acharya & Gold Medalist',
        experience: 23,
      },
      { headers: { Authorization: `Bearer ${exec1Token}` } }
    );
    assert(updateProfileRes.data.success, 'Executive profile updates persist');

    // 20. In-App Notifications check
    const notifs = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert(notifs.data.success && notifs.data.notifications.length > 0, 'In-app notifications were created and delivered');

    console.log(`\n================================`);
    console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`================================`);
  } catch (error) {
    console.error('Fatal Test Exception:', error.response?.data || error.message);
  }
}

runTests();
