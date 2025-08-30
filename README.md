# Secure Multi-Tenant API

## Overview
This project is a secure multi-tenant API built with Express.js, designed to support user authentication, role-based access control (RBAC), tenant isolation, and API key management. It is structured to ensure scalability and maintainability while providing a robust foundation for multi-tenant applications.

## Features
- User registration and authentication with JWT
- Role-based access control (admin, manager, user)
- Tenant isolation to ensure data privacy
- API key generation and management for external integrations
- Comprehensive logging of critical events and actions
- Input validation and security measures

## Project Structure
```
secure-multi-tenant-api
├── src
│   ├── app.js                # Initializes the Express application
│   ├── server.js             # Starts the server
│   ├── config                # Configuration files
│   │   ├── database.js       # Database connection logic
│   │   └── jwt.js            # JWT configuration
│   ├── controllers           # Controllers for handling requests
│   │   ├── authController.js  # User authentication functions
│   │   ├── userController.js  # User management functions
│   │   └── organizationController.js # Organization management functions
│   ├── middlewares           # Middleware for authentication and validation
│   │   ├── auth.js           # JWT validation middleware
│   │   ├── tenantIsolation.js  # Tenant isolation middleware
│   │   ├── rbac.js           # Role-based access control middleware
│   │   └── validation.js      # Input validation middleware
│   ├── models                # Database models
│   │   ├── User.js           # User model schema
│   │   ├── Organization.js    # Organization model schema
│   │   ├── ApiKey.js         # API key model schema
│   │   └── AuditLog.js       # Audit log model schema
│   ├── routes                # API routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management routes
│   │   └── organizations.js   # Organization management routes
│   └── utils                 # Utility functions
│       ├── logger.js         # Logging utility
│       └── helpers.js        # Helper functions
├── tests                     # Test files
│   ├── auth.test.js          # Tests for authentication
│   ├── users.test.js         # Tests for user management
│   └── setup.js              # Test environment setup
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── package.json              # Project metadata and dependencies
├── jest.config.js            # Jest configuration
└── README.md                 # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd secure-multi-tenant-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

4. Start the server:
   ```
   npm start
   ```

## Environment Variables
- `JWT_SECRET`: Secret key for JWT signing
- `DB_URI`: Database connection URI
- `API_KEY_SECRET`: Secret for API key generation

## API Usage Guide
### Authentication
- **Register User**: `POST /api/auth/register`
- **Login User**: `POST /api/auth/login`

### User Management
- **Get Users**: `GET /api/users`
- **Create User**: `POST /api/users`
- **Update User**: `PUT /api/users/:id`
- **Delete User**: `DELETE /api/users/:id`

### Organization Management
- **Get Organizations**: `GET /api/organizations`
- **Create Organization**: `POST /api/organizations`
- **Update Organization**: `PUT /api/organizations/:id`
- **Delete Organization**: `DELETE /api/organizations/:id`

### API Key Management
- **Generate API Key**: `POST /api/organizations/:id/api-keys`
- **Revoke API Key**: `DELETE /api/organizations/:id/api-keys/:keyId`

## Testing
Run tests using:
```
npm test
```

## Final Notes
Ensure to follow best practices for security and data management when deploying this application in a production environment.