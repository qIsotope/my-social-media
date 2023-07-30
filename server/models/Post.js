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
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	likes: {
		type: Array,
		default: [],
	},
	comments: {
		postComments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			default: [],
		}],
		commentComments: [{
			postCommentId: mongoose.Schema.Types.ObjectId,
			comment: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		}]
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	location: String,
	description: String,
},
	{ timestamps: true })

export default mongoose.model('Post', PostSchema);