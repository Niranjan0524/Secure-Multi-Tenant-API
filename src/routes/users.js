const express = require('express');
const {
  createUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsersInOrganization: getAllUsersInOrganization
} = require("../controllers/userController.js");
const {authenticateApiKey} = require("../middlewares/apiKey.js");
const {
  validateUserRegistration,
  validateUpdation,
} = require("../middlewares/validation.js");
const { authenticateJWT } = require("../middlewares/auth.js");
const tenantIsolation = require('../middlewares/tenantIsolation.js');
const roleControl = require('../middlewares/rbac.js');

const router = express.Router();


router.post(
  "/addUser",
  authenticateJWT,
    roleControl(["admin", "manager"]),
  validateUserRegistration,
  createUser
);

//any of the user can access their profile (user,admin,manager)
router.get(
  "/:userId",
  authenticateJWT,
  getUserProfile
);

//only admin can access all the userDetails of particular Org:
router.get("/organizationUsers/:organizationId",authenticateJWT,authenticateApiKey,roleControl(["admin"]),getAllUsersInOrganization);

router.put(
  "/:userId",
  authenticateJWT,
  tenantIsolation,
  roleControl(["admin", "manager"]),
  validateUpdation,
  updateUserProfile
);

//basically only admin have right to delete the data.
router.delete(
  "/:userID",
  authenticateJWT,
  tenantIsolation,
  roleControl(["admin"]),
  deleteUserProfile
);

//we can also add the Redundant auth middleware before control coming till here..i.e in app.js.( ex: app.use(authenticateJWT);)
module.exports = router;