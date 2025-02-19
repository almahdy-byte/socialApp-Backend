import { StatusCodes } from 'http-status-codes';
import * as dbServices from '../../DB/dbService.js';
import { postModel } from '../../DB/models/post.model.js';
import { paginate } from 'mongoose-paginate-v2';


export const createPost =async(req , res , next)=>{
const post = await dbServices.create({
    model:postModel,
    date:{
        ...req.body,
        userId:req.user._id
    }
});
return res.status(StatusCodes.ACCEPTED).json({post});
}

export const updatePost = async(req , res ,next)=>{
    const {postId} = req.params;
    const {title , body} = req.body; 
    const post = await dbServices.findOne({
        model:postModel , 
        filter:{
            _id:postId,
            isDeleted:false
        }
    });
    if(!post) return next(new Error('post not found' ,{cause:StatusCodes.NOT_FOUND}));
    if(post.userId.toString() !== (req.user._id).toString())
            return next(new Error('you are not authorized to edit this post ' ,{cause:StatusCodes.BAD_REQUEST}));
    post.title = title || post.title;
    post.body = body || post.body;
    await post.save();
    return res.status(StatusCodes.ACCEPTED).json({message:"done" , post})
}

export const deletePost = async(req , res ,next)=>{
    const {postId} = req.params;
    const post = await dbServices.findOne({
        model:postModel , 
        filter:{
            _id:postId,
            isDeleted:false
        }
    });
    if(!post) return next(new Error('post not found' ,{cause:StatusCodes.NOT_FOUND}));
    if(post.userId.toString() !== (req.user._id).toString())
            return next(new Error('you are not authorized to delete this post ' ,{cause:StatusCodes.BAD_REQUEST}));
    const result =  await dbServices.deleteById({
        model:postModel,
        id:postId
    })
    return res.status(StatusCodes.ACCEPTED).json({message:"done"  , result})
}

export const softDelete = async(req , res ,next)=>{
    const {postId} = req.params;
    const post = await dbServices.findOne({
        model:postModel , 
        filter:{
            _id:postId,
            isDeleted:false
        }
    });
    if(!post) return next(new Error('post not found' ,{cause:StatusCodes.NOT_FOUND}));
    if(post.userId.toString() !== (req.user._id).toString())
            return next(new Error('you are not authorized to delete this post ' ,{cause:StatusCodes.BAD_REQUEST}));
    post.isDeleted = true;
    await post.save();
    return res.status(StatusCodes.ACCEPTED).json({message:"done" , post})
}

export const getPost = async(req , res , next)=>{
    const filter = {
        isDeleted:false
    };
    if(req.params.postId) {
        filter._id = req.params.postId
    }
    const {page , limit} = req.query;
    const posts = await postModel.paginate(
        {},{
            limit,
            page ,
            populate:[{
                path:'likes',
                select:'userName email -_id'
            },
            {
                path:'userId',
                select:'userName email -_id'
            }
             , {
                path:"comments"
             }
            ]
        }
    )
    return res.status(StatusCodes.ACCEPTED).json({posts});
}

export const like_unlike = async(req , res ,next) =>{
    const {postId} = req.params;
    const post = await dbServices.findOne({
        model:postModel,
        filter:{
            _id : postId , 
            isDeleted:false
        }
    });
    const isExist = post.likes.find(e=> e.toString() === (req.user._id).toString());
    if(isExist){
        const likes = post.likes.filter(e => e.toString()!==req.user._id.toString())
        post.likes = likes
    }else{
        post.likes.push(req.user._id)
    }
    await post.save();
    return res.json({post})
}