# JWT Authentication Middleware

## Overview
The OCCASIA backend now includes a robust JWT-based authentication system with role-based access control (RBAC).

## Middleware Files

### 1. `auth.middleware.ts`
Contains two main middleware functions:

#### `authenticate`
- **Purpose**: Verifies that the request contains a valid JWT token
- **Usage**: Apply to any route that requires a logged-in user
- **How it works**:
  - Extracts the token from the `Authorization` header (format: `Bearer <token>`)
  - Verifies the token using the `JWT_SECRET` from `.env`
  - Attaches the decoded user data to `req.user`
  - Returns 401 if token is missing or invalid

#### `authorize(...roles)`
- **Purpose**: Restricts access to specific user roles
- **Usage**: Apply after `authenticate` to enforce role-based permissions
- **How it works**:
  - Checks if `req.user.role` matches one of the allowed roles
  - Returns 403 if the user doesn't have the required role

## Example Usage

### Protecting a Route (Any Authenticated User)
```typescript
import { authenticate } from '../middlewares/auth.middleware';

router.get('/profile', authenticate, (req, res) => {
    // req.user is now available with { id, role }
    res.json({ user: req.user });
});
```

### Role-Based Protection (Admin Only)
```typescript
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../enums/role';

router.get('/admin/dashboard', 
    authenticate, 
    authorize(Role.ADMIN), 
    (req, res) => {
        res.json({ message: 'Admin data' });
    }
);
```

### Multiple Roles Allowed
```typescript
router.get('/events', 
    authenticate, 
    authorize(Role.USER, Role.VENDOR), 
    (req, res) => {
        res.json({ events: [] });
    }
);
```

## Frontend Integration

### Storing the Token (After Login)
```typescript
const response = await authService.login({ email, password });
localStorage.setItem('token', response.data.token);
```

### Sending the Token with Requests
```typescript
const token = localStorage.getItem('token');
const response = await axios.get('/api/profile', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

### Axios Interceptor (Recommended)
Add this to your `apiInstance.ts`:
```typescript
apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

## Available Roles
- `USER` - Standard event attendees
- `VENDOR` - Event organizers
- `ADMIN` - Platform administrators

## Security Notes
1. **JWT_SECRET**: Ensure this is set in your `.env` file and is a strong, random string
2. **Token Expiry**: Tokens expire after 1 day (configured in `AuthService.ts`)
3. **HTTPS**: Always use HTTPS in production to prevent token interception
4. **Token Storage**: Tokens are stored in `localStorage` on the frontend

## Testing Protected Routes

### Using Postman/Thunder Client
1. Login to get a token: `POST /api/auth/login`
2. Copy the token from the response
3. Add header: `Authorization: Bearer <your-token>`
4. Make request to protected endpoint

### Example Protected Endpoints
- `GET /api/profile` - Any authenticated user
- `GET /api/admin/dashboard` - Admin only
- `GET /api/vendor/events` - Vendor only
- `GET /api/events` - USER or VENDOR

## Error Responses

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Authentication token missing or invalid"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Access denied: insufficient permissions"
}
```
