const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../../controllers/auth");
const { checkAuth } = require("../../utils/checkAuth");

// @route   post api/auth/register
// @desc    register user
// @access  public
router.post("/register", register);

// @route   POST api/auth/login
// @desc    login user
// @access  public
router.post("/login", login);

// get me
router.get("/me", checkAuth, getMe);


module.exports = router;
