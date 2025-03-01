import { StatusCodes } from "http-status-codes";
import { findOneAndUpdate , findById, findByIdAndUpdate, findOne} from "../../DB/dbService.js";
import userModel from "../../DB/models/user.model.js";
import fs from 'fs'
import path from "path";
import cloudinary from "../../utils/multer/cloudinary.js";
import { areFriends } from "./helpers/checkFriends.js";
import { checkFriendRequest } from "./helpers/checkFriendRequest.js";

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
    return res.json({message:'done' , user})
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


export const getFriedRequests = async(req , res , next)=>{
const user = req.user;
const friend = await findOne({
    model:userModel,
    filter:{_id:req.params.friendId}
})

if(!friend) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}))
if(user._id.toString() === friend._id.toString()) return next(new Error('can not send request to your self', {cause:StatusCodes.FORBIDDEN}))
if(areFriends({user , friend})) return next(new Error('already friends' , {cause:StatusCodes.BAD_REQUEST}));
if(checkFriendRequest({user , friend})) return next(new Error('request already sent' , {cause:StatusCodes.BAD_REQUEST}));
friend.friendRequests.push(user._id);
await friend.save(); 
return res.status(StatusCodes.ACCEPTED).json({message:'done' , friendRequests : friend.friendRequests})
}

export const acceptFriendRequest = async(req , res , next)=>{
    const user = req.user; // receiver me
    const friend = await findOne({
        model:userModel,
        filter:{_id:req.params.friendId}
    })
    if(!friend) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}))
        console.log({friend , user});
        
    if(areFriends({user , friend})) return next(new Error('already friends' , {cause:StatusCodes.BAD_REQUEST}));
    if(!checkFriendRequest({user , friend})) return next(new Error('not found friend request' , {cause:StatusCodes.BAD_REQUEST}));
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friend._id.toString());    
    user.friends.push(friend._id);
    friend.friends.push(user._id);  
    await Promise.all([user.save() , friend.save()])
    return res.status(StatusCodes.ACCEPTED).json({message:'done' , friendRequests : user.friends})
    }

export const getFriends = async(req , res , next)=>{
    const user = req.user;
    await user.populate([{
            path:'friends',
            select:'userName email _id profilePicture.secure_url'
        }
    ])
    
    res.status(StatusCodes.ACCEPTED).json({friends:user.friends})
}
