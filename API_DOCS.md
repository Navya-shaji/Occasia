# Occasia API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
Authentication is handled via JWT Tokens. Include the token in the `Authorization` header.
`Authorization: Bearer <token>`

---

## 1. Authentication Routes

### Register User
**Endpoint**: `POST /auth/register`
**Description**: Register a new user account.
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "USER" // Optional, defaults to USER
}
```
**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify OTP sent to your email.",
  "userId": "60d5ec49f1b2c..."
}
```

### Verify OTP
**Endpoint**: `POST /auth/verify-otp`
**Description**: Verify user email using OTP.
**Request Body**:
```json
{
  "userId": "60d5ec49f1b2c...",
  "otp": "123456"
}
```

### Login
**Endpoint**: `POST /auth/login`
**Description**: Login and receive access user.
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "60d5ec49f1b2c...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

## 2. Service Management (Admin)

### Create Service
**Endpoint**: `POST /services`
**Access**: Admin Only
**Headers**: `Content-Type: multipart/form-data` (for images)
**Form Data**:
- `name`: string
- `category`: string
- `description`: string
- `pricePerDay`: number
- `location`: string
- `contactDetails[phone]`: string
- `contactDetails[email]`: string
- `images`: file[]

### Update Service
**Endpoint**: `PUT /services/:id`
**Access**: Admin Only

### Delete Service
**Endpoint**: `DELETE /services/:id`
**Access**: Admin Only

### Get All Services (Public)
**Endpoint**: `GET /services`
**Query Parameters**:
- `page`: Page number (default 1)
- `limit`: Items per page (default 10)
- `category`: Filter by category
- `keyword`: Search name/description
- `minPrice`: Filter minimum price
- `maxPrice`: Filter maximum price
- `sort`: `priceLow`, `priceHigh`, `newest`

### Get Single Service
**Endpoint**: `GET /services/:id`

---

## 3. Booking Management

### Create Booking
**Endpoint**: `POST /bookings`
**Access**: Authenticated User
**Request Body**:
```json
{
  "serviceId": "60d5ec...",
  "startDate": "2024-12-01",
  "endDate": "2024-12-05"
}
```

### Get User Bookings
**Endpoint**: `GET /bookings/my-bookings`
**Access**: Authenticated User

### Get All Bookings
**Endpoint**: `GET /bookings`
**Access**: Admin Only

### Update Booking Status
**Endpoint**: `PATCH /bookings/:id/status`
**Access**: Admin Only
**Request Body**:
```json
{
  "status": "CONFIRMED" // or CANCELLED
}
```

---

## Database Schema

### Users
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique email |
| password | String | Hashed password |
| role | Enum | `USER`, `ADMIN`, `VENDOR` |
| isVerified | Boolean | Email verification status |

### Services
| Field | Type | Description |
|-------|------|-------------|
| name | String | Service title |
| description | String | Service details |
| category | String | e.g., Venue, Catering |
| pricePerDay | Number | Cost per day |
| location | String | Service location |
| images | [String] | Array of image URLs |
| unavailableDates | [String] | Dates already booked |
| contactDetails | Object | Phone, Email, Address |

### Bookings
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Reference to User |
| service | ObjectId | Reference to Service |
| startDate | Date | Booking start |
| endDate | Date | Booking end |
| totalPrice | Number | Calculated cost |
| status | Enum | `PENDING`, `CONFIRMED`, `CANCELLED` |
