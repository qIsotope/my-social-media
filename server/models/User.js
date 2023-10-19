import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
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
	name: {
		type: String,
		min: 2,
		max: 50,
	},
	email: {
		type: String,
		// unique: true,
		required: true,
		max: 50,
	},
	password: {
		type: String,
		required: true,
		min: 5,
		max: 20,
	},
	picturePath: {
		type: String,
		default: "",
	},
	friends: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: [],
	}],
	sentFriendRequests:  [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: [],
	}],
	receivedFriendRequests :  [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: [],
	}],
	impressions: {
		type: Number,
		default: 0,
	},
	views: {
		type: Number,
		default: 0,
	},
	location: String,
	occupation: String,
},
	{ timestamps: true })

export default mongoose.model('User', UserSchema);