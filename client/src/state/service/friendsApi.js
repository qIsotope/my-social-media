import { api } from './api'

const friendsApi = api.injectEndpoints({
	endpoints: (build) => ({
		sendFriendRequest: build.mutation({
			query: (body) => ({
				url: '/friends/sendFriendRequest',
				method: 'PATCH',
				body,
			}),
		}),
		acceptFriendRequest: build.mutation({
			query: (body) => ({
				url: '/friends/acceptFriendRequest',
				method: 'PATCH',
				body,
			}),
		}),
		cancelSendedFriendRequest: build.mutation({
			query: (body) => ({
				url: '/friends/cancelSendedFriendRequest',
				method: 'PATCH',
				body,
			})
		}),
		deleteFriend: build.mutation({
			query: (body) => ({
				url: '/friends/deleteFriend',
				method: 'PATCH',
				body,
			})
		}),
	}),
})

export const {
	useSendFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useCancelSendedFriendRequestMutation,
	useDeleteFriendMutation,
} = friendsApi;