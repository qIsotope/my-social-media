import mongoose from "mongoose";
import Dialog from "./Dialog.js";
import User from "./User.js";

const MessageSchema = mongoose.Schema({
	dialogId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Dialog,
	},
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
	},
	text: String,
	filePath: String,
},
	{ timestamps: true })

export default mongoose.model('Message', MessageSchema);