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
						if (comment.isDeleted && comment.comments.length) {
							comment.firstName = ''
							comment.lastName = ''
							comment.text = 'This comment has been deleted by the user';
							comment.userPicturePath = 'https://firebasestorage.googleapis.com/v0/b/my-social-media-c3987.appspot.com/o/users%2FdefaultUserImage.jpg?alt=media&token=adb2a1ad-59af-47f3-a235-27f49f14ca12&_gl=1*1cew9mf*_ga*MTk4NTQ4Njk4MS4xNjk1NzI0MDk0*_ga_CW55HF8NVT*MTY5NzcyMTQ3My43LjEuMTY5NzcyMzg3NS44LjAuMA..';
						}
					})
					post.comments = comments.filter(comm => !comm.isDeleted || comm.comments.length);
				})
				return response
			}
		}),
		getPost: build.query({
			query: (id) => 'post/' + id,
			transformResponse: (response) => {
				const comments = [];
				response.comments.postComments.forEach(comment => {
					const childrenComments = response.comments.commentComments.filter(comm => comm.postCommentId === comment._id).map(comm => comm.comment);
					comment.comments = childrenComments
					comments.push(comment);
					if (comment.isDeleted && comment.comments.length) {
						comment.firstName = ''
						comment.lastName = ''
						comment.text = 'This comment has been deleted by the user';
						comment.userPicturePath = 'https://firebasestorage.googleapis.com/v0/b/my-social-media-c3987.appspot.com/o/users%2FdefaultUserImage.jpg?alt=media&token=adb2a1ad-59af-47f3-a235-27f49f14ca12&_gl=1*1cew9mf*_ga*MTk4NTQ4Njk4MS4xNjk1NzI0MDk0*_ga_CW55HF8NVT*MTY5NzcyMTQ3My43LjEuMTY5NzcyMzg3NS44LjAuMA..';
					}
				})
				response.comments = comments.filter(comm => !comm.isDeleted || comm.comments.length);
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

export const { useLazyGetPostsQuery, useCreatePostMutation, useLikeDislikePostMutation, useDeletePostMutation, useLazyGetPostQuery } = postsApi