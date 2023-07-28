import mongoose from "mongoose";
import Comment from './Comment.js';

const PostSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		min: 2,
		max: 50,
	},
	lastName: {
		type: String,
		required: true,
		min: 2,
		max: 50,
	},
	picturePath: {
		type: String,
		default: "",
	},
	userPicturePath: {
		type: String,
		default: "",
	},
	userId: String,
	likes: {
		type: Array,
		default: [],
	},
	comments: [Comment.schema],
	isDeleted: {
		type: Boolean,
		default: false,
	},
	location: String,
	description: String,
},
	{ timestamps: true })

export default mongoose.model('Post', PostSchema);