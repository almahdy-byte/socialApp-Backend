import { model, Schema, Types } from "mongoose";

const AIChatSchema = new Schema({
    user:{
        type : Types.ObjectId
        , ref: 'User'
    }
    ,

    messages: [{
        message:{
            type: String,
            required: true
        },
        AIMessage:{
            type: String,
            required: true
        }
    }]
})


export const AIChatModel = model('AIChats', AIChatSchema);