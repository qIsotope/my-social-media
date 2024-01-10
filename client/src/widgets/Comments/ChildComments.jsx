import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import { CreateCommentWidget } from './CreateComment';
import { CommentWidget } from './Comment';

export const ChildCommentsWidget = ({ comments, postUserId, postId, commentInfo }) => {
	const [childCommentInfo, setChildCommentInfo] = useState(null)
	useEffect(() => setChildCommentInfo(commentInfo), [commentInfo])
	return (
		<Box mb={!!commentInfo && "20px"} textAlign="right" display="flex" alignItems="flex-end" ml="40px">
			<Box width="100%" mt={comments.length && "10px"} mb={comments.length && "10px"} textAlign="left">
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
						repliedToId,
						repliedToName,
					}) => (
						<CommentWidget
							key={_id}
							userId={userId}
							id={_id}
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
							setChildCommentInfo={setChildCommentInfo}
							childCommentInfo={childCommentInfo}
							repliedToId={repliedToId}
							repliedToName={repliedToName}
						/>
					)
				)}
				{!!childCommentInfo &&
					<CreateCommentWidget autofocus parentCommentId={childCommentInfo.parentCommentId}
						name={childCommentInfo.name} repliedToId={childCommentInfo.id} postUserId={postUserId} postId={postId} resetCommentInfo={setChildCommentInfo} />}
			</Box>
		</Box>
	);
}
