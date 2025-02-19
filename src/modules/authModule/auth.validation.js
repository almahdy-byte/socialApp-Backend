import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.js";
import { code } from "../../utils/sendMail/code.js";

export const registerSchema = Joi.object({
    userName:generalValidation.userName.required(),
    email:generalValidation.email.required(),
    password:generalValidation.password.required(),
    phone:generalValidation.phone.required(),
    role:generalValidation.role
})

export const confirmEmailSchema = Joi.object({
    email:generalValidation.email.required(),
    code:generalValidation.code.required()
})

export const loginSchema = Joi.object({
    email:generalValidation.email,
    password:generalValidation.password
}).required();

export const forgetPasswordSchema = Joi.object({
    email:generalValidation.email,
}).required();

export const resetPasswordSchema = Joi.object({
    email:generalValidation.email,
    password:generalValidation.password,
    code:generalValidation.code
}).required();

export const resetEmailSchema = Joi.object({
    email:generalValidation.email,
}).required();

export const updateEmailSchema = Joi.object({
    oldCode:generalValidation.code,
    newCode:generalValidation.code
}).required();