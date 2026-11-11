# Jyotishya Vani — Astrology Consultation & Booking Platform (Backend API)

A standalone, production-quality Node.js, Express, and MongoDB REST API engineered for authentic Vedic astrology consultations. The system supports independent astrologer consultation fees, personal UPI QR management, manual transaction verification, and Zoom video consultation scheduling.

---

## 1. Authentication & Signup Options for Both Roles

The platform provides dedicated registration (signup) and authentication for exactly two primary user roles:
1. **Executive Astrologer** (`EXECUTIVE`)
2. **Normal User / Client** (`NORMAL_USER`)

### A. Executive Astrologer Signup
- **Endpoint**: `POST /api/auth/executive/register`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "name": "Acharya Devavrata Sharma",
    "email": "devavrata@example.com",
    "phone": "+91 98888 77777",
    "password": "Password@123",
    "title": "Vedic Jyotish Acharya",
    "experience": 18,
    "pricePerMinute": 30,
    "specializations": ["Kundli Milan", "Prashna Kundli", "Vedic Remedies"],
    "qualifications": ["Jyotish Praveena", "Vedic Shastra Visharad"],
    "languages": ["Hindi", "English"],
    "upiId": "devavrata@upi",
    "biography": "Over 18 years of classical Parashari Jyotish guidance."
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Executive astrologer account registered successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "6af4cdc4e4b576d34fc8293e",
      "name": "Acharya Devavrata Sharma",
      "email": "devavrata@example.com",
      "phone": "+91 98888 77777",
      "role": "EXECUTIVE",
      "profileImage": ""
    },
    "profile": {
      "userId": "6af4cdc4e4b576d34fc8293e",
      "title": "Vedic Jyotish Acharya",
      "experience": 18,
      "pricePerMinute": 30,
      "upiId": "devavrata@upi",
      "specialization": ["Kundli Milan", "Prashna Kundli", "Vedic Remedies"],
      "availability": {
        "isAvailable": true,
        "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "startTime": "10:00",
        "endTime": "20:00",
        "slotDurationMinutes": 30
      }
    }
  }
  ```

---

### B. Client (Customer) Signup
- **Endpoint**: `POST /api/auth/user/register`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "name": "Rohit Verma",
    "email": "rohit.verma@example.com",
    "phone": "+91 97777 66666",
    "password": "Password@123",
    "dateOfBirth": "1992-04-18",
    "timeOfBirth": "08:15",
    "placeOfBirth": "Lucknow, Uttar Pradesh",
    "gender": "male"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Client account registered successfully. Welcome to Jyotishya Vani.",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "6af4cdc4e4b576d34fc82943",
      "name": "Rohit Verma",
      "email": "rohit.verma@example.com",
      "phone": "+91 97777 66666",
      "role": "NORMAL_USER",
      "birthDetails": {
        "dateOfBirth": "1992-04-18",
        "timeOfBirth": "08:15",
        "placeOfBirth": "Lucknow, Uttar Pradesh",
        "gender": "male"
      },
      "profileImage": ""
    }
  }
  ```

---

## 2. Pre-Seeded Development Accounts

| Role | Name | Email | Password | Starting Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Executive 1** | Pt. Radheshyam Mishra | `executive1@example.com` | `Pass@123` | ₹25 / min |
| **Executive 2** | Dr. Ananya Vashistha | `executive2@example.com` | `Pass@123` | ₹35 / min |
| **Client 1** | Vikramaditya Rathore | `user1@example.com` | `Pass@123` | Kundli Data Included |
| **Client 2** | Priya Sundaram | `user2@example.com` | `Pass@123` | Kundli Data Included |

---

## 3. Complete API Endpoint Reference

### Authentication (`/api/auth`)
- `POST /api/auth/executive/register`: Executive astrologer signup
- `POST /api/auth/executive/login`: Executive astrologer login
- `POST /api/auth/user/register`: Client (customer) signup
- `POST /api/auth/user/login`: Client (customer) login
- `POST /api/auth/forgot-password`: Generates password reset token
- `POST /api/auth/reset-password`: Resets password using token
- `GET /api/auth/me`: Fetches authenticated user profile & executive details (Protected)
- `PUT /api/auth/me`: Updates profile and birth details (Protected)

### Public Directory & Services (`/api/public`)
- `GET /api/public/astrologers`: List approved astrologers (supports `search`, `specialization`, `maxPrice`)
- `GET /api/public/astrologers/:id`: Single astrologer profile with ratings, pricing, and QR preview
- `GET /api/public/services`: Full catalog of 9 Vedic consultation services
- `POST /api/public/contact`: Submit consultation inquiry

### Customer Bookings (`/api/bookings`) — *Requires NORMAL_USER Token*
- `POST /api/bookings`: Create booking (calculates amount from server-side price snapshot)
- `GET /api/bookings/my-bookings`: List all customer bookings with status filter
- `GET /api/bookings/:id`: Booking details, executive QR code, and Zoom link (time-window guarded)
- `POST /api/bookings/:id/payment-proof`: Multipart upload of transaction screenshot (`screenshot` field)
- `POST /api/bookings/:id/review`: Rate (1-5 stars) and review completed consultation
- `PUT /api/bookings/:id/cancel`: Cancel pending booking

### Executive Operations (`/api/executive`) — *Requires EXECUTIVE Token*
- `GET /api/executive/profile`: Fetch current astrologer profile
- `PUT /api/executive/profile`: Update biography, credentials, specializations, languages
- `POST /api/executive/profile/photo`: Multipart upload of profile picture
- `PUT /api/executive/pricing`: Independently update consultation fee per minute (₹)
- `POST /api/executive/payment-qr`: Multipart upload of personal UPI QR code
- `DELETE /api/executive/payment-qr`: Remove personal UPI QR code
- `PUT /api/executive/payment-info`: Update UPI ID (VPA), name, and payment instructions
- `GET /api/executive/bookings`: Comprehensive bookings list with search & filters
- `GET /api/executive/bookings/:id`: Single booking detail with screenshot & customer Kundli details
- `PUT /api/executive/bookings/:id/verify-payment`: Manually verify and confirm payment receipt
- `PUT /api/executive/bookings/:id/reject-payment`: Reject payment proof with required reason
- `PUT /api/executive/bookings/:id/schedule`: Schedule Zoom meeting (calculates end time = start + duration)
- `PUT /api/executive/bookings/:id/reschedule`: Reschedule consultation with conflict prevention
- `PUT /api/executive/bookings/:id/complete`: Conclude consultation with remedies notes
- `PUT /api/executive/bookings/:id/cancel`: Cancel consultation with reason
- `GET /api/executive/earnings`: Financial ledger (gross verified vs net earnings after 10% fee)
- `PUT /api/executive/availability`: Toggle online status, working days, daily hours, slot length
- `PUT /api/executive/zoom-settings`: Configure fallback personal Zoom room & passcode

### Notifications (`/api/notifications`) — *Protected*
- `GET /api/notifications`: Fetch user's in-app notifications & unread counter
- `PUT /api/notifications/:id/read`: Mark single notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read

---

## 4. Backend Folder Structure

```
strologer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── cloudinary.js         # Cloudinary configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # Executive & Client registration/login
│   │   │   ├── executiveController.js# Profile, Pricing, QR, Zoom, Earnings
│   │   │   ├── bookingController.js  # Booking creation, review, client flow
│   │   │   ├── notificationController.js # In-app notification management
│   │   │   └── publicController.js   # Public astrologers, services, contact
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification & role authorization
│   │   │   ├── errorHandler.js       # Centralized error handling
│   │   │   ├── rateLimiter.js        # Auth and API rate limiters
│   │   │   └── upload.js             # Multer image upload & Cloudinary/local fallback
│   │   ├── models/
│   │   │   ├── User.js               # User schema (Executive / Normal User)
│   │   │   ├── ExecutiveProfile.js   # Astrologer profile, pricing, QR, availability
│   │   │   ├── Booking.js            # Booking schema, status history, Zoom details
│   │   │   └── Notification.js       # In-app notifications schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── executiveRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── publicRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── services/
│   │   │   ├── zoomService.js        # Zoom Server-to-Server OAuth & fallback
│   │   │   └── notificationService.js# In-app & optional SMTP email notifications
│   │   ├── utils/
│   │   │   └── seedData.js           # Seed demo accounts and sample bookings
│   │   └── server.js                 # Express server entry point
│   ├── uploads/                      # Local disk storage for uploaded screenshots & QR
│   ├── test-suite.js                 # Automated 36-assertion E2E test suite
│   ├── .env
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 5. How to Run Locally

### Start Backend Server
```bash
cd backend
npm install
npm run seed      # Seeds demo accounts and sample bookings
npm start         # Runs on http://localhost:5001
```

### Run Automated 36-Assertion Test Suite
```bash
cd backend
npm run seed && node test-suite.js
```
