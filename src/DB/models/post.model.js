
import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const postSchema =new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String
    },
    userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    likes: [{ type: Types.ObjectId, ref: "User" } ]
    ,
} , {timestamps : true ,toJSON:{virtuals:true} , toObject:{virtuals:true}})


postSchema.virtual('comments' ,{
    foreignField:'postId' , 
    ref:'Comment',
    localField:'_id'
})
postSchema.plugin(mongoosePaginate)
export const postModel = model('Post' , postSchema);