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

// Create a new organization
router.post("/", authenticateJWT, rbac(["admin"]), createOrganization);

// Get all organizations for the authenticated user's tenant
router.get("/", authenticateJWT, tenantIsolation, getAllOrganizations);

// Get a specific organization by ID
router.get('/:id', authenticateJWT, tenantIsolation, getOrganization);

// Update an organization
router.put('/:id', authenticateJWT, rbac(['admin', 'manager']), updateOrganization);

// Delete an organization
router.delete('/:id', authenticateJWT, rbac(['admin']), deleteOrganization);

module.exports = router;