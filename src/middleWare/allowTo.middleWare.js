import { asyncErrorHandler } from "../utils/errorHandler/asyncErrorHandler.js"

export const allowTo =(roles = [])=>{
    return asyncErrorHandler(async(req , res ,next)=>{
        const user = req.user;
        if(!roles.includes(user.role))
            return next( new Error("you aren't allowed to access this endpoint"));
        next()
    })
}