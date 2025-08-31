const express = require('express');
const {
  createUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsersInOrganization: getAllUsersInOrganization
} = require("../controllers/userController.js");
const { validateUserRegistration } = require("../middlewares/validation.js");
const { authenticateJWT } = require("../middlewares/auth.js");
const tenantIsolation = require('../middlewares/tenantIsolation.js');
const roleControl = require('../middlewares/rbac.js');

const router = express.Router();


router.post(
  "/",
  authenticateJWT,
  roleControl(["admin", "manager"]),
  validateUserRegistration,
  createUser
);

//any of the user can access their profile (user,admin,manager)
router.get("/:id", authenticateJWT, tenantIsolation, getUserProfile);

//only admin can access all the userDetails of particular Org:
router.get("/organizationUsers/:organizationId",authenticateJWT,tenantIsolation,roleControl(["admin"]),getAllUsersInOrganization);

router.put(
  "/:id",
  authenticateJWT,
  tenantIsolation,
  roleControl(["admin", "manager"]),
  validateUserRegistration,
  updateUserProfile
);

//basically only admin have right to delete the data.
router.delete(
  "/:id",
  authenticateJWT,
  tenantIsolation,
  roleControl(["admin"]),
  deleteUserProfile
);

//we can also add the Redundant auth middleware before control coming till here..i.e in app.js.( ex: app.use(authenticateJWT);)
module.exports = router;