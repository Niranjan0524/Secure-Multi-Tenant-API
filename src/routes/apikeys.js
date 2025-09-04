const express = require("express");
const {
  createApiKey,
  getApiKeys,
  rotateApiKey,
  revokeApiKey,
} = require("../controllers/apiKeyController");
const {authenticateApiKey} = require("../middlewares/apiKey");
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
router.get("/getAllAPIKeys", authenticateJWT, authenticateApiKey, roleControl(["admin", "manager"]), getApiKeys);

// Rotate API key (admin/manager only)
router.put(
  "/:keyId/rotate",
  authenticateJWT,
  authenticateApiKey,
  roleControl(["admin", "manager"]),
  rotateApiKey
);

// Revoke API key (admin)
router.delete(
  "/:keyId",
  authenticateJWT,
  authenticateApiKey,
  roleControl(["admin"]),
  revokeApiKey
);

module.exports = router;
