import mongoose from "mongoose";

const DialogSchema = mongoose.Schema({
	participants: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	],
	lastMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Message',
	},
	unReadMessagesCount: {
		type: Number,
		default: 0,
	},
},
	{ timestamps: true })

export default mongoose.model('Dialog', DialogSchema);