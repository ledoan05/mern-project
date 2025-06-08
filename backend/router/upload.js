import express from "express";
import multer from "multer";
import { uploadImage, storage } from "../controller/upload.js";

const router = express.Router();
const upload = multer({ storage }); 

router.post("/", upload.single("image"), uploadImage);

export default router; 
