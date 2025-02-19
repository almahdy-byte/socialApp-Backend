import { Router } from "express";
import * as authServices from "./auth.controller.js";
import * as authSchema from "./auth.validation.js";
import { asyncErrorHandler } from "../../utils/errorHandler/asyncErrorHandler.js";
import { valid } from "../../middleWare/validation.js";
import { auth } from "../../middleWare/auth.middleWare.js";
const router = Router();

router.post('/register',valid(authSchema.registerSchema),asyncErrorHandler(authServices.register));
router.post('/confirm-email',valid(authSchema.confirmEmailSchema),asyncErrorHandler(authServices.confirmEmail));
router.post('/login',valid(authSchema.loginSchema),asyncErrorHandler(authServices.login));
router.post('/refresh',asyncErrorHandler(authServices.refresh));
router.post('/forget-password',valid(authSchema.forgetPasswordSchema),asyncErrorHandler(authServices.forgetPassword));
router.post('/reset-password',valid(authSchema.resetPasswordSchema),asyncErrorHandler(authServices.resetPassword));
router.post('/reset-email',valid(authSchema.resetEmailSchema),auth,asyncErrorHandler(authServices.resetEmail));
router.post('/login-with-google',asyncErrorHandler(authServices.loginWithGoogle));
router.post('/update-email',valid(authSchema.updateEmailSchema),auth,asyncErrorHandler(authServices.updateEmail));
export default router;