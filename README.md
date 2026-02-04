# Occasia - Premium Event Booking Platform

Occasia is a world-class event management platform designed for prestigious events. It connects discerning clients with luxury service providers like exclusive venues, gourmet caterers, and professional event specialists.

## Core Features

### 1. User Experience
*   **Discovery**: Public service listing with advanced search and filtering.
*   **Filtering**: Search by category, price range, location, and real-time date availability.
*   **Prestige Booking**: Seamless booking process with instant total valuation calculation based on duration.
*   **Personal Dashboard**: View past and upcoming scheduled experiences.
*   **Email Notifications**: Instant confirmation requests sent to users upon reservation.

### 2. Admin Capabilities
*   **Global Registry Management**: Full CRUD operations on the service catalog.
*   **Operational Control**: Toggle service availability and manage premium details.
*   **Transaction Manifest**: View and update the status of every booking on the platform.

## Technology Stack
*   **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Redux Toolkit.
*   **Backend**: Node.js, Express, TypeScript.
*   **Database**: MongoDB with Mongoose.
*   **Security**: JWT-based authentication, Role-based Access Control (RBAC).

## Installation & Setup

### Backend
1.  Navigate to `/Backend`
2.  Install dependencies: `npm install`
3.  Configure `.env` (EMAIL_USER, EMAIL_PASS, MONGO_URI, JWT_SECRET)
4.  Launch: `npm run dev`

### Frontend
1.  Navigate to `/Frontend`
2.  Install dependencies: `npm install`
3.  Launch: `npm run dev`

## API Reference

### Auth
*   `POST /api/auth/register` - Create new account
*   `POST /api/auth/login` - Authenticate & receive token

### Services
*   `GET /api/services` - List all services (Supports: keyword, category, location, minPrice, maxPrice, date)
*   `GET /api/services/:id` - Fetch premium service details

### Details
For detailed API documentation, including schema and request examples, please refer to [API_DOCS.md](./API_DOCS.md).

### Bookings
*   `POST /api/bookings` - Request a new experience (Private)
*   `GET /api/bookings/my` - View personal scheduled events (Private)
*   `GET /api/bookings/all` - Transaction manifest for authorities (Admin)
*   `PATCH /api/bookings/:id/status` - Update transaction status (Admin)

---
&copy; 2026 Occasia Prestige Services.

