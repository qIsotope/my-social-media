import { api } from './api'

export const uploadApi = api.injectEndpoints({
	endpoints: (build) => ({
		uploadImage: build.mutation({
			query: (body) => ({
				url: 'upload/image',
				method: 'POST',
				body,
			})
		}),
	}),
})

export const {
	useUploadImageMutation,
} = uploadApi;