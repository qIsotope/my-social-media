import NodeCache from 'node-cache'
import { activeUsers, io } from '../index.js'
import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { sendNotification } from '../utils/createNotification.js';

const cache = new NodeCache({ stdTTL: 100 })
export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { id: accountId } = req.id;
		const updateInfo = cache.get(accountId);
		const user = await User.findById(id).populate(['friends', 'sentFriendRequests', 'receivedFriendRequests']).exec()
		if (!user) {
			return res.status(405).json({ message: "Пользователь не найден" });
		}
		if (accountId !== id && (!updateInfo || Date.now() - updateInfo?.[id] >= 600000)) {
			user.views += 1;
		}
		if (updateInfo) {
			cache.set(accountId, { ...updateInfo, [id]: Date.now() });
		} else {
			cache.set(accountId, { [id]: Date.now() })
		}

		let impressions = 0;

		if (accountId !== id) {
			const userPosts = await Post.find({ userId: id, isDeleted: false });
			impressions = userPosts.reduce((acc, post) => acc + post.likes.length, 0)
		}

		const savedUser = await user.save()

		res.status(200).json({ ...savedUser._doc, impressions });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const sendFriendRequest = async (req, res) => {
	try {
		const { id, friendId } = req.body;
		const user = await User.findById(id).populate('sentFriendRequests').exec();
		const friend = await User.findById(friendId).populate('receivedFriendRequests').exec();
		const isExistingNotification = await Notification.find({ ['user.id']: id, ['fromUser.id']: friendId, type: 'sendFriendRequest' });
		user.sentFriendRequests.push(friend)
		friend.receivedFriendRequests.push(user);
		const savedUser = await user.save()
		const savedFriend = await friend.save()
		if (!isExistingNotification.length) {
			sendNotification({
				user: {
					id: friendId,
					name: friend.name,
					picturePath: friend.picturePath,
				},
				fromUser: {
					id,
					name: user.firstName,
					picturePath: user.picturePath,
				},
				toId: friendId,
				type: 'sendFriendRequest'
			})
		}

		res.status(200).json({ sentFriendRequests: savedUser.sentFriendRequests, receivedFriendRequests: savedFriend.receivedFriendRequests });
	} catch (error) {
		console.log(error)
		res.status(403).json(error)
	}
}

export const acceptFriendRequest = async (req, res) => {
	try {
		const { id, friendId } = req.body;
		const user = await User.findById(id).populate(['friends', 'receivedFriendRequests']).exec();
		const friend = await User.findById(friendId).populate('friends').exec();
		const isExistingNotification = await Notification.find({ ['user.id']: friendId, ['fromUser.id']: id, type: 'acceptFriendRequest' });
		user.receivedFriendRequests = user.receivedFriendRequests.filter(friend => friend._id.toString() !== friendId)
		friend.sentFriendRequests = friend.sentFriendRequests.filter(friend => friend._id.toString() !== id)
		user.friends.push(friend)
		friend.friends.push(user);
		const savedUser = await user.save()
		const savedFriend = await friend.save()
		if (!isExistingNotification.length) {
			sendNotification({
				user: {
					id: friendId,
					name: friend.name,
					picturePath: friend.picturePath,
				},
				fromUser: {
					id,
					name: user.firstName,
					picturePath: user.picturePath,
				},
				toId: friendId,
				type: 'acceptFriendRequest'
			})
		}

		res.status(200).json({ friends: savedUser.friends, receivedFriendRequests: savedUser.receivedFriendRequests, friendFriends: savedFriend.friends });
	} catch (error) {
		console.log(error);
		res.status(403).json(error)
	}
}

export const deleteFriend = async (req, res) => {
	try {
		const { id, friendId } = req.body;
		const user = await User.findById(id).populate(['receivedFriendRequests', 'friends']).exec();
		const friend = await User.findById(friendId).populate('friends').exec();
		user.friends = user.friends.filter(friend => friend._id.toString() !== friendId)
		friend.friends = friend.friends.filter(friend => friend._id.toString() !== id)
		user.receivedFriendRequests.push(friend)
		friend.sentFriendRequests.push(user._id);
		const savedUser = await user.save()
		const savedFriend = await friend.save()
		res.status(200).json({ friends: savedUser.friends, receivedFriendRequests: savedUser.receivedFriendRequests, friendFriends: savedFriend.friends });
	} catch (error) {
		res.status(403).json(error)
	}
}

export const cancelSendedFriendRequest = async (req, res) => {
	try {
		const { id, friendId } = req.body;
		const user = await User.findById(id).populate('sentFriendRequests').exec();
		const friend = await User.findById(friendId).populate('receivedFriendRequests').exec();
		user.sentFriendRequests = user.sentFriendRequests.filter(friend => friend._id.toString() !== friendId)
		friend.receivedFriendRequests = friend.receivedFriendRequests.filter(friend => friend._id.toString() !== id)
		const savedUser = await user.save()
		const savedFriend = await friend.save()
		res.status(200).json({ sentFriendRequests: savedUser.sentFriendRequests, receivedFriendRequests: savedFriend.receivedFriendRequests });
	} catch (error) {
		res.status(403).json(error)
	}
}


export const getUsersBySearchQuery = async (req, res) => {
	try {
		const { query } = req.params;
		const regexp = new RegExp(query || '', 'i');
		const users = await User.find({ $or: [{ name: { $regex: regexp } }, { lastName: { $regex: regexp } }] }).limit(4)
		res.status(200).json(users);
	} catch (error) {
		console.log(error)
		res.status(405).json({ message: error.message });
	}
}