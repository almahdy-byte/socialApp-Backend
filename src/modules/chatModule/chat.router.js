import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import * as chatServices from './chat.controller.js'

const router = Router();


router.get("/:userId" , auth() , chatServices.getChat);


export default router;