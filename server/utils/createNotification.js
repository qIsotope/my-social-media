import Notification from '../models/Notification.js'
import { activeUsers, io } from '../index.js'

export const sendNotification = async ({ user, fromUser, post, comment, type, toId }) => {
	const notification = new Notification({
		user: {
			id: user.id,
			name: user.firstName + ' ' + post.lastName,
			picturePath: user.picturePath,
		},
		fromUser: {
			id: fromUser.id,
			name: fromUser.name || fromUser.firstName + ' ' + fromUser.lastName,
			picturePath: fromUser.picturePath,
		},
		comment: {
			id: comment?._id,
			text: comment?.text,
			repliedToId: comment?.repliedToId,
		},
		post: {
			id: post?._id,
			picturePath: post?.picturePath,
		},
		type: type
	})
	const savedNotification = await notification.save()
	io.to(activeUsers[toId]).emit('notification', savedNotification)
}