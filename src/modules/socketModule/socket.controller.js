import {Server } from "socket.io";
import { decodeToken } from "./socket.auth.js";
import { sendMessage } from "./socket.services.js";

export const serverConnection = (server)=>{
    const io = new Server(server , {
        cors:'*'
    })
    io.use(async(socket, next) => {
        const authorization = socket.handshake.auth.token;
        const  user =await decodeToken({authorization , next});
        if (!user) return next(new Error("Authentication error"));
        socket.userName = user.user;
        socket.id = user.id;
        socket.user = user;
        next();
});
    io.on("connection", (socket)=>{ 
        console.log("New client connected");
        sendMessage(socket);
        socket.on("disconnect", ()=>{console.log("Client disconnected")});
    });
}
