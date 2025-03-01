import { model, Schema, Types } from "mongoose";

const chatSchema = new Schema({
    users:[{type : Types.ObjectId, ref: 'User'}],
    messages: [{
        body:{
            type: String,
            required: true
        },
        senderId:{
            type: Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
})


export const chatModel = model('Chats', chatSchema);