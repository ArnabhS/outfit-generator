import express from "express"
import multer from "multer"
import { generateImage } from "../controllers/generateImage.controller.js";

const router = express.Router();

const upload = multer({ dest: "/uploads" });

router.post('/',upload.single("image"),generateImage)


export default router;