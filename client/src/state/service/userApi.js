import { api } from './api'

const userApi = api.injectEndpoints({
	endpoints: (build) => ({
		authMe: build.query({
			query: () => 'auth/me'
		}),
		register: build.mutation({
			query: (body) => ({
				url: 'auth/register',
				method: 'POST',
				body,
			})
		}),
		login: build.mutation({
			query: (body) => ({
				url: 'auth/login',
				method: 'POST',
				body,
			})
		}),
		getUserProfile: build.query({
			query: (id) => 'users/' + id
		}),
		addRemoveFriend: build.mutation({
			query: ({ id, friendId }) => ({
				url: `/users/${id}/${friendId}`,
				method: 'POST'
			}),
			async onQueryStarted({friendId}, { dispatch, queryFulfilled }) {
				try {
					const { data: newFriends } = await queryFulfilled
					dispatch(
						userApi.util.updateQueryData('getUserProfile', friendId, (draft) => {
							draft.friends = newFriends.friendFriends;
						}))
				} catch (error) {
					console.log(error);
				}
			}
		}),
		searchUserBy: build.query({
			query: (name) => '/search/users/' + name,
		})
	}),
})

export const {
	useAuthMeQuery,
	useRegisterMutation,
	useLoginMutation,
	useGetUserProfileQuery,
	useAddRemoveFriendMutation,
	useLazySearchUserByQuery,
} = userApi;