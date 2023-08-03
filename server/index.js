import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { Server } from 'socket.io'
import { fileURLToPath } from "url";
import { register, login, authMe } from "./controllers/auth.js";
import { getUser, addRemoveFriend, getUsersBySearchQuery } from "./controllers/users.js";
import { addRemoveLike, createPost, getPosts, getUserPosts, softDeletePost } from "./controllers/posts.js";
import { addRemoveLike as addRemoveCommentLike, createComment, softDeleteComment, softDeleteThread, updateComment } from "./controllers/comments.js";
import { checkAuth } from "./middlewares/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import { users, posts, comments } from './data/index.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });



app.get('/auth/me', checkAuth, authMe);
app.post('/auth/register', upload.single('picture'), register);
app.post('/auth/login', login);

app.get('/users/:id', checkAuth, getUser);
app.get('/search/users/:query?', checkAuth, getUsersBySearchQuery);
app.post('/users/:id/:friendId', checkAuth, addRemoveFriend);

app.post('/posts', upload.single("picture"), createPost);
app.get('/posts', checkAuth, getPosts);
app.delete('/posts/:id', checkAuth, softDeletePost);
app.get('/posts/:userId', checkAuth, getUserPosts);
app.patch('/posts/likes/:postId', checkAuth, addRemoveLike);

// comments
app.post('/comments', upload.single("picture"), createComment);
app.patch('/comments/:id', upload.single("picture"), updateComment);
app.patch('/comments/likes/:commentId', checkAuth, addRemoveCommentLike);
app.delete('/comments/:id', checkAuth, softDeleteComment);
app.delete('/threads', checkAuth, softDeleteThread);


const PORT = process.env.PORT || 6001;
// start server
const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

export const io = new Server(server, {
	cors: {
		origin: `http://localhost:3006`,
	},
});

global.onlineUsers = new Map()
const activeUsers = {};
// console.log('onlineUsers', onlineUsers)
io.on('connection', (socket) => {
	global.notificationSocket = socket;
	socket.on('add-user', (userId) => {
		onlineUsers.set(userId, socket.id)
		console.log(onlineUsers);
		activeUsers[userId] = socket.id;
		socket.emit("get-users", activeUsers);
	});

	socket.on("disconnect", (message) => {
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
	})
	.catch((error) => console.log(`${error} did not connect`));
