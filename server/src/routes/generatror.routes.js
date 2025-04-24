import express from "express"

import { generateImage } from "../controllers/generateImage.controller.js";
import upload from "../middleware/multer.js";


const router = express.Router();


router.post('/',upload.single("image"),generateImage)


export default router;