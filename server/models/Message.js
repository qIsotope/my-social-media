import mongoose from "mongoose";
import Dialog from "./Dialog.js";
import User from "./User.js";

const MessageSchema = mongoose.Schema({
	dialogId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Dialog,
	},
	fromUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
	},
	toUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
	},
	unRead: {
		type: Boolean,
		default: true,
	},
	text: String,
	filePath: String,
},
	{ timestamps: true })

export default mongoose.model('Message', MessageSchema);