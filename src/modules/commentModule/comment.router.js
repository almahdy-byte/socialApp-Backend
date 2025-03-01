import { Router } from "express";
import { asyncErrorHandler } from "../../utils/errorHandler/asyncErrorHandler.js";
import * as commentServices from "../commentModule/comment.controller.js"
import { auth } from "../../middleWare/auth.middleWare.js";
import { fileType, uploadFile } from "../../utils/multer/uploadFile.js";

const router = Router({mergeParams:true});



router.route('/')
    .get((req , res , next)=>{
        return res.json({message:req.params})
    })
    .post(
            auth() ,
            uploadFile(fileType.image).single('image'),
            asyncErrorHandler(commentServices.createComment)
    )
router.patch('/:commentId' ,
    auth(),
    uploadFile(fileType.image).single('image'),
    asyncErrorHandler(commentServices.updateComment)
    )
router.patch('/soft-delete/:commentId' ,
        auth(),
        asyncErrorHandler(commentServices.softDelete)
    )
router.patch('/like-unlike/:commentId' ,
        auth(),
        asyncErrorHandler(commentServices.like_unlike)
    )
    router.post('/add-replay/:commentId' , 
        auth(),
        uploadFile(fileType.image).single('image'),
        asyncErrorHandler(commentServices.addReplay)
    
    )
    router.get('/get-replays/:commentId' , 
        auth(),
        asyncErrorHandler(commentServices.getReplay)
    )
    router.get('/get-replays/' , 
        auth(),
        asyncErrorHandler(commentServices.getReplay)
    )
    router.delete('/hard-delete/:commentId' ,
        auth(),
        asyncErrorHandler(commentServices.hardDelete)
    )

export default router;

