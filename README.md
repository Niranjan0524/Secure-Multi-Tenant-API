# Secure Multi-Tenant API

## Overview
This project is a **production-ready secure multi-tenant API** built with Express.js, MongoDB, and JWT authentication. It implements enterprise-grade security patterns including role-based access control (RBAC), tenant isolation, and API key management for external integrations.

## Features
- 🔐 **JWT-based Authentication** - Secure token-based user authentication
- 👥 **Role-Based Access Control (RBAC)** - Three-tier permission system (Admin, Manager, User)
- 🏢 **Multi-Tenant Architecture** - Complete data isolation between organizations
- 🔑 **API Key Management** - Create, rotate, and revoke API keys for external integrations
- 🛡️ **Security Features** - Input validation, rate limiting, secure password hashing
- 📊 **Audit Logging** - Track important system events
- 🚀 **Auto-Admin Bootstrap** - First user automatically becomes organization admin

## Architecture

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt, helmet, express-rate-limit
- **Validation:** express-validator

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│              (Web, Mobile, External Services)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│                   (Express.js Server)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────┐   ┌──────────┐   ┌──────────────┐
│  Auth   │   │   RBAC   │   │   Tenant     │
│Middleware│   │Middleware│   │  Isolation   │
└─────────┘   └──────────┘   └──────────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Auth    │   │   User   │   │   Org    │
│Controller│   │Controller│   │Controller│
└──────────┘   └──────────┘   └──────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer (MongoDB)                  │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐      │
│  │  Users  │  │  Orgs   │  │ API Keys │  │ Audit   │      │
│  │Collection│  │Collection│  │Collection│  │  Logs   │      │
│  └─────────┘  └─────────┘  └──────────┘  └─────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

**Organizations (Tenants)**
- Each organization is a separate tenant
- Contains multiple users
- Complete data isolation

**Users**
- Belong to one organization
- Have one role: `admin`, `manager`, or `user`
- First user of an organization is automatically assigned `admin` role

**API Keys**
- Belong to one organization
- Have configurable permissions: `read`, `write`, `admin`
- Support rotation and revocation
- Used for external service authentication

### Role Hierarchy & Permissions

| Role | Description | Can Do |
|------|-------------|--------|
| **Admin** | Full control over organization | All operations including user/org deletion |
| **Manager** | Operational management | Create users, manage API keys, update resources |
| **User** | Standard access | Read own profile, limited operations |

## API Overview

### Available Endpoints

| Category | Endpoint | Method | Auth Required | Roles |
|----------|----------|--------|---------------|-------|
| **Health** | `/health` | GET | No | Public |
| **Authentication** |
| | `/api/auth/first/user/admin` | POST | No | Public |
| | `/api/auth/register` | POST | Yes | Admin, Manager |
| | `/api/auth/login` | POST | No | Public |
| **User Management** |
| | `/api/users/addUser` | POST | Yes | Admin, Manager |
| | `/api/users/:id` | GET | Yes | All (Own profile) |
| | `/api/users/organizationUsers/:orgId` | GET | Yes | Admin |
| | `/api/users/:id` | PUT | Yes | Admin, Manager |
| | `/api/users/:id` | DELETE | Yes | Admin |
| **Organization Management** |
| | `/api/organizations` | POST | Yes | Admin |
| | `/api/organizations` | GET | Yes | All |
| | `/api/organizations/:id` | GET | Yes | All |
| | `/api/organizations/:id` | PUT | Yes | Admin, Manager |
| | `/api/organizations/:id` | DELETE | Yes | Admin |
| **API Key Management** |
| | `/api/apikeys/createAPIKey` | POST | Yes | Admin, Manager |
| | `/api/apikeys/getAllAPIKeys` | GET | Yes | Admin, Manager |
| | `/api/apikeys/:keyId/rotate` | PUT | Yes | Admin, Manager |
| | `/api/apikeys/:keyId` | DELETE | Yes | Admin |

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

---

## 🧪 Complete Testing Guide

This guide walks you through testing **all features** of the API in a logical sequence. Perfect for reviewers and QA testing.

### Prerequisites for Testing
- API client (Postman, Thunder Client, or curl)
- The server running on `http://localhost:3000`
- A text editor to save tokens and IDs

### Testing Flow Overview

```
1. Health Check
   ↓
2. Create Organization + First Admin
   ↓
3. Login as Admin
   ↓
4. Create Manager User
   ↓
5. Create Regular User
   ↓
6. Test User Permissions
   ↓
7. Test Organization Management
   ↓
8. Test API Key Management
   ↓
9. Test Access Control & Security
```

---

### **Step 1: Health Check** ✅

Verify the API is running.

```bash
GET http://localhost:3000/health
```

**Expected Response:**
```
API is healthy
```

---

### **Step 2: Create First Organization & Admin** 🏢

This creates your first organization and automatically assigns the first user as admin.

```bash
POST http://localhost:3000/api/auth/first/user/admin
Content-Type: application/json

{
  "name": "John Admin",
  "email": "john@acmecorp.com",
  "password": "SecurePass123!",
  "organizationName": "Acme Corporation",
  "organizationAddress": "123 Business St, San Francisco, CA 94102"
}
```

**Expected Response:**
```json
{
  "message": "First admin user and organization created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec...",
    "name": "John Admin",
    "email": "john@acmecorp.com",
    "role": "admin",
    "organizationId": "60d5ec..."
  }
}
```

**📝 Save these values:**
- `ADMIN_TOKEN` = token value
- `ADMIN_ID` = user.id
- `ORG_ID` = organizationId

---

### **Step 3: Login as Admin** 🔐

Test the login functionality.

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@acmecorp.com",
  "password": "SecurePass123!"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "60d5ec...",
  "role": "admin",
  "organizationId": "60d5ec..."
}
```

✅ **Verify:** Token matches the one from Step 2

---

### **Step 4: Create Manager User** 👥

As admin, create a manager user.

```bash
POST http://localhost:3000/api/users/addUser
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "name": "Sarah Manager",
  "email": "sarah@acmecorp.com",
  "password": "ManagerPass123!",
  "role": "manager",
  "organizationId": "{ORG_ID}"
}
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "60d5ec...",
    "name": "Sarah Manager",
    "email": "sarah@acmecorp.com",
    "role": "manager"
  }
}
```

**📝 Save:** `MANAGER_ID` = user.id

Now **login as manager** to get their token:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "sarah@acmecorp.com",
  "password": "ManagerPass123!"
}
```

**📝 Save:** `MANAGER_TOKEN` = token value

---

### **Step 5: Create Regular User** 👤

As manager, create a regular user (testing manager permissions).

```bash
POST http://localhost:3000/api/users/addUser
Authorization: Bearer {MANAGER_TOKEN}
Content-Type: application/json

{
  "name": "Bob User",
  "email": "bob@acmecorp.com",
  "password": "UserPass123!",
  "role": "user",
  "organizationId": "{ORG_ID}"
}
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "60d5ec...",
    "name": "Bob User",
    "email": "bob@acmecorp.com",
    "role": "user"
  }
}
```

**📝 Save:** `USER_ID` = user.id

Login as user to get their token:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "bob@acmecorp.com",
  "password": "UserPass123!"
}
```

**📝 Save:** `USER_TOKEN` = token value

---

### **Step 6: Test User Permissions** 🔒

#### 6.1: Get User Profile (All Roles)

```bash
GET http://localhost:3000/api/users/{USER_ID}
Authorization: Bearer {USER_TOKEN}
```

✅ **Expected:** Success - Users can view their own profile

---

#### 6.2: Get All Organization Users (Admin Only)

```bash
GET http://localhost:3000/api/users/organizationUsers/{ORG_ID}
Authorization: Bearer {ADMIN_TOKEN}
```

✅ **Expected:** Returns list of all users in organization

**Now test with regular user:**

```bash
GET http://localhost:3000/api/users/organizationUsers/{ORG_ID}
Authorization: Bearer {USER_TOKEN}
```

❌ **Expected:** `403 Forbidden` - Only admins can list all users

---

#### 6.3: Update User (Admin/Manager Only)

As manager, update the user:

```bash
PUT http://localhost:3000/api/users/{USER_ID}
Authorization: Bearer {MANAGER_TOKEN}
Content-Type: application/json

{
  "name": "Bob Updated User"
}
```

✅ **Expected:** Success

**Now test with regular user trying to update another user:**

```bash
PUT http://localhost:3000/api/users/{MANAGER_ID}
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "name": "Hacked Name"
}
```

❌ **Expected:** `403 Forbidden`

---

#### 6.4: Delete User (Admin Only)

First, try as manager:

```bash
DELETE http://localhost:3000/api/users/{USER_ID}
Authorization: Bearer {MANAGER_TOKEN}
```

❌ **Expected:** `403 Forbidden` - Only admins can delete users

**Now as admin:**

```bash
DELETE http://localhost:3000/api/users/{USER_ID}
Authorization: Bearer {ADMIN_TOKEN}
```

✅ **Expected:** Success

**Recreate the user for further testing:**

```bash
POST http://localhost:3000/api/users/addUser
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "name": "Bob User",
  "email": "bob@acmecorp.com",
  "password": "UserPass123!",
  "role": "user",
  "organizationId": "{ORG_ID}"
}
```

---

### **Step 7: Test Organization Management** 🏢

#### 7.1: Get Organization Details

```bash
GET http://localhost:3000/api/organizations/{ORG_ID}
Authorization: Bearer {USER_TOKEN}
```

✅ **Expected:** Success - All users can view their organization

---

#### 7.2: Update Organization (Admin/Manager Only)

As manager:

```bash
PUT http://localhost:3000/api/organizations/{ORG_ID}
Authorization: Bearer {MANAGER_TOKEN}
Content-Type: application/json

{
  "name": "Acme Corporation Updated",
  "address": "456 New Address, San Francisco, CA 94103"
}
```

✅ **Expected:** Success

**Try as regular user:**

```bash
PUT http://localhost:3000/api/organizations/{ORG_ID}
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "name": "Hacked Org Name"
}
```

❌ **Expected:** `403 Forbidden`

---

#### 7.3: Create New Organization (Admin Only)

```bash
POST http://localhost:3000/api/organizations
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "name": "Tech Innovations Inc",
  "address": "789 Tech Blvd, Austin, TX 78701"
}
```

✅ **Expected:** Success

**📝 Save:** `SECOND_ORG_ID` = response.organization.id

---

### **Step 8: Test API Key Management** 🔑

#### 8.1: Create API Key (Admin/Manager)

As manager:

```bash
POST http://localhost:3000/api/apikeys/createAPIKey
Authorization: Bearer {MANAGER_TOKEN}
Content-Type: application/json

{
  "name": "Production API Key",
  "permissions": ["read", "write"]
}
```

✅ **Expected:** Success with full API key returned

```json
{
  "message": "API key created successfully",
  "apiKey": {
    "id": "60d5ec...",
    "name": "Production API Key",
    "key": "sbk_live_60d5ec_a1b2c3d4e5f6...",
    "permissions": ["read", "write"]
  }
}
```

**📝 Save:** 
- `API_KEY_ID` = apiKey.id
- `API_KEY` = apiKey.key

**Try as regular user:**

```bash
POST http://localhost:3000/api/apikeys/createAPIKey
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "name": "Unauthorized Key",
  "permissions": ["admin"]
}
```

❌ **Expected:** `403 Forbidden`

---

#### 8.2: List API Keys

```bash
GET http://localhost:3000/api/apikeys/getAllAPIKeys
Authorization: Bearer {MANAGER_TOKEN}
```

✅ **Expected:** Returns list of API keys (with masked key values)

```json
{
  "apiKeys": [
    {
      "id": "60d5ec...",
      "name": "Production API Key",
      "permissions": ["read", "write"],
      "key": "sbk_live_60d5ec_a...",
      "createdBy": {...},
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 8.3: Rotate API Key (Admin/Manager)

```bash
PUT http://localhost:3000/api/apikeys/{API_KEY_ID}/rotate
Authorization: Bearer {MANAGER_TOKEN}
```

✅ **Expected:** New API key generated

```json
{
  "message": "API key rotated successfully",
  "apiKey": {
    "id": "60d5ec...",
    "name": "Production API Key",
    "key": "sbk_live_60d5ec_NEW_KEY_HERE..."
  }
}
```

**📝 Update:** `API_KEY` with new value

---

#### 8.4: Revoke API Key (Admin Only)

Try as manager:

```bash
DELETE http://localhost:3000/api/apikeys/{API_KEY_ID}
Authorization: Bearer {MANAGER_TOKEN}
```

❌ **Expected:** `403 Forbidden` - Only admins can revoke keys

**Now as admin:**

```bash
DELETE http://localhost:3000/api/apikeys/{API_KEY_ID}
Authorization: Bearer {ADMIN_TOKEN}
```

✅ **Expected:** Success

```json
{
  "message": "API key revoked successfully",
  "revokedKey": {
    "id": "60d5ec...",
    "name": "Production API Key",
    "revokedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### **Step 9: Test Tenant Isolation** 🔒

#### 9.1: Create Second Organization Admin

```bash
POST http://localhost:3000/api/auth/first/user/admin
Content-Type: application/json

{
  "name": "Jane Admin 2",
  "email": "jane@techinnov.com",
  "password": "SecurePass456!",
  "organizationName": "Tech Innovations",
  "organizationAddress": "789 Innovation Dr, Austin, TX 78701"
}
```

**📝 Save:** `ADMIN2_TOKEN` = token value, `ORG2_ID` = organizationId

---

#### 9.2: Try Cross-Tenant Access

Try to access first organization's users with second admin's token:

```bash
GET http://localhost:3000/api/users/organizationUsers/{ORG_ID}
Authorization: Bearer {ADMIN2_TOKEN}
```

❌ **Expected:** `403 Forbidden` - Cannot access other organization's data

---

#### 9.3: Try Cross-Tenant Update

Try to update first organization's user with second admin's token:

```bash
PUT http://localhost:3000/api/users/{ADMIN_ID}
Authorization: Bearer {ADMIN2_TOKEN}
Content-Type: application/json

{
  "name": "Hacked Name"
}
```

❌ **Expected:** `403 Forbidden` - Tenant isolation prevents this

---

### **Step 10: Test Invalid Scenarios** ⚠️

#### 10.1: Invalid Login Credentials

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@acmecorp.com",
  "password": "WrongPassword"
}
```

❌ **Expected:** `401 Unauthorized`

---

#### 10.2: Missing Required Fields

```bash
POST http://localhost:3000/api/users/addUser
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "email": "incomplete@acmecorp.com"
}
```

❌ **Expected:** `400 Bad Request` - Validation error

---

#### 10.3: Expired/Invalid Token

```bash
GET http://localhost:3000/api/users/{ADMIN_ID}
Authorization: Bearer invalid_token_here
```

❌ **Expected:** `401 Unauthorized`

---

### **Testing Checklist** ✅

Use this checklist to ensure complete testing:

- [ ] Health check responds
- [ ] Can create first organization + admin
- [ ] Admin can login successfully
- [ ] Admin can create manager
- [ ] Manager can create regular user
- [ ] Regular user cannot create users
- [ ] Users can view own profile
- [ ] Only admin can list all users
- [ ] Manager can update users
- [ ] Regular user cannot update other users
- [ ] Only admin can delete users
- [ ] Manager can update organization
- [ ] Regular user cannot update organization
- [ ] Admin can create new organization
- [ ] Manager can create API keys
- [ ] Regular user cannot create API keys
- [ ] Manager can rotate API keys
- [ ] Only admin can revoke API keys
- [ ] Tenant isolation works (no cross-org access)
- [ ] Invalid credentials are rejected
- [ ] Validation works for required fields
- [ ] Invalid tokens are rejected

---

### **Expected Test Results Summary**

| Test | Admin | Manager | User |
|------|-------|---------|------|
| Create User | ✅ | ✅ | ❌ |
| View Own Profile | ✅ | ✅ | ✅ |
| List All Users | ✅ | ❌ | ❌ |
| Update User | ✅ | ✅ | ❌ |
| Delete User | ✅ | ❌ | ❌ |
| Update Organization | ✅ | ✅ | ❌ |
| Create API Key | ✅ | ✅ | ❌ |
| Rotate API Key | ✅ | ✅ | ❌ |
| Revoke API Key | ✅ | ❌ | ❌ |
| Access Other Org Data | ❌ | ❌ | ❌ |

---

## API Reference

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

## API Reference

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
  "name": "Ramesh User",
  "email": "ramesh@company.com",
  "password": "securePassword123",
  "organizationName":"Torant",
  "organizationAddress":"Banglore,India"
}
```
Creates an organization and sets the first user as admin.

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
POST /api/users/addUser
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

## API Key Management Endpoints

### Create API Key (Admin/Manager only)
```http
POST /api/apikeys/createAPIKey
Authorization: Bearer <admin_or_manager_token>
Content-Type: application/json

{
  "name": "Production Key",
  "permissions": ["read", "write"]
}
```
Creates a new API key for the authenticated user's organization.  
- `name`: Required, 3-50 characters.
- `permissions`: Optional, array of `"read"`, `"write"`, `"admin"`.
- Organization is automatically extracted from the JWT token.

### List Organization's API Keys (Admin/Manager only)
```http
GET /api/apikeys/getAllAPIKeys
Authorization: Bearer <admin_or_manager_token>
```
Returns all active API keys for the organization (shows only a preview of the key).

### Rotate API Key (Admin/Manager only)
```http
PUT /api/apikeys/:keyId/rotate
Authorization: Bearer <admin_or_manager_token>
```
Replaces the specified API key with a new one.

### Revoke API Key (Admin only)
```http
DELETE /api/apikeys/:keyId
Authorization: Bearer <admin_token>
```
Revokes (disables) the specified API key.

---

## System Endpoints

### Health Check
```http
GET /health
```
**Response:** `API is healthy`

---

---

## Permission Matrix

| Endpoint | Admin | Manager | User |
|----------|-------|---------|------|
| Register User | ✅ | ✅ | ❌ |
| Create User | ✅ | ✅ | ❌ |
| Get Own Profile | ✅ | ✅ | ✅ |
| Get All Users | ✅ | ❌ | ❌ |
| Update User | ✅ | ✅ | ❌ |
| Delete User | ✅ | ❌ | ❌ |
| Create Organization | ✅ | ❌ | ❌ |
| Get Organizations | ✅ | ✅ | ✅ |
| Update Organization | ✅ | ✅ | ❌ |
| Delete Organization | ✅ | ❌ | ❌ |
| Create API Key | ✅ | ✅ | ❌ |
| List API Keys | ✅ | ✅ | ❌ |
| Rotate API Key | ✅ | ✅ | ❌ |
| Revoke API Key | ✅ | ❌ | ❌ |

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

---

## Security Features

### Implemented Security Measures

1. **Password Security**
   - Passwords hashed using bcrypt
   - Minimum password complexity required
   - Passwords never returned in responses

2. **JWT Authentication**
   - Tokens expire after configured time
   - Secure token generation
   - Token validation on protected routes

3. **Tenant Isolation**
   - Middleware enforces organization boundaries
   - Users cannot access other organizations' data
   - Database queries filtered by organizationId

4. **API Key Security**
   - Keys use cryptographic generation
   - Keys are prefixed and include organization ID
   - Support for key rotation and revocation
   - Last used timestamp tracking

5. **Input Validation**
   - Express-validator for all inputs
   - SQL injection prevention via Mongoose
   - XSS protection via sanitization

6. **Rate Limiting**
   - Configurable request limits
   - Prevents brute force attacks
   - Per-IP tracking

---

## Project Structure

```
Secure-Multi-Tenant-API/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── jwt.js             # JWT configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── userController.js  # User CRUD operations
│   │   ├── organizationController.js
│   │   └── apiKeyController.js
│   ├── middlewares/
│   │   ├── auth.js            # JWT authentication
│   │   ├── rbac.js            # Role-based access control
│   │   ├── tenantIsolation.js # Multi-tenant isolation
│   │   ├── apiKey.js          # API key validation
│   │   └── validation.js      # Input validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Organization.js    # Organization schema
│   │   ├── ApiKey.js          # API Key schema
│   │   └── AuditLog.js        # Audit log schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── users.js           # User routes
│   │   ├── organizations.js   # Organization routes
│   │   └── apikeys.js         # API key routes
│   └── utils/
│       ├── helpers.js         # Utility functions
│       └── logger.js          # Logging configuration
├── package.json
├── .env.example
└── README.md
```

---

## Development

### Running Tests
```bash
npm test
```

### Running in Development Mode
```bash
npm run dev
```

### Linting
```bash
npm run lint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact & Support

For questions or issues:
- GitHub Issues: [Create an issue](https://github.com/Niranjan0524/Secure-Multi-Tenant-API/issues)
- Email: support@secureblink.dev

---

## Acknowledgments

Built with:
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

**Made with ❤️ for secure multi-tenant applications**