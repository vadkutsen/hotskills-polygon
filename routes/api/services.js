import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import { checkAuth } from '../../utils/checkAuth.js';
import { serviceValidationRules, idListValidationRules, validate } from "../../validators/serviceValidator.js";
import { createService, getServices, getService } from "../../controllers/services.js";

// @route   GET api/services
// @desc    get all services
// @access  public
router.get("/", getServices);

// @route   POST api/services/
// @desc    get services of given ids
// @access  public
router.post(
    "/",
    idListValidationRules(),
    validate,
    getServices
);

// @route   GET api/services/:id
// @desc    get service by id
// @access  public
router.get("/:id", getService);

// @route   POST api/services/new
// @desc    create new service
// @access  authenticated
router.post(
    "/new",
    checkAuth,
    serviceValidationRules(),
    validate,
    createService
);

export default router;