import { asyncErrorHandler } from "../utils/errorHandler/asyncErrorHandler.js";
import { decodeToken, graphDecodeToken } from "../utils/token/decodeToken.js";
import { StatusCodes } from "http-status-codes";

export const auth = () => {
    return asyncErrorHandler(async(req, res, next)=>{
        const authorization = req.headers['authorization'];
        const {user} =await decodeToken({authorization , next});
        
        
        if(!user)
            return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
        req.user = user;     
    
        next();
    })
};
export const graphAuth = async(authorization)=>{
    const {user} =await graphDecodeToken({authorization});
    return user
    }