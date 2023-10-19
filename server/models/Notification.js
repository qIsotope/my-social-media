import mongoose from "mongoose";
import User from "./User.js";

const NotificationSchema = mongoose.Schema({
	user: {
		id: mongoose.Schema.Types.ObjectId,
		name: String,
		picturePath: String,
	},
	fromUser: {
		id: mongoose.Schema.Types.ObjectId,
		name: String,
		picturePath: String,
	},
	comment: {
		id: mongoose.Schema.Types.ObjectId,
		text: String,
		repliedToId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
		},
	},
	post: {
		id: mongoose.Schema.Types.ObjectId,
		picturePath: String,
	},
	unRead: {
		type: Boolean,
		default: true,
	},
	type: String,
},
	{ timestamps: true })

export default mongoose.model('Notification', NotificationSchema);