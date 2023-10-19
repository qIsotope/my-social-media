import express from "express";
import { getUsersBySearchQuery, getUser } from "../controllers/users.js";
import { checkAuth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/:id', checkAuth, getUser);
userRouter.get('/search/:query?', checkAuth, getUsersBySearchQuery);

export default userRouter;