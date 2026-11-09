# Smart Complaint Reporting & Resolution Management System (ResolveX)

A modern, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application engineered for citizen grievance redressal, municipal department coordination, and transparent public resolution management.

---

## 🌟 Key Highlights & Smart Features

1. **Unique High-Entropy Tracking ID**: Every complaint generates a unique identifier (e.g. `RX-202611-1001`) for instantaneous public tracking.
2. **Real-Time WebSockets via Socket.IO**: Live status broadcasts, officer assignment alerts, and admin dashboard updates without manual page refreshes.
3. **Smart Duplicate Complaint Detection**: Built-in text tokenization and Jaccard similarity algorithm warns users before submitting redundant complaints.
4. **Interactive Status Progression Timeline**: Step-by-step visual audit trail displaying every status change, timestamps, officer remarks, and department actions.
5. **Role-Based Access Control (RBAC)**: Secure JWT authentication with strict separation of Citizen and Administrator privileges.
6. **Dynamic Dashboard Analytics**: Recharts-powered interactive analytics featuring monthly volume trends, category breakdowns, status donuts, and department scorecards.
7. **Official Redressal & Feedback Loops**: Citizens can rate resolutions with 1–5 stars, provide comments, or reopen complaints if issues persist.
8. **Automated Email Notifications**: Nodemailer-powered email dispatches with simulated fallback logging for instant out-of-the-box local testing.
9. **File & Evidence Uploads**: Multer-based multipart document and image upload with modal previews and download links.
10. **CSV Report Export**: Administrators can export filtered or complete complaint reports to CSV with one click.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Recharts, Lucide React, React Hot Toast, Socket.IO Client |
| **Backend** | Node.js, Express.js, REST API Architecture, JWT (`jsonwebtoken`), `bcryptjs`, Multer, Nodemailer, Morgan |
| **Database** | MongoDB, Mongoose ODM (with automatic fallback to cached embedded `mongodb-memory-server` for zero-configuration local runs) |
| **Real-time** | Socket.IO WebSockets |

---

## 👥 User Roles & Capabilities

### A. Citizen / User Portal
- **Registration & Authentication**: Sign up with name, email, phone, and address; secure login with JWT.
- **Submit Grievance**: Select from 10 categories, set priority, enter location details, upload up to 5 photos or documents.
- **Smart Duplicate Alert**: Receive real-time similarity warnings while typing.
- **My Complaints**: Filter complaints by status or category, switch between table and card grid views.
- **Live Tracking**: Inspect the complete lifecycle stepper, review official administration replies, and inspect assigned department staff.
- **Reopen Complaint**: Reopen resolved or rejected complaints with a detailed explanation.
- **Resolution Rating**: Submit 1 to 5-star ratings and written reviews on resolved complaints.
- **Profile & Security**: Update contact info and change passwords securely.

### B. Administrator Dashboard & Management
- **Administrative KPI Overview**: Total Users, Total Complaints, Pending Triage, Active In Progress, Resolved Cases, Critical Hazards.
- **Interactive Visualizations**: Monthly filing vs resolution curves, category distribution bars, and pipeline status charts.
- **Complaint Management Table**: Multi-attribute filtering (Category, Status, Priority, Department), search, and pagination.
- **Administrative Action Drawer**:
  - Update complaint status (`Submitted`, `Under Review`, `Assigned`, `In Progress`, `Resolved`, `Rejected`, `Reopened`).
  - Assign to municipal departments & designated officers.
  - Set and adjust priority levels (`Low`, `Medium`, `High`, `Critical`).
  - Post official public remarks sent to citizen via email and dashboard.
  - Record private internal staff notes for internal audit trails.
- **Citizen Directory**: Inspect registered citizens, their complaints count, and resolution ratios.
- **CSV Data Export**: Export filtered reports for council presentations or departmental audits.

---

## 📂 Complaint Categories & Lifecycle

### 10 Municipal Categories:
1. `Water Supply`
2. `Electricity`
3. `Roads and Transportation`
4. `Sanitation and Cleanliness`
5. `Street Lights`
6. `Public Safety`
7. `Education`
8. `Healthcare`
9. `Infrastructure`
10. `Other`

### Priorities:
- `Low` • `Medium` • `High` • `Critical` (with visual pulsing alert)

### Statuses:
- `Submitted` ➔ `Under Review` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved` (or `Rejected` / `Reopened`)

---

## 🔐 Demo Login Credentials

The database is pre-seeded with realistic data across all categories and statuses:

### 👑 Administrator Account
- **Email:** `admin@resolvex.com`
- **Password:** `Admin@123`
- **Role:** Administrator (Full access to Admin Panel, Dispatch, Reports, Users)

### 👤 Sample Citizen Accounts
- **Password for all users:** `User@123`

| Name | Email | Residential Area |
| :--- | :--- | :--- |
| **Rahul Sharma** | `rahul.sharma@example.com` | Green Park Residency, Sector 15 |
| **Priya Patel** | `priya.patel@example.com` | Metro Heights, Block C |
| **Amit Kumar** | `amit.kumar@example.com` | Silicon Boulevard, Cyber City |
| **Sneha Reddy** | `sneha.reddy@example.com` | Sunshine Meadows, East Wing |
| **Vikram Singh** | `vikram.singh@example.com` | Heritage Commercial Square |

> **Tip:** The Login Page includes one-click **"Demo Testing Accounts"** buttons to auto-fill these credentials instantly!

---

## 🚀 Quick Start Guide

### ⚡ Option A: 1-Click Windows Launcher (Recommended)
Simply double-click the **`start.bat`** file in the project root!

It will automatically:
1. Verify Node.js and dependencies.
2. Launch the backend API server on port 5001.
3. Launch the frontend React client on port 5173.
4. Automatically open your default web browser to `http://localhost:5173`.

*To shut down both servers at any time, run **`stop.bat`** or close the two terminal windows.*

---

### 💻 Option B: Manual Terminal Execution

### 1. Prerequisites
- **Node.js** v18+ (tested on v24.21.0)
- **npm** or **yarn**
- **MongoDB** (Local instance on `mongodb://127.0.0.1:27017` or remote MongoDB Atlas URI).
  *Note:* If local MongoDB is not running, ResolveX automatically boots an embedded in-memory database with pre-populated records!

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# (Optional) Seed the database with sample data
npm run seed

# Start the Backend Server (Runs on port 5001)
npm start
# OR with automatic restarts
npm run dev
```

*The backend server will start at `http://localhost:5001`.*

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite Development Server
npm run dev
```

*The frontend will launch at `http://localhost:5173`.*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new citizen account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/profile` — Get authenticated user profile (`Bearer Token`)
- `PUT /api/auth/profile` — Update user profile details
- `PUT /api/auth/change-password` — Change password

### Complaints
- `POST /api/complaints` — Submit a complaint (Supports multi-file attachments)
- `GET /api/complaints` — Get all complaints with filters and pagination (Admin only)
- `GET /api/complaints/my` — Get authenticated citizen's complaints
- `GET /api/complaints/:id` — Get full complaint dossier by ID
- `GET /api/complaints/track/:trackingId` — Public tracking endpoint by Tracking ID
- `PUT /api/complaints/:id/status` — Update complaint status (Admin only)
- `PUT /api/complaints/:id/assign` — Assign department and staff officer (Admin only)
- `PUT /api/complaints/:id/priority` — Update complaint priority level (Admin only)
- `POST /api/complaints/:id/response` — Post official admin reply (Admin only)
- `POST /api/complaints/:id/internal-note` — Add private internal note (Admin only)
- `PUT /api/complaints/:id/reopen` — Reopen resolved or rejected complaint (Citizen)
- `POST /api/complaints/:id/feedback` — Submit 1–5 star rating and review (Citizen)
- `POST /api/complaints/check-duplicate` — Check duplicate complaints similarity (Public)
- `GET /api/complaints/export/csv` — Export complaints dataset as CSV (Admin only)

### User Management
- `GET /api/users` — Get registered citizens with complaint statistics (Admin only)
- `GET /api/users/:id` — Get citizen details and complaint history (Admin only)
- `DELETE /api/users/:id` — Remove user account (Admin only)

### Notifications & Analytics
- `GET /api/notifications` — Get user notifications & unread badge count
- `PUT /api/notifications/:id/read` — Mark notification as read
- `PUT /api/notifications/read-all` — Mark all user notifications as read
- `GET /api/analytics/dashboard` — Get aggregated KPI metrics & Recharts datasets

---

## 📁 Project Structure

```text
ResolveX/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & in-memory fallback
│   ├── controllers/
│   │   ├── analyticsController.js # KPIs and Recharts aggregation
│   │   ├── authController.js      # JWT authentication and user management
│   │   ├── complaintController.js # Core complaint redressal logic
│   │   ├── notificationController.js # Notification dispatcher
│   │   └── userController.js      # Citizen directory
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & RBAC guard
│   │   ├── errorMiddleware.js     # Unified error & exception handler
│   │   └── uploadMiddleware.js    # Multer file storage & mime filter
│   ├── models/
│   │   ├── Complaint.js           # Main complaint schema with timeline
│   │   ├── Notification.js        # Notification model
│   │   └── User.js                # User & Admin credentials
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── duplicateDetector.js   # Token similarity & duplicate checker
│   │   ├── emailService.js        # Nodemailer notifications
│   │   ├── generateTrackingId.js  # Tracking ID generator
│   │   └── seedHelper.js          # Auto-seeder for zero-config startup
│   ├── uploads/                   # Stored complaint file attachments
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                    # Standalone database seed script
│   └── server.js                  # Express & Socket.IO server entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryIcon.jsx   # 10 category icons & styling
│   │   │   ├── Footer.jsx         # Civic helplines & links
│   │   │   ├── Navbar.jsx         # Responsive public navbar
│   │   │   ├── PriorityBadge.jsx  # Low/Medium/High/Critical badges
│   │   │   ├── ProtectedRoute.jsx # Role-based router guards
│   │   │   ├── Sidebar.jsx        # Dual-role navigation sidebar
│   │   │   ├── StatusBadge.jsx    # Status chip component
│   │   │   ├── TimelineStepper.jsx # Visual audit trail stepper
│   │   │   └── Topbar.jsx         # Notification bell & user avatar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Authentication & user state
│   │   │   └── SocketContext.jsx  # Real-time WebSocket subscriptions
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.jsx # Authenticated sidebar/topbar shell
│   │   │   └── PublicLayout.jsx    # Navbar/footer public shell
│   │   ├── pages/
│   │   │   ├── AboutUsPage.jsx
│   │   │   ├── AdminAnalyticsPage.jsx
│   │   │   ├── AdminComplaintsPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   ├── ComplaintDetailsPage.jsx
│   │   │   ├── ContactUsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyComplaintsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SubmitComplaintPage.jsx
│   │   │   ├── TrackComplaintPage.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js             # Centralized Axios client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

---

## 🛡️ License

This project is licensed under the MIT License — feel free to use it for academic demonstrations, municipal evaluations, and learning purposes.
