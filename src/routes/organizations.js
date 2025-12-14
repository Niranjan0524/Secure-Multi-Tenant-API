const express = require('express');
const {
  createOrganization,
  getAllOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationController.js");
const { authenticateJWT } = require("../middlewares/auth.js");
const tenantIsolation = require('../middlewares/tenantIsolation.js');
const rbac = require('../middlewares/rbac.js');

const router = express.Router();

// // Create a new organization
// router.post("/createOrganization", createOrganization);

router.get(
  "/details/:organizationId",
  authenticateJWT,
  rbac(["admin"]),
  tenantIsolation,
  getOrganization
);

// Update an organization
router.put('/updateOrganization/:organizationId', authenticateJWT, rbac(['admin', 'manager']), updateOrganization);

// Delete an organization
router.delete('/deleteOrganization/:organizationId', authenticateJWT, rbac(['admin']), deleteOrganization);

module.exports = router;