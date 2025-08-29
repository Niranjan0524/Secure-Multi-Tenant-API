const express = require('express');
const {
  createUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/userController.js");
const { validateUserRegistration } = require("../middlewares/validation.js");
const { authenticateJWT } = require("../middlewares/auth.js");
const tenantIsolation = require('../middlewares/tenantIsolation.js');
const rbac = require('../middlewares/rbac.js');

const router = express.Router();

// Create a new user
router.post(
  "/",
  authenticateJWT,
  rbac(["admin", "manager"]),
  validateUserRegistration,
  createUser
);

// Get user by ID
router.get("/:id", authenticateJWT, tenantIsolation, getUserProfile);

// Update user by ID
router.put(
  "/:id",
  authenticateJWT,
  tenantIsolation,
  rbac(["admin", "manager"]),
  validateUserRegistration,
  updateUserProfile
);

// Delete user by ID
router.delete(
  "/:id",
  authenticateJWT,
  tenantIsolation,
  rbac(["admin"]),
  deleteUserProfile
);

module.exports = router;