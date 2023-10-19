import { api } from './api'

export const userApi = api.injectEndpoints({
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
		searchUserBy: build.query({
			query: (name) => '/users/search/' + name,
		})
	}),
})

export const {
	useAuthMeQuery,
	useRegisterMutation,
	useLoginMutation,
	useGetUserProfileQuery,
	useLazySearchUserByQuery,
} = userApi;