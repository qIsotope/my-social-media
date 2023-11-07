import mongoose from "mongoose";
import User from "./User.js";

const DialogSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
	},
	participants: [],
},
	{ timestamps: true })

export default mongoose.model('Dialog', DialogSchema);