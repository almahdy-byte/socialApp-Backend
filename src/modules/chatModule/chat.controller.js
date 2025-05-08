import { StatusCodes } from "http-status-codes";
import { chatModel } from "../../DB/models/chat.model.js";
import userModel from "../../DB/models/user.model.js"
import { findOne } from "../../DB/dbService.js";
import { AIChatModel } from "../../DB/models/AIChat.model.js";
import { AI } from "../../utils/AIChating/AIChat.js";
import { asyncErrorHandler } from "../../utils/errorHandler/asyncErrorHandler.js";


export const getChat = async(req , res , next)=>{

    const friend = await findOne({
        model:userModel,
        filter:{_id:req.params.userId}
    })

    if(!friend) 
        return next(new Error('friend not found' , {cause:StatusCodes.NOT_FOUND}));

    if(friend._id.toString() === req.user._id.toString())
        return next(new Error('you can not chat with your self' , {cause:StatusCodes.BAD_REQUEST}));

    let chat = await chatModel.findOne({
        users:{$all:[req.user._id , friend._id]}
    }).populate([{
        path:'messages.senderId',
        select:'profilePicture.secure_url userName _id'
    }])

        if(!chat){
        chat = await chatModel.create({
            users:[req.user.id , req.params.userId],
            messages:[]
        })
    }
    
    return res.status(StatusCodes.ACCEPTED).json({chat , messages:chat.messages} );
}

export const getChatWithAI = async(req, res, next)=>{
    let AIChat = await AIChatModel.findOne({
        user : req.user._id
    })

        if(!AIChat){
            AIChat = await AIChatModel.create({
            user : req.user.id ,
            messages:[]
        })
    }
    return res.status(StatusCodes.ACCEPTED).json({AIChat , messages:AIChat.messages} );

}

export const chatWithAI= asyncErrorHandler(async(req , res , next) =>{
const message = req.body.message;
const user = req.user;
const AIMessage = await AI(message);
console.log({AIMessage});

    const AIChat = await AIChatModel.findOneAndUpdate(
        {
            user: user._id
        },
        {
            $push: {
                messages: {
                    message,
                    AIMessage
                    }
            }
        },
        {
            new:true,
            upsert:true
        }
    )

    return res.status(StatusCodes.ACCEPTED).json({AIChat , AIMessage});

})