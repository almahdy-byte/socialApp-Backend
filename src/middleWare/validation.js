import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Types } from "mongoose";
import { Roles } from "../DB/models/user.model.js";
export const valid = (schema)=>{
    return (req,res,next)=>{
        const data = {
            ...req.body,
            ...req.params,
            ...req.query    
        }
        
        const result = schema.validate(data);
        let errors = [];
        if(result.error){
            errors.push(result.error.details[0].message)
            return next(new Error(errors) , {cause:StatusCodes.BAD_REQUEST})  
        }
        
        next();
}
}


const idValidation =(id)=>{
    return Types.ObjectId.isValid(id) ? true : helper.message = "Invalid ID";
}

export const generalValidation = {
    userName:Joi.string(),
    email:Joi.string().email(),
    password:Joi.string(),
    phone:Joi.string(),
    role:Joi.string().valid(Roles.Admin , Roles.User),
    id:Joi.custom(idValidation),
    code:Joi.string().length(6)
}