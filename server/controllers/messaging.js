import Message from '../models/Message.js';
import Dialog from '../models/Dialog.js';
import User from '../models/User.js';
import { activeUsers, io } from '../index.js'
import { sendNotification } from '../utils/createNotification.js';

export const getMessages = async (req, res) => {
	try {
		const { id, limit = 40 } = req.params;
		const { id: userId } = req.id;
		const dialog = await Dialog.findById(id).populate('participants', ['_id', 'picturePath', 'name']).exec();
		const [participant] = dialog.participants.filter(participant => participant._id.toString() !== userId);
		const messages = await Message.find({ dialogId: id, unRead: false, isDeletedFor: { $nin: [userId] } }).sort({ createdAt: -1 }).limit(limit).populate([
			{
				path: 'fromUserId',
				select: ['_id', 'picturePath', 'firstName'],
			},
			{
				path: 'forwardedMessages',
				populate: {
					path: 'fromUserId',
					select: ['_id', 'picturePath', 'firstName'],
				},
			},
		]).exec();
		const messagesCount = await Message.find({ dialogId: id }).countDocuments();
		const unreadedMessages = await Message.find({ dialogId: id, unRead: true, isDeletedFor: { $nin: [userId] } }).populate([
			{
				path: 'fromUserId',
				select: ['_id', 'picturePath', 'firstName'],
			},
			{
				path: 'forwardedMessages',
				populate: {
					path: 'fromUserId',
					select: ['_id', 'picturePath', 'firstName'],
				},
			},
		]).exec();
		messages.reverse();
		res.status(200).json({ messages: [...messages, ...unreadedMessages], participant, messagesCount });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const getDialogs = async (req, res) => {
	try {
		const { id } = req.params;
		const dialogs = await Dialog.find({ participants: { $in: [id] } })
			.populate(['lastMessage', 'participants'])
			.lean()
			.exec();
		dialogs.sort((a, b) => (a.lastMessage?.createdAt < b.lastMessage?.createdAt ? 1 : -1));
		const promises = [];
		const updatedDialogs = await Promise.all(
			dialogs.map(async (dialog) => {
				const lastMessage = await Message.findOne({
					dialogId: dialog._id,
					isDeletedFor: { $nin: [id] },
				})
					.sort({ createdAt: -1 })
					.populate('fromUserId', ['_id', 'picturePath', 'name'])
					.lean()
					.exec();
				dialog.lastMessage = lastMessage;
				await Dialog.updateOne({ _id: dialog._id }, dialog);
				return dialog;
			})
		);
		dialogs.forEach(dialog => {
			promises.push(Message.find({ dialogId: dialog._id, unRead: true, toUserId: id }).countDocuments());
		});

		const unReadCount = await Promise.all(promises);

		res.status(200).json({ dialogs: updatedDialogs, unReadMessages: unReadCount });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { toUserId, fromUserId, text, filePath, dialogId, forwardedMessages = [], attachments } = req.body;
		const fromUser = await User.findById(fromUserId);
		const message = new Message({
			attachments,
			fromUserId,
			toUserId,
			text,
			filePath,
			dialogId,
			forwardedMessages: forwardedMessages.map(messages => messages.id),
		});

		const savedMessage = await message.save();
		const { _id, picturePath, firstName } = fromUser;
		const updatedMessage = {
			_id: savedMessage._id,
			fromUserId: {
				_id,
				picturePath,
				firstName,
			},
			attachments: savedMessage.attachments,
			toUserId: savedMessage.toUserId,
			text: savedMessage.text,
			filePath: savedMessage.filePath,
			createdAt: savedMessage.createdAt,
			dialogId: savedMessage.dialogId,
			unRead: savedMessage.unRead,
			forwardedMessages,
			isDeletedFor: savedMessage.isDeletedFor,
		};

		sendNotification({
			user: {
				id: toUserId,
			},
			fromUser: {
				id: fromUserId,
				name: firstName,
				picturePath: fromUser.picturePath,
			},
			type: 'message',
			message: {
				dialogId,
				id: savedMessage._id,
				text: savedMessage.text,
			},
			toId: toUserId,
		});

		activeUsers[toUserId]?.forEach(socketId => {
			io.to(socketId).emit('getMessage', updatedMessage);
		});
		activeUsers[fromUserId]?.forEach(socketId => {
			io.to(socketId).emit('getMessage', updatedMessage);
		});

		res.status(200).json(updatedMessage);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const markMessageAsRead = async (req, res) => {
	try {
		const { id: userId } = req.id;
		const { id, dialogId } = req.params;
		const unReadedMessages = await Message.find({ dialogId: dialogId, unRead: true, toUserId: userId });
		const unReadedMessagesIds = unReadedMessages.map(message => message._id);
		const lastViewedMessageIndex = unReadedMessagesIds.findIndex(messageId => messageId.toString() === id);
		const viewedMessages = unReadedMessagesIds.slice(0, lastViewedMessageIndex + 1);
		await Message.updateMany({
			_id: { $in: viewedMessages },
			dialogId: dialogId,
			unRead: true,
			toUserId: userId,
		}, {
			$set: { unRead: false },
		})
		const fromUserId = unReadedMessages[0].fromUserId;
		activeUsers[fromUserId]?.forEach(socketId => {
			io.to(socketId).emit('readMessages', viewedMessages);
		});
		res.status(200).json(viewedMessages);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const deleteRestoreMessages = async (req, res) => {
	try {
		const { messageIds } = req.body;
		const { id: userId } = req.id;
		const messages = await Message.find({ _id: { $in: messageIds } });
		messages.forEach(async message => {
			if (message.isDeletedFor.includes(userId)) {
				message.isDeletedFor = message.isDeletedFor.filter(id => id.toString() !== userId);
			} else {
				message.isDeletedFor.push(userId);
			}
			await message.save();
		});

		res.status(200).json(messages);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}

}