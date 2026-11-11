# Jyotishya Vani — Astrology Consultation & Booking Platform

A full-stack commercial MERN platform engineered for authentic Vedic astrology consultations. The platform enables **Astrologers (Executives)** to independently control their per-minute fees, upload and manage dedicated UPI QR codes, manually verify bank statement receipts, and conduct 1-on-1 Zoom video consultations. **Seekers (Clients)** can explore verified Acharyas, choose tailored consultation durations, execute direct UPI payments, submit payment screenshots, and attend scheduled consultations with interactive duration tracking.

---

## 1. System Architecture & Design Philosophy

### Design Philosophy
- **Authentic Indian Identity**: Warm ivory (`#FAF7F2`), cream, muted gold (`#C5A059`), deep maroon (`#6B1010`), and warm slate.
- **Human-Crafted Elegance**: Playfair Display for headings and Inter for body text. Hand-crafted geometric Vedic motifs and clean borders without generic AI templates or unnecessary gradients.
- **Administrative Precision**: Tables with responsive data layouts instead of repeated card widgets for management screens.
- **Every Button Performs a Real Action**: No decorative dead controls.

### Security & Role Isolation
- **Strict Role-Based Access Control (RBAC)**: Distinct `EXECUTIVE` and `NORMAL_USER` roles validated cryptographically via JWT and MongoDB queries.
- **IDOR Prevention**: Customers can never inspect other customers' private charts or bookings; executives can never view another executive's bookings or earnings.
- **Snapshot Pricing Guarantee**: When a booking is initialized, the server freezes the astrologer's current per-minute rate into `pricePerMinuteSnapshot`. Subsequent pricing changes will not mutate existing bookings.
- **Manual UPI Verification Workflow**: Fulfills the requirement that no payment is automatically verified upon upload. Astrologers inspect their UPI/banking statement before approving or rejecting with a clear reason.
- **Session Duration Management**: Interactive timer with 5-minute and 1-minute expiration warnings, recognizing that standard Zoom rooms do not forcibly terminate calls.

---

## 2. Development Demo Credentials

| Role | Name | Email | Password | Per-Minute Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Executive 1** | Pt. Radheshyam Mishra | `executive1@example.com` | `Pass@123` | ₹25 / min |
| **Executive 2** | Dr. Ananya Vashistha | `executive2@example.com` | `Pass@123` | ₹35 / min |
| **Client 1** | Vikramaditya Rathore | `user1@example.com` | `Pass@123` | — |
| **Client 2** | Priya Sundaram | `user2@example.com` | `Pass@123` | — |

> **Note**: Both login portals (`/executive/login` and `/login`) include **One-Click Demo Fill** buttons for immediate testing.

---

## 3. Implemented Capabilities

### A. Public Astrology Website
- **Navigation Bar**: Desktop and mobile responsive drawer with branding and auth detection.
- **Hero Section**: Clear headline, consultation value proposition, duration calculator widget, and trust badges.
- **About Section**: Classical Vedanga Jyotisha philosophy, ethics policy (zero fear-mongering), and credentials vetting.
- **Services Catalog**: Kundli Analysis, Career Guidance, Marriage Compatibility, Kundli Milan, Vastu Shastra, Gemstones, Numerology, and Personal Consultation.
- **Astrologers Directory**: Search by keyword/name, filter by specialization, filter by maximum price per minute, view detailed biographies, and book directly.
- **How It Works**: 6-step visual guide detailing astrologer selection, duration selection, UPI payment, screenshot upload, manual verification, and Zoom session attendance.
- **Testimonials & FAQ**: Client testimonials with ratings, and interactive FAQ accordion.
- **Contact & Legal**: Interactive contact form, consultation desk details, Privacy Policy, and Terms of Service.

### B. Executive Astrologer Portal (`/executive/*`)
1. **Overview Dashboard**: Verified gross revenue, net earnings, active scheduled sessions, pending verifications, immediate next session banner, and recent bookings table.
2. **My Profile**: Profile photo upload, Acharya title, phone, biography, experience, specialization tags, credentials, and languages.
3. **Consultation Pricing**: Independent per-minute fee input with live multi-duration calculation matrix (10m, 15m, 20m, 30m, 45m, 60m).
4. **Payment QR Management**: Upload personal UPI QR code, preview, replace, remove, UPI ID (VPA), beneficiary name, and custom payment instructions.
5. **Booking Requests Table**: Administrative table with status filters (Under Verification, Payment Pending, Scheduled, Completed, Rejected), search, and high-resolution inspection modal.
6. **Manual Payment Verification Queue**: Review submitted payment receipts, view transaction UTR numbers, view enlarged screenshots, approve and record verification timestamp, or reject with a reason.
7. **Scheduled Consultations**: Schedule meeting times for verified bookings, auto-calculate end times, generate Zoom meetings, conflict overlap prevention, reschedule sessions, and mark as completed with remedies.
8. **Consultation History**: Past completed and cancelled sessions with audit trail, client ratings, and notes.
9. **Earnings Ledger**: Verified gross payments vs net earnings (after 10% platform fee), monthly revenue ledger, and operational metrics.
10. **Availability Settings**: Active consultation toggle, working days toggles (Mon-Sun), start/end times, and max bookings per day.
11. **Zoom Video Settings**: Personal Zoom room URL, meeting passcode, and custom room instructions for clients.
12. **Notification Center**: In-app notifications feed with unread badge counter, mark as read, and mark all as read.

### C. Client Consultation Portal (`/dashboard/*` & `/payment/*`)
1. **Client Dashboard**: Overview of scheduled appointments, active session timer, pending payments, and recent bookings.
2. **Booking Workflow (`/book/:astrologerId`)**: Select duration (10, 15, 20, 30, 45, 60 mins), live price calculation, preferred date/time, consultation topic, problem description, and birth chart details (date, time, place of birth).
3. **Payment Portal (`/payment/:bookingId`)**:
   - Displays selected astrologer's dedicated UPI QR Code, UPI ID with one-click copy, and exact payable amount.
   - Drag & drop / file picker payment screenshot upload (JPG, JPEG, PNG).
   - Live screenshot preview and UTR reference number input.
   - Status timeline: Created -> Proof Submitted -> Under Verification -> Payment Verified -> Scheduled -> Completed.
   - Rejection notice display with astrologer's reason and one-click resubmission form.
   - When scheduled: displays date, start time, end time, duration, Zoom meeting link, and live session countdown.
4. **Consultation Timer (`ConsultationTimer.jsx`)**:
   - Real-time countdown to session start.
   - Join button activates 10 minutes prior to scheduled start.
   - In-meeting timer showing minutes and seconds remaining with visual alert at <5 minutes and <1 minute.
   - Time management policy notice explaining that Zoom links do not auto-disconnect participants.
5. **My Bookings**: Full bookings table with status tabs and cancellation support.
6. **Upcoming Consultations**: Dedicated view for scheduled video appointments.
7. **Consultation History & Reviews**: Past sessions, executive notes, and 1 to 5 star rating modal with written review.
8. **Birth Chart & Profile**: Maintain contact details and birth coordinates (date, time, place of birth) for Janam Patrika generation.

---

## 4. Folder Structure

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
│   ├── test-suite.js                 # Automated 30-assertion E2E test suite
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navigation bar
│   │   │   ├── Footer.jsx            # Footnotes, lineage, legal links
│   │   │   ├── ConsultationTimer.jsx # Live countdown and session timer
│   │   │   ├── Modal.jsx             # Accessible modal component
│   │   │   ├── StatusBadge.jsx       # Elegant status pills
│   │   │   ├── IndianOrnament.jsx    # Traditional geometric motifs & dividers
│   │   │   ├── NotificationBell.jsx  # Notification dropdown menu
│   │   │   └── ProtectedRoute.jsx    # Role-based route guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state management
│   │   │   └── NotificationContext.jsx # Live notifications state
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx      # Public wrapper
│   │   │   ├── ExecutiveLayout.jsx   # Astrologer executive sidebar layout
│   │   │   └── CustomerLayout.jsx    # Client sidebar layout
│   │   ├── pages/
│   │   │   ├── public/               # Home, About, Services, Astrologers, etc.
│   │   │   ├── auth/                 # ExecutiveLogin/Signup, UserLogin/Signup, etc.
│   │   │   ├── executive/            # Overview, Pricing, QR, Verification, etc.
│   │   │   └── customer/             # Dashboard, Book, Payment, History, etc.
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT interceptor
│   │   ├── App.jsx                   # Central routing table
│   │   ├── index.css                 # Tailwind base styles and scrollbars
│   │   └── main.jsx
│   ├── index.html                    # Fonts & meta
│   ├── tailwind.config.js            # Custom color palette & typography
│   ├── vite.config.js                # Vite config with API proxy
│   └── package.json
└── README.md
```

---

## 5. Environment Variables & Setup

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/strologer_db
JWT_SECRET=strologer_jwt_super_secret_session_key_2026_production_ready
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
APP_NAME=Acharya Vedic Astrology Consultations

# Cloudinary (Optional: automatically falls back to local disk storage in /uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Zoom Server-to-Server OAuth (Optional: falls back to Astrologer's personal Zoom room)
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=

# SMTP Email (Optional: logs to console if left blank)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js v18+ (Node v22+ tested)
- MongoDB instance running locally on `mongodb://127.0.0.1:27017`

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Seed the Database
Populates the two demo executives, two demo clients, and sample bookings in various stages:
```bash
cd backend
npm run seed
```

### Step 3: Run Backend & Frontend Servers
In terminal 1 (Backend):
```bash
cd backend
npm start
# Runs on http://localhost:5001
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 7. Automated Test Suite Execution

Run the complete 30-assertion end-to-end verification test suite:
```bash
cd backend
npm run seed && node test-suite.js
```

### Test Suite Results:
- Health check: 200 OK
- Executive 1 & 2 Login & Authentication: JWT Issued
- Customer 1 & 2 Login & Authentication: Role Enforced
- Role-based Access Restriction: 403 Forbidden for Cross-Role Access
- IDOR Customer Isolation: 404 on Foreign Booking
- IDOR Executive Isolation: 404 on Foreign Booking
- Pricing Independence: Exec 1 (₹25/min) vs Exec 2 (₹35/min)
- Pricing Updates: Server Snapshot Preservation
- Booking Calculation: `30 mins × ₹28/min = ₹840` exactly
- Direct QR Code Delivery: Astrologer's specific QR displayed
- Screenshot Upload & Status Progression: `UNDER_VERIFICATION`
- Manual Payment Rejection: Rejection reason conveyed to client
- Screenshot Resubmission: Successfully updated
- Manual Payment Approval: Verification timestamp and notes stored
- Automatic End Time Calculation: `scheduledEndTime = startTime + duration`
- Overlapping Booking Conflict Prevention: Conflicting time blocked with 400 error
- Completed Consultation Review: Rating and testimonial saved
- In-App Notifications: Created and delivered for all events
- **Total: 30 Passed, 0 Failed.**

---

## 8. Production Deployment Instructions

1. **Database**: Use MongoDB Atlas. Replace `MONGODB_URI` with your connection string.
2. **File Storage**: Add Cloudinary API keys to `.env` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) for persistent cloud storage.
3. **Zoom Integration**: In the Zoom App Marketplace, create a **Server-to-Server OAuth** app, add meeting creation scopes, and populate `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, and `ZOOM_CLIENT_SECRET`.
4. **Frontend Build**:
   ```bash
   cd frontend
   npm run build
   ```
   Deploy the `frontend/dist` directory to Vercel, Netlify, or serve statically from the Express backend via `express.static()`.
5. **Process Management**: Run the backend using `pm2 start src/server.js --name strologer-api`.
