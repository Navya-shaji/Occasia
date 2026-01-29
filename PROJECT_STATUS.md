# Occasia - Project Status & Roadmap

## 1. User Features
- [x] **Registration & Authentication**: Sign up, Login, Secure Password (bcrypt), JWT.
- [ ] **Event Booking**:
    - [ ] Search Services (Venues, Caterers, etc.)
    - [ ] Filter by Price, Category, Location, Date.
    - [ ] View Service Details (Description, Availability).
    - [ ] Book Service for specific dates.
- [ ] **View Bookings**:
    - [ ] User Dashboard: List past/upcoming bookings.

## 2. Admin Features
- [x] **Admin Login**: Verified role-based login.
- [x] **User Management**: Block/Unblock users, View list.
- [ ] **Service Management**:
    - [ ] Add/Edit/Remove Services.
    - [ ] Service Schema (Title, Category, Price/Day, Availability).
- [ ] **View Bookings**: Admin view of all platform bookings.

## 3. Core Functionalities
- [ ] **Search & Filter**: Backend logic for filtering.
- [ ] **Price Calculation**: Logic for (Price * Days).
- [x] **Database**: MongoDB set up with User model. *Need Service & Booking models.*
- [x] **Security**: JWT & Role Middleware implemented.

## 4. Extra Requirements
- [ ] **Pagination & Sorting**: For service lists.
- [ ] **Email Notifications**: Booking confirmation emails (OTP email exists).
- [ ] **Unit Tests**: For key functionalities.
- [ ] **Documentation**: API Docs & README.
