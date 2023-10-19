import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from 'socket.io'
import { fileURLToPath } from "url";
import { register, login, authMe } from "./controllers/auth.js";
import { getUser, sendFriendRequest, cancelSendedFriendRequest, acceptFriendRequest, deleteFriend, getUsersBySearchQuery } from "./controllers/users.js";
import { addRemoveLike, createPost, getPost, getPosts, getUserPosts, softDeletePost } from "./controllers/posts.js";
import { addRemoveLike as addRemoveCommentLike, createComment, softDeleteComment, softDeleteThread, updateComment } from "./controllers/comments.js";
import { uploadImage } from "./controllers/upload.js";
import {getNotifications} from "./controllers/notifications.js"
import { checkAuth } from "./middlewares/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import Notification from "./models/Notification.js";
import { users, posts, comments } from './data/index.js';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

//auth
app.get('/auth/me', checkAuth, authMe);
app.post('/auth/register', upload.single("picture"), register);
app.post('/auth/login', login);

//users
app.get('/users/:id', checkAuth, getUser);
app.get('/search/users/:query?', checkAuth, getUsersBySearchQuery);

// friends
app.patch('/friends/sendFriendRequest', checkAuth, sendFriendRequest);
app.patch('/friends/acceptFriendRequest', checkAuth, acceptFriendRequest);
app.patch('/friends/cancelSendedFriendRequest', checkAuth, cancelSendedFriendRequest);
app.patch('/friends/deleteFriend', checkAuth, deleteFriend);

// posts
app.post('/posts', createPost);
app.get('/posts', checkAuth, getPosts);
app.get('/post/:id', checkAuth, getPost);
app.delete('/posts/:id', checkAuth, softDeletePost);
app.get('/posts/:userId', checkAuth, getUserPosts);
app.patch('/posts/likes/:postId', checkAuth, addRemoveLike);

// comments
app.post('/comments', createComment);
app.patch('/comments/:id', updateComment);
app.patch('/comments/likes/:commentId', checkAuth, addRemoveCommentLike);
app.delete('/comments/:id', checkAuth, softDeleteComment);
app.delete('/threads', checkAuth, softDeleteThread);

// notifications
app.get('/notifications/:id', checkAuth, getNotifications);

// upload
app.post('/upload/image', checkAuth, upload.single("image"), uploadImage);



const PORT = process.env.PORT || 6001;
// start server
const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

export const io = new Server(server, {
	cors: {
		origin: `http://localhost:3006`,
	},
});

export const activeUsers = {};
io.on('connection', (socket) => {
	socket.on('add-user', (userId) => {
		activeUsers[userId] = socket.id
		io.emit("get-users", Object.keys(activeUsers));
	});

	socket.on("disconnect", () => {
		const userId = Object.keys(activeUsers).find((userId) => activeUsers[userId] === socket.id)
		if (userId) {
			delete activeUsers[userId];
			io.emit('get-users', Object.keys(activeUsers));
		}
	});

})
/* MONGOOSE SETUP */
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		// User.insertMany(users);
		// Post.insertMany(posts);
		// Comment.insertMany(comments);
		// Notification.insertMany(notifications);
	})
	.catch((error) => console.log(`${error} did not kconnect`));
