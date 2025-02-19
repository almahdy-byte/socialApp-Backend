import { decodeToken, graphDecodeToken } from "../utils/token/decodeToken.js";

export const auth = async(req , res , next)=>{
const authorization = req.headers['authorization'];
const {user} =await decodeToken({authorization , next });
req.user = user;
next();
}


export const graphAuth = async(authorization)=>{
    const {user} =await graphDecodeToken({authorization});
    return user
    }