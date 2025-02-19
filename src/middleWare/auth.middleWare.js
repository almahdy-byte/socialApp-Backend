import { decodeToken } from "../utils/token/decodeToken.js";

export const auth = async(req , res , next)=>{
const authorization = req.headers['authorization'];
const {user} =await decodeToken({authorization , next });
req.user = user;
next();
}