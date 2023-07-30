import React, { useEffect, useMemo } from 'react'
import { PostWidget } from './PostWidget';
import { useParams } from "react-router-dom";
import { useLazyGetPostsQuery } from 'state/service/postsApi';
import { useDispatch, useSelector } from 'react-redux';
import { setImpressionsCount } from 'state/slices/auth';

export const PostsWidget = () => {
	const { id } = useParams();
	const { user } = useSelector(state => state.auth)
	const dispatch = useDispatch();
	const [getPosts, { data: posts }] = useLazyGetPostsQuery()
	useEffect(() => {
		if (id) {
			getPosts(id)
		} else {
			getPosts()
		}
	}, [id])
	useEffect(() => {
		if (posts) {
			if (id) {
				dispatch(setImpressionsCount(posts.reduce((acc, post) => acc + post.likes.length, 0)))
			} else {
				dispatch(setImpressionsCount(posts.filter(post => post.userId === user._id).reduce((acc, post) => acc + post.likes.length, 0)))
			}
		}
	}, [id, posts])
	return (
		<>
			{posts?.map(
				({
					_id,
					userId,
					firstName,
					lastName,
					description,
					location,
					picturePath,
					userPicturePath,
					likes,
					comments,
				}) => (
					<PostWidget
						key={_id}
						postId={_id}
						postUserId={userId}
						name={`${firstName} ${lastName}`}
						description={description}
						location={location}
						picturePath={picturePath}
						userPicturePath={userPicturePath}
						likes={likes}
						comments={comments}
					/>
				)
			)}
		</>
	);
}
