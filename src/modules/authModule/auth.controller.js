import { StatusCodes } from "http-status-codes";
import { create, findOne, findOneAndUpdate } from "../../DB/dbService.js";
import userModel, { Providers } from "../../DB/models/user.model.js";
import { hash } from "../../utils/hash/hash.js";
import { encrypt } from "../../utils/cryprt/encrypt.js";
import { emailEvent, subjects } from "../../utils/sendMail/sendEmail.js";
import { code } from "../../utils/sendMail/code.js";
import { template } from "../../utils/sendMail/template.js";
import { compare } from "../../utils/hash/compare.js";
import { createToken } from "../../utils/token/createToken.js";
import { decodeToken, tokenTypes } from "../../utils/token/decodeToken.js";
import { sign } from "../../utils/token/sign.js";

export const register =async (req , res , next) =>{
    const { userName , email , password , phone , role } = req.body;
    const isExist =await findOne({
        model:userModel,
        filter:{email}
    });
    if(isExist) return next(new Error('email already exist' , {cause:StatusCodes.BAD_REQUEST}));
    const confirmEmailOTP =await code();
    const html = template(confirmEmailOTP , userName , subjects.confirmEmail)
    const user = await create({
        model:userModel,
        date:{
            userName ,
            email,
            password:await hash(password),
            phone:await encrypt(phone),
            role,
            confirmEmailOTP:await hash(confirmEmailOTP)
        }
    })
    emailEvent.emit("confirmEmail",{to:email , html })
    return res.status(StatusCodes.ACCEPTED).json({message:'done' , user});
}

export const confirmEmail =async (req , res ,next)=>{

const {email , code} = req.body;
const user = await findOne({
    model:userModel,
    filter:{email}
});
if(!user) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
if(!compare(code , user.confirmEmailOTP)) return next(new Error('incorrect code' ,{cause:StatusCodes.BAD_REQUEST}));
await findOneAndUpdate({
    model:userModel,
    filter:{email},
    update:{
        isConfirmed:true,
        $unset:{
            confirmEmailOTP:""
        }
    }
});

return res.status(StatusCodes.ACCEPTED).json({message:'done'})
}

export const login = async(req , res , next)=>{
    const {email , password} = req.body;
    const user = await findOne({
        model:userModel,
        filter:{email}
    })
    if(!user) return next(new Error('invalid email or password ' , {cause:StatusCodes.BAD_REQUEST}));
    if(!compare(password , user.password)) return next(new Error('invalid email or password ' , {cause:StatusCodes.BAD_REQUEST}));
    const [accessToken , refreshToken] =await createToken(user.role , {id:user._id});
    return res.status(StatusCodes.ACCEPTED).json({message:'done' , accessToken , refreshToken});
    
}

export const refresh = async(req,res,next)=>{
    
    const {refreshToken} = req.body;
    const { user , accessSignature} =await decodeToken({authorization:refreshToken , next , type:tokenTypes.refresh });
    const accessToken = await sign({id:user._id} , accessSignature , '15w')
    return res.status(StatusCodes.ACCEPTED).json({message:'done' , accessToken } )
}

export const forgetPassword = async(req , res ,next)=>{
    const {email} = req.body;
    const user = await findOne({
        model:userModel,
        filter:{email , isConfirmed:true}
    });
    if(!user) return next(new Error('user not fount' , {cause:StatusCodes.NOT_FOUND}));
    const resetPasswordOTP = await code();
    const html = template(resetPasswordOTP , user.userName , subjects.resetPassword);
    user.resetPasswordOTP = hash(resetPasswordOTP);
    user.save();
    emailEvent.emit('resetPassword' , {to:user.email , html});
    return res.status(StatusCodes.ACCEPTED).json({message:'check your email'});
}

export const resetPassword = async(req , res, next)=>{
    const {email , code , password} = req.body;
    const user = await findOne({
        model:userModel,
        filter:{email , isConfirmed:true}
    });
    if(!user) return next(new Error('user not fount' , {cause:StatusCodes.NOT_FOUND}));
    if(!compare(code , user.resetPasswordOTP)) return next(new Error('incorrect code' ,{cause:StatusCodes.BAD_REQUEST}));
    await findOneAndUpdate({
        model:userModel,
        filter:{email},
        update:{
            password:hash(password),
            $unset:{
                resetPasswordOTP:""
            }
        }
    });
    return res.status(StatusCodes.ACCEPTED).json({message:'done'})
}
export const resetEmail = async(req , res , next)=>{
    const {email} = req.body;
    const isExist = await findOne({
        model:userModel , 
        filter:{email , isConfirmed:true}
    })
    if(isExist) return next(new Error('email already exist'));
    const user = req.user;
    const tempEmailCode = await code();
    const changeEmailCode = await code();
    console.log(user , email);
    
    user.tempEmail = email;
    user.tempEmailCode =await hash(tempEmailCode);
    user.changeEmailCode =await hash(changeEmailCode)
    await user.save();
    emailEvent.emit('resetEmail',{
        to:email,
        html: template(tempEmailCode , user.userName , subjects.resetEmail),
    })
    emailEvent.emit('resetEmail',{
        to:user.email,
        html: template(changeEmailCode , user.userName , subjects.resetEmail),
    })
    return res.status(StatusCodes.ACCEPTED).json({message:'check your emails'});
}

export const updateEmail= async(req , res , next)=>{
    const {oldCode , newCode} = req.body;
    const user = req.user
if(!user) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
if(
    !compare(newCode , user.tempEmailCode)
    || !compare(oldCode , user.changeEmailCode)) return next(new Error('incorrect code' ,{cause:StatusCodes.BAD_REQUEST}));
await findOneAndUpdate({
    model:userModel,
    filter:{email:user.email},
    update:{
        email : user.tempEmail,
        $unset:{
            tempEmail:"",
            changeEmailCode:""
            ,tempEmailCode:""
        }
    }
});
return res.status(StatusCodes.ACCEPTED).json({message:'done'})
}

export const loginWithGoogle = async(req , res , next)=>{
    const {idToken} = req.body;
    const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID});
  const payload = ticket.getPayload();
  return payload
}

const userData = verify();

if(!userData.email_verified) return next(new Error('email not verified' , {cause:StatusCodes.BAD_REQUEST}));
let user = await findOne({
    model:userModel,
    filter:{email:userData.email}
});
if(user?.provider == Providers.System) return next(new Error('you should login with the system' , {cause:StatusCodes.BAD_REQUEST}));
if(!user){
    user = await create({
        model:userModel,
        date:{
            userName:userData.name,
            email:userData.email,
            provider:Providers.Google,
            isConfirmed:true
        }
    });
}
const [accessToken , refreshToken] =await createToken(user.role , {id:user._id});
return res.status(StatusCodes.ACCEPTED).json({message:'done' , accessToken , refreshToken});
}