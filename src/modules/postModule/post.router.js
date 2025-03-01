import { Router } from "express";
import {auth} from '../../middleWare/auth.middleWare.js'
import {asyncErrorHandler} from '../../utils/errorHandler/asyncErrorHandler.js'
import * as postServices from './post.controller.js'
import commentRouter from '../commentModule/comment.router.js'
const router = Router();


router.use('/:postId/comment' , commentRouter)
router.route('/')
    .get((req , res , next)=>{return res.json({message:"hello post router"})})
    .post(
        auth(),
        asyncErrorHandler(postServices.createPost)
    )
router.patch('/:postId' ,
    auth(),
    asyncErrorHandler(postServices.updatePost)
)

router.delete('/:postId' ,
    auth(),
    asyncErrorHandler(postServices.deletePost)
)
router.delete('/soft-delete/:postId' ,
    auth(),
    asyncErrorHandler(postServices.softDelete)
)
router.get('/get-all-post' , asyncErrorHandler(postServices.getPost))
router.get('/get-post/:postId' , asyncErrorHandler(postServices.getPost))
router.patch('/like-unlike/:postId' , auth(),asyncErrorHandler(postServices.like_unlike))

export default router;