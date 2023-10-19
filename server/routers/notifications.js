import express from "express";
import { getNotifications } from "../controllers/notifications.js";
import { checkAuth } from "../middlewares/auth.js";

const notificationsRouter = express.Router();

notificationsRouter.get('/:id', checkAuth, getNotifications);

export default notificationsRouter;