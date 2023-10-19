import express from "express";
import { login, authMe } from "../controllers/auth.js";
import { checkAuth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.get('/me', checkAuth, authMe);
authRouter.post('/login', login);

export default authRouter;