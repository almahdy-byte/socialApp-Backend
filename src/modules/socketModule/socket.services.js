import { chatModel } from "../../DB/models/chat.model.js";
import userModel from "../../DB/models/user.model.js";
import { areFriends } from "../userModule/helpers/checkFriends.js";



    export const sendMessage =async(socket)=>{
        return socket.on('private_message' ,async (data)=>{
            const {to , message} = data;
            console.log({to , message});
            
            const user = socket.user;
            const friend =await userModel.findOne({_id:to});
            if(!areFriends({user , friend})) throw new Error('you can not send message to this user');
            await chatModel.findOneAndUpdate({
                users:{
                $all:[user._id , friend._id]}
                
            },{
                $push:{
                    messages:{
                        body : message,
                        senderId : user._id,
                    }
                    }
            },{
                new:true
            });

            socket.to(friend._id.toString()).emit('private_message' , {
                senderId:{
                    profilePic:{
                        secure_url:user.profilePicture.secure_url,
                        userName:user.userName
                    }
                } , 
                body:message
            })
        })
        

    }