import { Router } from "express";
const router = Router();
import { checkAuth } from '../../utils/checkAuth.js';
import {
    reviewValidationRules,
    validate
} from "../../validators/serviceValidator.js";

// @route   POST api/reviews/:id
// @desc    create new review
// @access  authenticated
router.post(
    "/:id",
    checkAuth,
    reviewValidationRules(),
    validate,
    createReview
);