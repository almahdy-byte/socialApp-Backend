import { StatusCodes } from 'http-status-codes';
import * as dbServices from '../../DB/dbService.js'
import { commentModel } from '../../DB/models/comment.model.js';
import { postModel } from '../../DB/models/post.model.js';
import cloudinary from '../../utils/multer/cloudinary.js';
import { Roles } from '../../DB/models/user.model.js';


export const createComment = async(req , res , next)=>{
const {postId} = req.params;
const {text} = req.body;
const post = await dbServices.findOne({
    model:postModel,
    filter:{
        _id : postId , 
        isDeleted:false
    }
})
if(!post)
    return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));
let image ;
if(req.file){    
    const{public_id , secure_url} = await cloudinary.uploader.upload(req.file.path , {
        folder:`post/${req.user._id}/comment`
    });
    image  = {public_id , secure_url}
}
const comment = await dbServices.create({
    model:commentModel,

    date:{
        postId , text , image , createdBy : req.user._id
    }
});
return res.status(StatusCodes.ACCEPTED).json({message:'done' , comment})
}

export const updateComment =async (req  , res , next)=>{
    const {postId , commentId} = req.params;
    const {text} = req.body;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    })
    if(!post)
        return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));
    const comment = await dbServices.find({
        model:commentModel,
        filter:{
            _id : commentId , 
            isDeleted:false
        }
    })
    if(comment)
        return next(new Error('comment not found' , {cause:StatusCodes.NOT_FOUND}));
    if(req.user._id.toString()!=comment.createdBy.toString())
        return next(new Error('you are not authorized to update this comment' , {cause:StatusCodes.BAD_REQUEST}));
    comment.text = text || comment.text;
    if(req.file){
        await cloudinary.uploader.destroy(comment.image.public_id);
        comment.image=await createImage({img : req.file, folder : `post/${req.user._id}comment` });
    }
    await comment.save();
    return res.status(StatusCodes.ACCEPTED).json({message:'done' , comment})
}

export const softDelete = async(req , res , next) =>{
    const {postId , commentId} = req.params;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    })
    if(!post)
        return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));    
    const comment = await dbServices.findOne({
        model:commentModel,
        filter:{
            _id : commentId , 
            isDeleted:false
        }
    })
    if(!comment)
        return next(new Error('comment not found' , {cause:StatusCodes.NOT_FOUND}));    
    if(req.user._id.toString() == post.userId.toString() || req.user._id.toString() == comment.createdBy.toString()|| req.user.role == Roles.Admin){
            comment.isDeleted = true;
            await comment.save()
            return res.status(StatusCodes.ACCEPTED).json({message:'done' , comment})
        };
        return next(new Error('you are not authorized to delete this comment' , {cause:StatusCodes.BAD_REQUEST}));

}

export const like_unlike = async(req , res ,next) =>{
    const {postId , commentId} = req.params;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    })
    if(!post)
        return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));    
    const comment = await dbServices.findOne({
        model:commentModel,
        filter:{
            _id : commentId , 
            isDeleted:false , 
            postId
        }
    })
    if(!comment)
        return next(new Error('comment not found' , {cause:StatusCodes.NOT_FOUND})); 



    const isExist = comment.likes.find(e=> e.toString() === (req.user._id).toString());
    if(isExist){
        const likes = comment.likes.filter(e => e.toString()!==req.user._id.toString())
        comment.likes = likes
    }else{
        comment.likes.push(req.user._id)
    }
    await post.save();
    return res.json({comment})
}

export const addReplay = async(req , res, next)=>{
    const {postId , commentId} = req.params;
    const {text} = req.body;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    })
    if(!post)
        return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));    
    const parentComment = await dbServices.findOne({
        model:commentModel,
        filter:{
            _id : commentId , 
            isDeleted:false , 
            postId
        }
    })
    if(!parentComment)
        return next(new Error('comment not found' , {cause:StatusCodes.NOT_FOUND})); 
    let image ;
    if(req.file){
        const{public_id , secure_url} = await cloudinary.uploader.upload(req.file.path , {
            folder:`post/${req.user._id}/comment`
        });
        image  = {public_id , secure_url}
    }
const comment = await dbServices.create({
    model:commentModel,
    date:{
        postId , text , image , createdBy : req.user._id , parentComment:parentComment._id
    }
});
return res.status(StatusCodes.ACCEPTED).json({message:'done' , comment})
}


export const getReplay = async(req , res , next)=>{
    const {postId , commentId} = req.params;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    })
    if(!post)
        return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));    
    let filter = {
        postId,
        isDeleted:false , 
        parentComment:{ $exists: false }
    } 
    if(commentId) 
        filter['commentId'] = commentId
    const comment = await dbServices.find({
        model:commentModel, 
        filter,
        populate:{
            path:'replays',
        }
    })
    if(!comment)
        return next(new Error('comment not found' , {cause:StatusCodes.NOT_FOUND})); 
    return res.status(StatusCodes.ACCEPTED).json({comment , count : comment.length})
}
export const hardDelete = async(req , res , next) =>{
    const {postId , commentId} = req.params;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    })
    if(!post)
        return next(new Error('post not found' , {cause:StatusCodes.NOT_FOUND}));    
    const comment = await dbServices.findOne({
        model:commentModel,
        filter:{
            _id : commentId , 
            isDeleted:false
        }
    })
    if(!comment)
        return next(new Error('comment not found' , {cause:StatusCodes.NOT_FOUND}));    
    if(req.user._id.toString() == post.userId.toString() || req.user._id.toString() == comment.createdBy.toString()|| req.user.role == Roles.Admin){
            if(comment.image?.public_id)
            await cloudinary.uploader.destroy(comment.image.public_id)
            await comment.deleteOne()
            return res.status(StatusCodes.ACCEPTED).json({message:'done' , comment})
        };
        return next(new Error('you are not authorized to delete this comment' , {cause:StatusCodes.BAD_REQUEST}));

}