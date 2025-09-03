const express = require("express");
const {
  createApiKey,
  getApiKeys,
  rotateApiKey,
  revokeApiKey,
} = require("../controllers/apiKeyController");
const { authenticateJWT } = require("../middlewares/auth");
const roleControl = require("../middlewares/rbac");
const { body } = require("express-validator");

const router = express.Router();

// Validation middleware for API key creation
const validateApiKeyCreation = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("API key name must be between 3 and 50 characters"),
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array")
    .custom((permissions) => {
      const validPermissions = ["read", "write", "admin"];
      const isValid = permissions.every((p) => validPermissions.includes(p));
      if (!isValid) {
        throw new Error(
          "Invalid permissions. Valid options: read, write, admin"
        );
      }
      return true;
    }),
];

// Create new API key (admin/manager only)
router.post(
  "/createAPIKey",
  authenticateJWT,
  roleControl(["admin", "manager"]),
  validateApiKeyCreation,
  createApiKey
);

// List organization's API keys (admin/manager only)
router.get("/", authenticateJWT, roleControl(["admin", "manager"]), getApiKeys);

// Rotate API key (admin/manager only)
router.put(
  "/:keyId/rotate",
  authenticateJWT,
  roleControl(["admin", "manager"]),
  rotateApiKey
);

// Revoke API key (admin/manager only)
router.delete(
  "/:keyId",
  authenticateJWT,
  roleControl(["admin", "manager"]),
  revokeApiKey
);

module.exports = router;
