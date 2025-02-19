import { graphAuth } from "../../middleWare/auth.middleWare.js";
import { graphValid, valid } from "../../middleWare/validation.js";
import { postSchema } from "./post.validation.js";
import * as dbServices from '../../DB/dbService.js'
import { postModel } from "../../DB/models/post.model.js";

export const createPost =async (_,args)=>{
    const {title , body , authorization} = args;
    const user = await graphAuth(authorization);
    const postGraphValidation = await graphValid(args , postSchema);
    if(postGraphValidation) throw new Error(...postGraphValidation + "")
    const post = await dbServices.create({
    model:postModel,
    date:{
        title,
        body,
        userId : user._id
    }
});
return {
    message:'done' ,
    post
}
}