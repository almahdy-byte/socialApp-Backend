
import cors from 'cors';
import { globalErrorHandler } from './utils/errorHandler/globalErrorHandler.js';
import { connectToDB } from './DB/connection.js';
import authRouter from './modules/authModule/auth.router.js'
import userRouter from './modules/userModule/user.router.js'
import postRouter from './modules/postModule/post.router.js';
import adminRouter from './modules/adminModule/admin.router.js'
import { StatusCodes } from 'http-status-codes';
import {schema} from './graphQl.js'
import { createHandler } from 'graphql-http/lib/use/express';
export const bootstrap = async (app , express) => {
app.use(express.json());
// app.use(cors({
//     origin:function(origin , callBack){
//         const whiteList = ["http://localhost:5000"] 
//         if(!whiteList.includes(origin))
//             return callBack('in-valid origin')
//         return callBack(null , true)
//     }
// }));
app.use(cors());
await connectToDB()

app.use('/auth' , authRouter);
app.use('/user' , userRouter);
app.use('/post' , postRouter);
app.use('/admin' , adminRouter);
app.use('/uploads' , express.static('uploads'));
app.use('/graphQl' , createHandler({schema}))
app.all('*' , (req , res ,next)=>{
    return res.status(StatusCodes.NOT_FOUND).json({message:'page not found'})
})
app.use(globalErrorHandler)

}