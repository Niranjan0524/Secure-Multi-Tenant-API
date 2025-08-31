const express = require('express');
const { register, login, registerAdmin } = require('../controllers/authController.js');
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middlewares/validation.js");

const { checkIfFirstUser } = require("../utils/helpers.js");
const router = express.Router();

//first user:
router.post("/first/user/admin", validateUserRegistration, checkIfFirstUser,  registerAdmin);

// User registration (only admin or manager have access):
router.post("/register", validateUserRegistration, register);

router.post("/login", validateUserLogin, login);

module.exports = router;