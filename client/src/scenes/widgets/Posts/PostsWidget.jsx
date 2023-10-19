import React, { useEffect, useMemo } from 'react'
import { PostWidget } from './PostWidget';
import { useParams } from "react-router-dom";
import { useLazyGetPostsQuery } from 'state/service/postsApi';
import { useDispatch, useSelector } from 'react-redux';

export const PostsWidget = () => {
	const { id } = useParams();
	const [getPosts, { data: posts }] = useLazyGetPostsQuery()
	useEffect(() => {
		if (id) {
			getPosts(id)
		} else {
			getPosts()
		}
	}, [id])

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
					createdAt,
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
						createdAt={createdAt}
					/>
				)
			)}
		</>
	);
}
