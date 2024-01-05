import Notification from '../models/Notification.js'
import { activeUsers, io } from '../index.js'

export const sendNotification = async ({ user, fromUser, post, comment, type, toId, message }) => {
	const notification = {
		user: {
			id: user.id,
			name: user.name,
			picturePath: user.picturePath,
		},
		fromUser: {
			id: fromUser.id,
			name: fromUser.name,
			picturePath: fromUser.picturePath,
		},
		comment: {
			id: comment?._id,
			text: comment?.text,
			repliedToId: comment?.repliedToId,
		},
		post: {
			id: post?.id,
			picturePath: post?.picturePath,
		},
		message: {
			id: message?.id,
			dialogId: message?.dialogId,
			text: message?.text,
		},
		type: type
	}
	let savedNotification = notification
	if (type !== 'message') {
		const storedNotification = new Notification(notification)
		savedNotification = await storedNotification.save()
	}
	io.to(activeUsers[toId]?.[0]).emit('notification', savedNotification)
}