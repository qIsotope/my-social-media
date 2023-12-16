import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import helmet from "helmet";
import morgan from "morgan";
import { Server } from 'socket.io'
import { authRouter, commentsRouter, friendsRouter, notificationsRouter, postsRouter, uploadRouter, userRouter, messagingRouter } from './routers/index.js'

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

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/friends', friendsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/notifications', notificationsRouter);
app.use('/messaging', messagingRouter);
app.use('', uploadRouter);

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
	.catch((error) => console.log(`${error} did not connect`));
