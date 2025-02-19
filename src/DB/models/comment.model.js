

import { Schema, Types, model }  from"mongoose";
import cloudinary from "../../utils/multer/cloudinary.js";

const commentSchema = new Schema({
    text:{
        type:String,
        required:function(){
            return(Object.values(this.image) && Object.values(this.image).length > 0 && Object.values(this.image)[0]) ?false : true
        }
    },
    image:{
        public_id:String, secure_url:String
    },
    postId:{
        type:Types.ObjectId,
        required:true,
        ref:'Post'
    },
    createdBy:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    deletedBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    parentComment:{
        type:Types.ObjectId,
        ref:'Comment'
    },
    likes: [{ type: Types.ObjectId, ref: "User" } ]
},{timestamps:true  ,  toJSON: { virtuals: true },
toObject: { virtuals: true } });

commentSchema.virtual('replays' , {
    foreignField:"parentComment" , 
    ref:'Comment',
    localField:'_id'
})

commentSchema.post('deleteOne' ,{document:true , query : false} ,async function(doc , next){
    const parentComment = doc._id ; 
    if(parentComment.image?.public_id)
        await cloudinary.uploader.destroy(parentComment.image.public_id)
    const replays = await this.constructor.find({parentComment})
    if(replays.length>0){
        for (const replay of replays) {
            await replay.deleteOne();
        }
    }
    return next();
})

export const commentModel = model('Comment' , commentSchema);