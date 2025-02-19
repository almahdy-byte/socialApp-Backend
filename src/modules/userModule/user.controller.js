import { StatusCodes } from "http-status-codes";
import { findOneAndUpdate , findById, findByIdAndUpdate} from "../../DB/dbService.js";
import userModel from "../../DB/models/user.model.js";
import fs from 'fs'
import path from "path";
import cloudinary from "../../utils/multer/cloudinary.js";

export const shareProfile=async(req , res , next)=>{
    const {profileId} = req.params;
    const user = req.user;
    if(user._id.toString() == profileId.toString()) return res.status(StatusCodes.ACCEPTED).json({user})
    const profile =await findOneAndUpdate({
        model:userModel,
        filter:{_id:profileId , isConfirmed:true},
        update:{
            $push:{
                viewers:{
                    userId : user._id,
                    time:Date.now()
                }
            }
        },
        select:'userName email -_id'
    })
    if(!profile) return next(new Error('user not fount' , {cause:StatusCodes.NOT_FOUND}));
    return res.status(StatusCodes.ACCEPTED).json({profile , message:'done'})
}

export const getProfile = async(req , res ,next)=>{
    const user = await findById({
        model:userModel,
        id:req.user._id,
        populate:[
            {path:'viewers.userId',
            select:'userName email _id'}
        ]
    })
    res.status(StatusCodes.ACCEPTED).json({user})
}

export const uploadPicture = async(req , res , next)=>{
    return res.json({message:'done'})
}


export const setProfilePicture= async(req , res , next)=>{
    
    const file = req.file
    
    const user = req.user
    
    const {public_id , secure_url} =await cloudinary.uploader.upload(file.path , {
        folder:`users/${user._id}`
    })
    user.profilePicture={
        public_id , secure_url
    }
    await user.save()
    return res.json({message:'done11' , user})
}

export const deleteProfilePicture = async(req , res , next)=>{
    const user = req.user;
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
    const user_ = await findByIdAndUpdate({
        model:userModel,
        id:user._id,
        options:{
            new:true
        },
        update:{
            $unset:{
                profilePicture:''
            }
        }
    });
    user_.save();

    return res.status(StatusCodes.ACCEPTED).json({ user_})
}