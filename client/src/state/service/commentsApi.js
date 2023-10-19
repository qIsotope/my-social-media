import { api } from './api'
import { postsApi } from './postsApi'

const commentsApi = api.injectEndpoints({
	endpoints: (build) => ({
		likeDislikeComment: build.mutation({
			query: ({ commentId, postId, parentCommentId }) => ({
				url: '/comments/likes/' + commentId,
				method: 'PATCH',
				body: { postId, parentCommentId }
			}),
			async onQueryStarted({ commentId, postUserId, parentCommentId }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedComment } = await queryFulfilled
					dispatch(
						postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
							const neededPost = draft.find(post => post._id === updatedComment.postId);
							if (parentCommentId) {
								const parentComment = neededPost.comments.find(comm => comm._id === parentCommentId);
								const likedUnlikedComment = parentComment.comments.find(comm => comm._id === commentId);
								likedUnlikedComment.likes = updatedComment.likes
							} else {
								const likedUnlikedComment = neededPost.comments.find(comm => comm._id === commentId);
								likedUnlikedComment.likes = updatedComment.likes
							}
						}
						));
					dispatch(
						postsApi.util.updateQueryData('getPosts', postUserId, (draft) => {
							const neededPost = draft.find(post => post._id === updatedComment.postId);
							if (parentCommentId) {
								const parentComment = neededPost.comments.find(comm => comm._id === parentCommentId);
								const likedUnlikedComment = parentComment.comments.find(comm => comm._id === commentId);
								likedUnlikedComment.likes = updatedComment.likes
							} else {
								const likedUnlikedComment = neededPost.comments.find(comm => comm._id === commentId);
								likedUnlikedComment.likes = updatedComment.likes
							}
						}
						))
				}
				catch (e) {
					console.log(e);
				}
			},
		}),
		createComment: build.mutation({
			query: ({ body }) => ({
				url: '/comments',
				method: 'POST',
				body,
			}),
			async onQueryStarted({ postUserId, parentCommentId }, { dispatch, queryFulfilled }) {
				try {
					const { data: createdComment } = await queryFulfilled
					dispatch(
						postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
							const neededPost = draft.find(post => post._id === createdComment.postId);
							if (parentCommentId) {
								const parentComment = neededPost.comments.find(post => post._id === createdComment.parentCommentId)
								parentComment.comments.push(createdComment)
							} else {
								neededPost.comments.push(createdComment)
							}
						}
						));
					dispatch(
						postsApi.util.updateQueryData('getPosts', postUserId, (draft) => {
							const neededPost = draft.find(post => post._id === createdComment.postId);
							if (parentCommentId) {
								const parentComment = neededPost.comments.find(post => post._id === createdComment.parentCommentId)
								parentComment.comments.push(createdComment)
							} else {
								neededPost.comments.push(createdComment)
							}
						}
						))
				}
				catch (e) {
					console.log(e);
				}
			},
		}),
		deleteComment: build.mutation({
			query: (id) => ({
				url: '/comments/' + id,
				method: 'DELETE',
			}),
		}),
		updateComment: build.mutation({
			query: ({id, body}) => ({
				url: '/comments/'+ id,
				method: 'PATCH',
				body
			}),
		}),
		deleteThread: build.mutation({
			query: (ids) => ({
				url: '/threads',
				method: 'DELETE',
				body: { ids }
			})
		})
	}),
})

export const {
	useLikeDislikeCommentMutation,
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useDeleteThreadMutation,
	useUpdateCommentMutation
} = commentsApi;