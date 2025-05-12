import { model, Schema, Types } from "mongoose";

const AIChatSchema = new Schema({
    user:{
        type : Types.ObjectId
        , ref: 'User'
    }
    ,

    messages: [{
        message:{
            body:{
                type: String,
                required: true
            },
            tree:{
                type: Object,
                required: true
            }
        },
        AIMessage:{
            body:{
                type: String,
                required: true
            },
            tree:{
                type: Object,
                required: true
            }
        }
    }]
})


export const AIChatModel = model('AIChats', AIChatSchema);