import NodeCache from 'node-cache'
import { io } from '../index.js'
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const cache = new NodeCache({ stdTTL: 100 })
export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { id: accountId } = req.id;
		const updateInfo = cache.get(accountId);
		const user = await User.findById(id).populate('friends').exec()
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

		const savedUser = await user.save()

		res.status(200).json(savedUser);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id);
		const friend = await User.findById(friendId);
		if (user.friends.includes(friendId)) {
			user.friends = user.friends.filter((id) => id.toString() !== friendId);
			friend.friends = friend.friends.filter((friendId) => friendId.toString() !== id);
		} else {
			user.friends.push(friendId);
			friend.friends.push(id);
		}

		const notification = new Notification({
			user: friend,
			fromUser: user,
			type: 'friendRequest',
		})

		const savedNotification = await notification.save()
		console.log(onlineUsers.get(friendId), onlineUsers.get(id))
		io.to(onlineUsers.get(friendId)).emit('notification', savedNotification)
		await user.save();
		await friend.save();

		const { friends } = await User.findById(id).populate('friends').exec()
		const { friends: friendFriends } = await User.findById(friendId).populate('friends').exec()
		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);
		const formattedFriendFriends = friendFriends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);
		res.status(200).json({ friends: formattedFriends, friendFriends: formattedFriendFriends });
	} catch (err) {
		res.status(404).json({ message: err.message });
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