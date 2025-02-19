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
            asyncErrorHandler(auth) ,
            uploadFile(fileType.image).single('image'),
            asyncErrorHandler(commentServices.createComment)
    )
router.patch('/:commentId' ,
    asyncErrorHandler(auth),
    uploadFile(fileType.image).single('image'),
    asyncErrorHandler(commentServices.updateComment)
    )
router.patch('/soft-delete/:commentId' ,
        asyncErrorHandler(auth),
        asyncErrorHandler(commentServices.softDelete)
    )
router.patch('/like-unlike/:commentId' ,
        asyncErrorHandler(auth),
        asyncErrorHandler(commentServices.like_unlike)
    )
    router.post('/add-replay/:commentId' , 
        asyncErrorHandler(auth),
        uploadFile(fileType.image).single('image'),
        asyncErrorHandler(commentServices.addReplay)
    
    )
    router.get('/get-replays/:commentId' , 
        asyncErrorHandler(auth),
        asyncErrorHandler(commentServices.getReplay)
    )
    router.get('/get-replays/' , 
        asyncErrorHandler(auth),
        asyncErrorHandler(commentServices.getReplay)
    )
    router.delete('/hard-delete/:commentId' ,
        asyncErrorHandler(auth),
        asyncErrorHandler(commentServices.hardDelete)
    )

export default router;

