import Message from '../models/Message.js';
import Dialog from '../models/Dialog.js';
import User from '../models/User.js';
import { activeUsers, io } from '../index.js'

export const getMessages = async (req, res) => {
	try {
		const { id, limit = 40 } = req.params;
		const { id: userId } = req.id;
		const dialog = await Dialog.findById(id).populate('participants', ['_id', 'picturePath', 'name']).exec();
		const [participant] = dialog.participants.filter(participant => participant._id.toString() !== userId);
		const messages = await Message.find({ dialogId: id, unRead: false }).sort({ createdAt: -1 }).limit(limit).populate('fromUserId', ['_id', 'picturePath', 'firstName']).exec();
		const messagesCount = await Message.find({ dialogId: id }).countDocuments();
		const unreadedMessages = await Message.find({ dialogId: id, unRead: true }).populate('fromUserId', ['_id', 'picturePath', 'firstName']).exec();
		messages.reverse();
		res.status(200).json({ messages: [...messages, ...unreadedMessages], participant, messagesCount });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const getDialogs = async (req, res) => {
	try {
		const { id } = req.id;
		const dialogs = await Dialog.find({ participants: { $in: [id] } }).sort({ 'updatedAt': -1 }).populate(['lastMessage', 'participants']).exec();
		const promises = [];
		dialogs.forEach(dialog => {
			promises.push(Message.find({ dialogId: dialog._id, unRead: true, toUserId: id }).countDocuments());
		});
		const unReadMessages = await Promise.all(promises);
		res.status(200).json({ dialogs, unReadMessages: unReadMessages.flat() });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const sendMessage = async (req, res) => {
	try {
		const { toUserId, fromUserId, text, filePath } = req.body;
		const dialog = await Dialog.find({ participants: { $size: 2, $all: [fromUserId, toUserId] } });
		const fromUser = await User.findById(fromUserId);

		const message = new Message({
			fromUserId,
			toUserId,
			text,
			filePath,
		});

		let dialogId;
		if (dialog.length) {
			dialogId = dialog[0]._id;
			dialog[0].lastMessage = message._id;
			await dialog[0].save();
		} else {
			const newDialog = new Dialog({
				participants: [toUserId, fromUserId],
			});
			newDialog.lastMessage = message._id;
			const savedDialog = await newDialog.save();
			dialogId = savedDialog._id;
		}

		message.dialogId = dialogId;
		const savedMessage = await message.save();
		const { _id, picturePath, firstName } = fromUser;
		const { _id: saved_id, toUserId: savedToUserId, text: savedText, filepath: savedFilePath, createdAt: savedCreatedAt, unRead: savedUnRead } = savedMessage;
		const updatedMessage = {
			_id: saved_id,
			fromUserId: {
				_id,
				picturePath,
				firstName,
			},
			toUserId: savedToUserId,
			text: savedText,
			filePath: savedFilePath,
			createdAt: savedCreatedAt,
			dialogId,
			unRead: savedUnRead,
		};

		io.to(activeUsers[toUserId]).emit('getMessage', updatedMessage);

		res.status(200).json(updatedMessage);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const createDialog = async (req, res) => {
	try {
		const { userId, participants } = req.body;
		const dialog = new Dialog({
			userId,
			participants,
		});
		const savedDialog = await dialog.save();

		res.status(200).json(savedDialog);
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
		io.to(activeUsers[fromUserId]).emit('readMessages', viewedMessages);
		res.status(200).json(viewedMessages);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}