import { Router } from 'express'
import { register, login, getMe } from "../../controllers/auth.js";
import { checkAuth } from '../../utils/checkAuth.js'

const router = new Router()

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


export default router;
