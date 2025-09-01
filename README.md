# Secure Multi-Tenant API

## Overview
This project is a secure multi-tenant API built with Express.js, designed to support user authentication, role-based access control (RBAC), tenant isolation, and API key management.

## Features
- User registration and authentication with JWT tokens
- Role-based access control (admin, manager, user)
- Tenant isolation to ensure data privacy between organizations
- First user becomes admin automatically for each organization
- Input validation and security measures

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Niranjan0524/Secure-Multi-Tenant-API.git
   cd Secure-Multi-Tenant-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file (see Environment Variables section)

5. Start the server:
   ```bash
   npm start
   ```

6. Verify installation:
   ```bash
   curl http://localhost:3000/health
   ```

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Required
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
DB_URI=mongodb://localhost:27017/secure-blink-api
API_KEY_SECRET=your_api_key_secret_for_external_integrations

# Optional
PORT=3000
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.js
```

## API Usage Guide

### Base URL
```
http://localhost:3000/api
```

### Authentication
Include JWT token in Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register First Admin
```http
POST /api/auth/first/user/admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "securePassword123",
  "organizationId": "60d5ecb74d8a2c001f647b8a"
}
```

### Register User (Admin/Manager only)
```http
POST /api/auth/register
Authorization: Bearer <admin_or_manager_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com", 
  "password": "securePassword123",
  "role": "user",
  "organizationId": "60d5ecb74d8a2c001f647b8a"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "60d5ecb74d8a2c001f647b8b",
  "role": "user",
  "organizationId": "60d5ecb74d8a2c001f647b8a"
}
```

---

## User Management Endpoints

### Create User (Admin/Manager only)
```http
POST /api/users
Authorization: Bearer <admin_or_manager_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "password": "securePassword123",
  "role": "user",
  "organizationId": "60d5ecb74d8a2c001f647b8a"
}
```

### Get User Profile
```http
GET /api/users/:id
Authorization: Bearer <token>
```

### Get All Organization Users (Admin only)
```http
GET /api/users/organizationUsers/:organizationId
Authorization: Bearer <admin_token>
```

### Update User (Admin/Manager only)
```http
PUT /api/users/:id
Authorization: Bearer <admin_or_manager_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@company.com"
}
```

### Delete User (Admin only)
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

## Organization Management Endpoints

### Create Organization (Admin only)
```http
POST /api/organizations
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "address": "123 Business Street, City, State 12345"
}
```

### Get Organizations
```http
GET /api/organizations
Authorization: Bearer <token>
```

### Get Organization by ID
```http
GET /api/organizations/:id
Authorization: Bearer <token>
```

### Update Organization (Admin/Manager only)
```http
PUT /api/organizations/:id
Authorization: Bearer <admin_or_manager_token>
Content-Type: application/json

{
  "name": "Updated Corp Name",
  "address": "456 New Address"
}
```

### Delete Organization (Admin only)
```http
DELETE /api/organizations/:id
Authorization: Bearer <admin_token>
```

---

## System Endpoints

### Health Check
```http
GET /health
```
**Response:** `API is healthy`

---

| Endpoint | Admin | Manager | User |
|----------|-------|---------|------|
| Register User | true | true | false |
| Create User | true | true | false |
| Get Own Profile | true | true | true |
| Get All Users | true | false | false |
| Update User | true | true | false |
| Delete User | true | false | false |
| Create Organization | true | false | false |
| Update Organization | true | true | false |
| Delete Organization | true | false | false |

---

## Error Responses

All errors return JSON in this format:
```json
{
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created  
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Server Error