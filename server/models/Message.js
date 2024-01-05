import mongoose from "mongoose";
import Dialog from "./Dialog.js";
import User from "./User.js";

const MessageSchema = mongoose.Schema({
	dialogId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Dialog,
		required: true,
	},
	fromUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
	},
	toUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
	},
	unRead: {
		type: Boolean,
		default: true,
	},
	forwardedMessages: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
		default: [],
	},
	isDeletedFor: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: User,
			},
		],
		default: [],
	},
	text: String,
	attachments: {
		type: Array,
		default: [],
	},
},
	{ timestamps: true })

export default mongoose.model('Message', MessageSchema);