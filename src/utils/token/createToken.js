import { Roles } from "../../DB/models/user.model.js";
import { sign } from "./sign.js";

export const createToken = async(role , payload = {})=>{
let accessToken = undefined;
let refreshToken = undefined;

switch (role) {
    case Roles.Admin:
        accessToken = sign(payload , process.env.ADMIN_ACCESS_TOKEN );
        refreshToken = sign(payload,process.env.ADMIN_REFRESH_TOKEN , '1w');
        break;
    case Roles.User:
        accessToken = sign(payload , process.env.USER_ACCESS_TOKEN ) ;
        refreshToken = sign(payload,process.env.USER_REFRESH_TOKEN ,'1w');
        break;
    default:
        break;
}
return [accessToken , refreshToken];
}