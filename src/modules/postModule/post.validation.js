import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.js";

export const postSchema = Joi.object({
    title:generalValidation.title,
    body:generalValidation.body,
    authorization : Joi.string()
}).required();