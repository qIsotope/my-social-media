import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from 'bcrypt';
import { v4 } from 'uuid'
import Post from "../models/Post.js";
import { storage } from '../firebase.js'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export const authMe = async (req, res) => {
	try {
		const { id } = req.id;
		const user = await User.findById(id).populate(['friends', 'sentFriendRequests', 'receivedFriendRequests']).exec();
		const notificationsCount = await Notification.countDocuments({ ['user.id']: id, unRead: true });
		const userPosts = await Post.find({ userId: id, isDeleted: false });
		const likesCount = userPosts.reduce((acc, post) => acc + post.likes.length, 0)
		if (!user) return res.status(405).json({ msg: 'User not found' });
		return res.status(200).json({ user: { ...user._doc, notificationsCount, impressions: likesCount } });
	}
	catch (err) {
		res.status(500).json({ error: err.message });
	}

}

export const register = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			location,
			occupation,
		} = req.body;
		let picturePath = '';
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);
		if (req.file?.buffer) {
			console.log(req.file);
			const path = `users/${req.file?.originalname}.${v4()}`
			const imageRef = ref(storage, path);
			const uploadTask = await uploadBytesResumable(imageRef, req.file?.buffer, { contentType: req.file.mimetype });
			const downloadURL = await getDownloadURL(uploadTask.ref)
			picturePath = downloadURL;
		}

		const user = new User({
			firstName,
			lastName,
			name: `${firstName} ${lastName}`,
			email,
			password: passwordHash,
			location,
			occupation,
			picturePath,
		})
		const savedUser = await user.save();

		res.status(201).json(user);
	} catch (error) {
		if (error.code === 11000) {
			res.status(405).json({ error: error.message });
		}
		res.status(500).json({ error: error.message });
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email }).populate('friends').exec();
		if (!user) return res.status(406).json({ msg: "User does not exist. " });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(432).json({ msg: "Invalid credentials. " });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		delete user.password;
		return res.status(200).json({ token, user });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};