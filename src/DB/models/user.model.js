
import { Schema  , Types, model} from "mongoose";
export const Roles = {
    superAdmin:'superAdmin' , 
    Admin:"admin",
    User:"user",
}
export const Providers = {
    System:"system",
    Google:"google",
}
const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        enum:[Roles.Admin , Roles.User],
        default:"user",
    },
    isConfirmed:{
        type:Boolean,
        default:false,
    },
    provider:{
        type:String,
        enum:[Providers.System , Providers.Google],
        default:Providers.System,
    },
    confirmEmailOTP:{
        type:String,
    },
    resetPasswordOTP:{
        type:String,
    },
    tempEmail:{
        type:String,
    },
    tempEmailCode:{
        type:String
    },
    changeEmailCode:{
        type:String
    },
    viewers:[
        {
            userId : {
                type:Types.ObjectId,
                ref :'User'
            },
            time:Date
        }
    ],
    profilePicture:{
        public_id:String,
        secure_url:String
    },
    friendRequests:[
        {
                type:Types.ObjectId,
                ref :'User'
        }
    ],
    friends:[{
                type:Types.ObjectId,
                ref :'User'
    }]
}   ,{ toJSON: { virtuals: true },
toObject: { virtuals: true }}
);


userSchema.virtual('posts' ,{
    ref:'Post',
    foreignField:'userId' , 
    localField:'_id'
})
const User = model("User" , userSchema);

export default User;