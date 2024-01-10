import moment from 'moment'
import { api } from './api'
import { current } from '@reduxjs/toolkit'
import { socket } from 'socket';

export const messagingApi = api.injectEndpoints({
	endpoints: (build) => ({
		sendMessage: build.mutation({
			query: (body) => ({
				url: '/messaging/send',
				method: 'POST',
				body,
			}),
			// async onQueryStarted({ limit }, { dispatch, queryFulfilled, getState}) {
			// 	try {
			// 		const { data: sendedMessage } = await queryFulfilled
			// 		dispatch(
			// 			messagingApi.util.updateQueryData('getMessages', { id: sendedMessage.dialogId, limit }, (draft) => {
			// 				const date = moment(sendedMessage.createdAt).format('YYYYMMDD')
			// 				if (!draft.messages[date]) {
			// 					draft.messages[date] = [sendedMessage]
			// 				} else {
			// 					draft.messages[date].push(sendedMessage);
			// 				}
			// 			})
			// 		);
			// 		dispatch(
			// 			messagingApi.util.updateQueryData('getDialogs', getState().auth.user._id, (draft) => {
			// 				console.log('tetetetetetet')
			// 				const neededDialog = draft.dialogs.find(dialog => dialog._id === sendedMessage.dialogId);
			// 				neededDialog.lastMessage = sendedMessage
			// 				// neededDialog.updatedAt = sendedMessage.createdAt
			// 			}));
			// 	}
			// 	catch (e) {
			// 		console.log(e);
			// 	}
			// },
		}),
		getDialogs: build.query({
			query: (id) => 'messaging/dialogs/' + id,
			async onCacheEntryAdded(
				_,
				{ cacheEntryRemoved, updateCachedData, cacheDataLoaded, getState }
			) {
				try {
					await cacheDataLoaded
					socket.on('readMessages', (messagesIds) => {
						messagesIds.forEach(messageId => {
							updateCachedData((draft) => {
								const message = draft.dialogs.find(dialog => dialog.lastMessage._id === messageId)
								if (message) {
									message.lastMessage.unRead = false
								}
							})
						})
					})
					socket.on('getMessage', (message) => {
						updateCachedData((draft) => {
							const neededDialog = draft.dialogs.find(dialog => dialog._id === message.dialogId);
							const neededDialogIndex = draft.dialogs.findIndex(dialog => dialog._id === message.dialogId);
							if (message.fromUserId._id !== getState().auth.user._id) {
								draft.unReadMessages[neededDialogIndex] = draft.unReadMessages[neededDialogIndex] + 1;
							}
							neededDialog.lastMessage = message
						})
					});
				} catch (error) {
					await cacheEntryRemoved
				}
			}
		}),
		getMessages: build.query({
			query: ({ id, limit }) => 'messaging/dialogs/' + id + '/' + limit,
			transformResponse: (response) => {
				response.messages = response.messages.reduce((acc, mssg) => {
					const date = moment(mssg.createdAt).format('YYYYMMDD')
					if (!acc[date]) {
						acc[date] = [mssg]
					} else {
						acc[date].push(mssg)
					}
					return acc
				}, {})
				return response
			},
			async onCacheEntryAdded(
				_,
				{ cacheEntryRemoved, updateCachedData, cacheDataLoaded, getState }
			) {
				try {
					await cacheDataLoaded
					const userId = getState().auth.user._id;
					updateCachedData((draft) => {
						draft.hasUnreadMessages = Object.values(draft.messages).flat().some(message => message.unRead && message.toUserId === userId)
					})
					socket.on('getMessage', (message) => {
						updateCachedData((draft) => {
							const date = moment(message.createdAt).format('YYYYMMDD')
							if (!draft.messages[date]) {
								draft.messages[date] = [message]
							}
							draft.messages[date].push(message)
						})
					});
					socket.on('readMessages', (messagesIds) => {
						messagesIds.forEach(messageId => {
							updateCachedData((draft) => {
								const message = Object.values(draft.messages).flat().find(message => message._id === messageId)
								if (message) {
									message.unRead = false
								}
							})
						})
					})
				} catch (error) {
					await cacheEntryRemoved
				}
			}
		}),
		markMessageAsRead: build.query({
			query: ({ dialogId, id, limit }) => '/messaging/markMessage/' + dialogId + '/' + id,
			async onQueryStarted({ dialogId, limit }, { dispatch, queryFulfilled, getState }) {
				try {
					const { data: messagesIds } = await queryFulfilled
					dispatch(
						messagingApi.util.updateQueryData('getDialogs', getState().auth.user._id, (draft) => {
							const neededDialog = draft.dialogs.find(dialog => dialog._id === dialogId);
							neededDialog.lastMessage.unRead = false
						}));
					dispatch(
						messagingApi.util.updateQueryData('getMessages', { id: dialogId, limit }, (draft) => {
							messagesIds.forEach(messageId => {
								const message = Object.values(draft.messages).flat().find(message => message._id === messageId)
								message.unRead = false
							})
						})
					);
				}
				catch (e) {
					console.log(e);
				}
			},
		}),
		deleteRestoreMessages: build.mutation({
			query: (body) => ({
				url: '/messaging/delete/',
				method: 'DELETE',
				body,
			}),
			async onQueryStarted({ limit }, { dispatch, queryFulfilled, }) {
				try {
					const { data: messages } = await queryFulfilled
					dispatch(
						messagingApi.util.updateQueryData('getMessages', { id: messages[0].dialogId, limit }, (draft) => {
							const allMessages = Object.values(draft.messages).flat();
							messages.forEach(message => {
								const neededMessage = allMessages.find(mssg => mssg._id === message._id)
								neededMessage.isDeletedFor = message.isDeletedFor
								console.log('neededMessage', neededMessage);
							})
						})
					);
				}
				catch (e) {
					console.log(e);
				}
			}
		})
	}),
})

export const {
	useSendMessageMutation,
	useLazyGetDialogsQuery,
	useLazyGetMessagesQuery,
	useLazyMarkMessageAsReadQuery,
	useDeleteRestoreMessagesMutation,
} = messagingApi;


