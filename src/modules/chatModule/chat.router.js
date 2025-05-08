import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import * as chatServices from './chat.controller.js'

const router = Router();

router.get("/ai-chat", auth(), chatServices.getChatWithAI);
router.get("/:userId" , auth() , chatServices.getChat);
router.post('/ai' , auth(), chatServices.chatWithAI)
export default router;