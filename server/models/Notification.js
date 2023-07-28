import mongoose from "mongoose";
import User from "./User.js";
import Post from "./Post.js";

const NotificationSchema = mongoose.Schema({
	user: User.schema,
	fromUser: User.schema,
	postId: Post.schema,
	unRead: {
		type: Boolean,
		default: true,
	},
	type: String,
},
	{ timestamps: true })

export default mongoose.model('Notification', NotificationSchema);