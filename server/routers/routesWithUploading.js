import express from "express";
import { uploadImage } from "../controllers/upload.js";
import { register } from "../controllers/auth.js";
import { checkAuth } from "../middlewares/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const uploadRouter = express.Router();

uploadRouter.post('/auth/register', upload.single('picture'), register);
uploadRouter.post('/upload/image', checkAuth, upload.single("image"), uploadImage);

export default uploadRouter;