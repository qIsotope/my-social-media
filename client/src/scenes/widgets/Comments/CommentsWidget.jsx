import React, { useState } from 'react'
import { CommentWidget } from './CommentWidget';
import { Box } from '@mui/material';

export const CommentsWidget = ({ comments, postUserId, postId }) => {
	return (
		<Box width="100%" mt="10px" mb="10px" textAlign="left">
			{comments?.map(
				({
					_id,
					userId,
					firstName,
					comments,
					lastName,
					text,
					picturePath,
					userPicturePath,
					likes,
					createdAt,
					parentCommentId,
					isDeleted,
				}) => (
					<CommentWidget
						key={_id}
						id={_id}
						userId={userId}
						name={`${firstName} ${lastName}`}
						text={text}
						picturePath={picturePath}
						userPicturePath={userPicturePath}
						likes={likes}
						createdAt={createdAt}
						postId={postId}
						postUserId={postUserId}
						comments={comments}
						parentCommentId={parentCommentId}
						isDeleted={isDeleted}
					/>
				)
			)}
		</Box>
	);
}
