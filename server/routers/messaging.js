import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { getMessages, getDialogs, sendMessage, markMessageAsRead, deleteRestoreMessages } from '../controllers/messaging.js';

const messagingRouter = express.Router();

messagingRouter.get('/dialogs/:id', checkAuth, getDialogs);
messagingRouter.get('/dialogs/:id/:limit', checkAuth, getMessages);
messagingRouter.post('/send', checkAuth, sendMessage);
messagingRouter.delete('/delete', checkAuth, deleteRestoreMessages);
messagingRouter.get('/markMessage/:dialogId/:id', checkAuth, markMessageAsRead);

export default messagingRouter;