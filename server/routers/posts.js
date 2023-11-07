import express from "express";
import { addRemoveLike, createPost, getPost, getPosts, getUserPosts, softDeletePost } from "../controllers/posts.js";
import { checkAuth } from "../middlewares/auth.js";

const postsRouter = express.Router();

postsRouter.post('', checkAuth, createPost);
postsRouter.get('', checkAuth, getPosts);
postsRouter.get('/preview/:id', checkAuth, getPost);
postsRouter.delete('/:id', checkAuth, softDeletePost);
postsRouter.get('/:userId', getUserPosts);
postsRouter.patch('/likes/:postId', checkAuth, addRemoveLike);

export default postsRouter;