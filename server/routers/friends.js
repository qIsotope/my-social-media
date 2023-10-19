import express from "express";
import {acceptFriendRequest, cancelSendedFriendRequest, deleteFriend, sendFriendRequest } from "../controllers/users.js";
import { checkAuth } from "../middlewares/auth.js";

const friendsRouter = express.Router();

friendsRouter.patch('/sendFriendRequest', checkAuth, sendFriendRequest);
friendsRouter.patch('/acceptFriendRequest', checkAuth, acceptFriendRequest);
friendsRouter.patch('/cancelSendedFriendRequest', checkAuth, cancelSendedFriendRequest);
friendsRouter.patch('/deleteFriend', checkAuth, deleteFriend);

export default friendsRouter;