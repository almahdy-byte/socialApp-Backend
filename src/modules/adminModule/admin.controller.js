import { StatusCodes } from "http-status-codes"
import { find, findOne } from "../../DB/dbService.js"
import userModel, { Roles } from "../../DB/models/user.model.js"

export const getUsersPosts = async(req , res , next)=>{
    const users = await find(
        {
            model:userModel,
            populate:[{
                path : 'posts' , 
                match:{isDeleted:false}
            }]
        }
    )
    return res.status(StatusCodes.ACCEPTED).json({message:'done' , users})
}


export const changeRole = async(req , res , next)=>{
    const targetUser = await findOne({
        model : userModel ,
        filter:{
            isConfirmed : true , 
            _id : req.params.id
        }
    }) 
    if(!targetUser)
        return next(new Error("user not found" , {cause:StatusCodes.NOT_FOUND}));
    const roles =  Object.values(Roles);
    const [userRoleIndex  , targetUserRoleIndex , roleIndex] = [roles.indexOf(req.user.role) , roles.indexOf(targetUser.role) , roles.indexOf(req.body.role)];
    if ((userRoleIndex < targetUserRoleIndex) && (userRoleIndex <= roleIndex)){
        targetUser.role = req.body.role;
        await targetUser.save()
        return res.status(StatusCodes.ACCEPTED).json({message:'done' , targetUser});
    }
    return next(new Error("you can't change role" , {cause:StatusCodes.BAD_GATEWAY}))
}



