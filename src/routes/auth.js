const express = require('express');
const { register, login } = require('../controllers/authController.js');
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middlewares/validation.js");

const router = express.Router();

// User registration route
router.post("/register", validateUserRegistration, register);

// User login route
router.post("/login", validateUserLogin, login);

module.exports = router;