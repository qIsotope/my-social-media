import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { getMessages, getDialogs, sendMessage, createDialog, markMessageAsRead } from '../controllers/messaging.js';

const messagingRouter = express.Router();

messagingRouter.get('/dialogs', checkAuth, getDialogs);
messagingRouter.get('/dialogs/:id/:limit', checkAuth, getMessages);
messagingRouter.post('/send', checkAuth, sendMessage);
messagingRouter.post('/dialogs/create', checkAuth, createDialog);
messagingRouter.get('/markMessage/:dialogId/:id', checkAuth, markMessageAsRead);

export default messagingRouter;