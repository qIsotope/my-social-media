import { updateNotificationsCount } from 'state/slices/auth';
import { api } from './api'
import { socket } from 'socket';
import { Howl, Howler } from 'howler';
import notificationSound from 'sounds/notification.mp3'
import messageSound from 'sounds/message.mp3'
Howler.autoUnlock = false;



const getformattedNotification = (notification) => {
	if (!notification) return {}
	const baseFormattedNotification = {
		id: notification._id,
		linkUserId: notification.fromUser.id,
		name: notification.fromUser.name,
		userImagePath: notification.fromUser.picturePath,
		time: notification.createdAt,
		unRead: notification.unRead,
		type: notification.type
	}
	switch (notification.type) {
		case 'sendFriendRequest':
			return {
				...baseFormattedNotification,
				title: 'New Friend Request!',
				text: 'has sent a friend request',
			}

		case 'acceptFriendRequest':
			return {
				...baseFormattedNotification,
				title: 'New Friend!',
				text: 'accept your request',
			}
		case 'postLike':
			return {
				...baseFormattedNotification,
				title: 'New Like!',
				text: 'just liked your post',
				postLink: notification.post.id,
				postImagePath: notification.post.picturePath,
			}
		case 'addComment':
			return {
				...baseFormattedNotification,
				title: 'New Comment!',
				text: 'just commented your post',
				postLink: notification.post.id,
				postImagePath: notification.post.picturePath,
				content: notification.comment.text
			}
		case 'reply':
			return {
				...baseFormattedNotification,
				title: 'New Comment Reply!',
				text: 'replied to your comment',
				postLink: notification.post.id,
				postImagePath: notification.post.picturePath,
				content: notification.comment.text,
				repliedToId: notification.comment.repliedToId
			}
		case 'message':
			return {
				...baseFormattedNotification,
				title: 'New Message!',
				text: 'sent you a message',
				postLink: notification.message.dialogId,
				content: notification.message.text
			}
		default:
			return notification;
	}
}

function isTimeWithinOneHour(time1, time2) {
	const diffInMilliseconds = Math.abs(time1 - time2);
	const oneHourInMilliseconds = 60 * 60 * 1000;

	return diffInMilliseconds <= oneHourInMilliseconds;
}

const notificationApi = api.injectEndpoints({
	endpoints: (build) => ({
		getNotifications: build.query({
			query: (id) => 'notifications/' + id,
			transformResponse: (response) => {
				const groupedNotifications = {
					unReaded: {},
					readed: {},
				};

				response.notifications.forEach((notification) => {
					const { type, fromUser, createdAt, unRead } = notification;
					const formattedNotification = getformattedNotification(notification);
					const key = `${type}_${fromUser.id}_${createdAt}`;
					const target = unRead ? 'unReaded' : 'readed'
					let targetGroupKey = null;

					for (const groupKey in groupedNotifications[target]) {
						const group = groupedNotifications[target][groupKey];
						const firstNotificationInGroup = group[0];
						if (
							firstNotificationInGroup &&
							firstNotificationInGroup.type !== 'addComent' &&
							firstNotificationInGroup.type === type &&
							firstNotificationInGroup.linkUserId === fromUser.id &&
							isTimeWithinOneHour(new Date(createdAt), new Date(firstNotificationInGroup.time))
						) {
							targetGroupKey = groupKey;
							break;
						}
					}

					if (targetGroupKey === null) {
						targetGroupKey = key;
						groupedNotifications[target][targetGroupKey] = [formattedNotification];
					} else {
						groupedNotifications[target][targetGroupKey].push(formattedNotification);
					}
				});
				return groupedNotifications;
			}
		}),
		notificationReader: build.query({
			queryFn() {
				return { data: { notifications: [] } };
			},
			async onCacheEntryAdded(
				_,
				{ cacheEntryRemoved, updateCachedData, cacheDataLoaded, dispatch, }
			) {
				try {
					await cacheDataLoaded

					socket.on('notification', (body) => {
						if (body.type === 'message') {
							const audio = new Howl({
								src: [messageSound],
								autoplay: true,
								volume: 1.0,
								onplayerror: function () {
									audio.once('unlock', function () {
										audio.play();
									});
								},
							})
						} else {
							const audio = new Howl({
								src: [notificationSound],
								autoplay: true,
								volume: 1.0,
								onplayerror: function () {
									audio.once('unlock', function () {
										audio.play();
									});
								},
							})
							dispatch(updateNotificationsCount())
						}
						updateCachedData((draft) => {
							draft.notifications.push(getformattedNotification(body))
						})
					});
				} catch (error) {
					await cacheEntryRemoved
				}
			}
		})
	}),
})

export const {
	useLazyGetNotificationsQuery,
	useNotificationReaderQuery
} = notificationApi;