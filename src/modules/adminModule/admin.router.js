import { Router } from "express";
import * as adminServices from './admin.controller.js'
import { asyncErrorHandler } from "../../utils/errorHandler/asyncErrorHandler.js";
import { auth } from "../../middleWare/auth.middleWare.js";
import { allowTo } from "../../middleWare/allowTo.middleWare.js";
import { Roles } from "../../DB/models/user.model.js";
const router =Router();


router.get('/',(req ,res ,next)=>{
    return res.json({message : 'admin router'})
})

router.get('/users-posts' , 
    auth() , 
    allowTo([Roles.Admin , Roles.User]),
    asyncErrorHandler(adminServices.getUsersPosts)
)
router.patch('/change-role/:id' , 
    auth() , 
    allowTo([Roles.Admin  , Roles.superAdmin]),
    asyncErrorHandler(adminServices.changeRole)
)



export default router;