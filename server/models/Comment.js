import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
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
	comments: {
		type: Array,
		default: [],
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},
	parentCommentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	text: {
		type: String,
		required: true,
	},
	picturePath: {
		type: String,
		default: "",
	},
	userPicturePath: {
		type: String,
		default: "",
	},
	likes: {
		type: Array,
		default: [],
	},
	repliedToName: String,
	repliedToId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
},
	{ timestamps: true })

export default mongoose.model('Comment', CommentSchema);