import {Router} from "express";
import { registerUser } from "../controllers/user.controls.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            MaxCount: 1
        },
        {
            name : "coverImage",
            MaxCount : 1
        }
    ]),
    registerUser);

export default router;