import express from "express";
import { addRemoveLike, createComment, softDeleteComment, softDeleteThread, updateComment } from "../controllers/comments.js";
import { checkAuth } from "../middlewares/auth.js";

const commentsRouter = express.Router();

commentsRouter.post('', createComment);
commentsRouter.patch('/:id', updateComment);
commentsRouter.patch('/likes/:commentId', checkAuth, addRemoveLike);
commentsRouter.delete('/:id', checkAuth, softDeleteComment);
commentsRouter.delete('/threads', checkAuth, softDeleteThread);

export default commentsRouter;