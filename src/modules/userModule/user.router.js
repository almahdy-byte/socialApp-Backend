import { Router } from "express"
import * as userServices from './user.controller.js'
import * as userSchema from './user.validation.js'
import { asyncErrorHandler } from "../../utils/errorHandler/asyncErrorHandler.js";
import {auth} from '../../middleWare/auth.middleWare.js'
import { fileType, uploadFile } from "../../utils/multer/uploadFile.js";
const router = Router();

router.get('/' , auth() , asyncErrorHandler(userServices.getProfile))
router.post('/share-profile/:profileId' , auth() ,asyncErrorHandler(userServices.shareProfile ))
router.post('/profile-picture' , auth() ,uploadFile(fileType.image).single("image"),asyncErrorHandler(userServices.setProfilePicture ))
router.delete('/delete-profile-picture' ,auth() ,asyncErrorHandler(userServices.deleteProfilePicture ));
router.post('/add-friend-request/:friendId' ,auth() ,asyncErrorHandler(userServices.getFriedRequests ));
router.post('/accept-friend-request/:friendId' ,auth() ,asyncErrorHandler(userServices.acceptFriendRequest ));
router.get('/get-friends' ,auth() ,asyncErrorHandler(userServices.getFriends ));
export default router;