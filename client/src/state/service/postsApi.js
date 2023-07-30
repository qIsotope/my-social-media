import { api } from './api'

export const postsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getPosts: build.query({
			query: (id) => id ? `posts/${id}` : 'posts',
			transformResponse: (response) => {
				response.forEach(post => {
					const comments = [];
					post.comments.postComments.forEach(comment => {
						const childrenComments = post.comments.commentComments.filter(comm => comm.postCommentId === comment._id).map(comm => comm.comment);
						comment.comments = childrenComments
						comments.push(comment);
					})
					post.comments = comments
				})
				return response
			}
		}),
		deletePost: build.mutation({
			query: (id) => ({
				url: 'posts/' + id,
				method: 'DELETE',
			}),
		}),
		createPost: build.mutation({
			query: (body) => ({
				url: 'posts',
				method: 'POST',
				body,
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data: createdPost } = await queryFulfilled
					dispatch(
						postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
							const newPost = {
								...createdPost,
								comments: [],
							}
							draft?.unshift(newPost);
						}
						))
				}
				catch (e) {
					console.log(e);
				}
			}
		}),
		likeDislikePost: build.mutation({
			query: (id) => ({
				url: '/posts/likes/' + id,
				method: 'PATCH',
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedPost } = await queryFulfilled
					dispatch(
						postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
							const likedDislikedPost = draft.find(post => post._id === id);
							likedDislikedPost.likes = updatedPost.likes
						}
						));
					dispatch(
						postsApi.util.updateQueryData('getPosts', updatedPost.userId, (draft) => {
							const likedDislikedPost = draft.find(post => post._id === id);
							likedDislikedPost.likes = updatedPost.likes
						}
						))
				}
				catch (e) {
					console.log(e);
				}
			},
		})
	}),
})

export const { useLazyGetPostsQuery, useCreatePostMutation, useLikeDislikePostMutation, useDeletePostMutation, } = postsApi