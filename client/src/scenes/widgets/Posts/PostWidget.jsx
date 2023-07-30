import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import {
	ChatBubbleOutlineOutlined,
	FavoriteBorderOutlined,
	FavoriteOutlined,
	ShareOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { Friend } from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch } from 'react-redux'
import { CreateCommentWidget } from '../Comments/CreateCommentWidget';
import { CommentsWidget } from '../Comments/CommentsWidget';
import { useDeletePostMutation, useLikeDislikePostMutation } from 'state/service/postsApi';

export const PostWidget = ({
	postId,
	postUserId,
	name,
	description,
	location,
	picturePath,
	userPicturePath,
	likes,
	comments,
}) => {
	const [showComments, setShowComments] = useState(false)
	const [isDeleted, setIsDeleted] = useState(false)
	const { user } = useSelector(state => state.auth);
	const { palette } = useTheme();
	const [likeDislike, { }] = useLikeDislikePostMutation()
	const [deletePost, { }] = useDeletePostMutation()

	const main = palette.neutral.main;
	const primary = palette.primary.main;
	const isLiked = likes.includes(user._id);
	const likesCount = likes.length;
	const commentsLength = useMemo(() => comments.reduce((acc, comm) => {
		return acc + comm.comments.length
	}, 0) + comments.length, [comments])

	const restorePost = () => {
		deletePost(postId)
		setIsDeleted(false)
	}
	const likeDislikePost = () => {
		likeDislike(postId)
	};
	return (
		<WidgetWrapper m="2rem 0">
			{isDeleted
				? <Box pb="0.5rem">
					<Typography color={main}>
						{'Post was deleted. '}
						<Typography
							onClick={restorePost}
							sx={{
								display: 'inline',
								color: palette.common.white,
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
									textDecoration: 'underline'
								},
							}}
						>
							Undo.
						</Typography>
					</Typography>
				</Box>
				: <>
					<Friend
						friendId={postUserId}
						name={name}
						subtitle={location}
						picturePath={userPicturePath}
						isAuthor={user._id === postUserId}
						postId={postId}
						setIsDeleted={setIsDeleted}
					/>
					<Typography color={main} sx={{ mt: "1rem" }}>
						{description}
					</Typography>
					{picturePath && <img
						width="100%"
						height="auto"
						alt="post"
						style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
						src={`http://localhost:5005/assets/${picturePath}`}
					/>}
					<FlexBetween mt="0.25rem">
						<FlexBetween gap="1rem">
							<FlexBetween gap="0.3rem">
								<IconButton onClick={likeDislikePost}>
									{isLiked ? (
										<FavoriteOutlined sx={{ color: primary }} />
									) : (
										<FavoriteBorderOutlined />
									)}
								</IconButton>
								<Typography>{likesCount}</Typography>
							</FlexBetween>

							<FlexBetween gap="0.3rem">
								<IconButton onClick={() => setShowComments(!showComments)}>
									<ChatBubbleOutlineOutlined />
								</IconButton>
								<Typography>{commentsLength}</Typography>
							</FlexBetween>
						</FlexBetween>
						<IconButton>
							<ShareOutlined />
						</IconButton>
					</FlexBetween>
					{!!comments.length && <CommentsWidget comments={comments} postUserId={postUserId} postId={postId} />}
					{(!!comments.length || !showComments) && <CreateCommentWidget postId={postId} postUserId={postUserId} />}
				</>}
		</WidgetWrapper>
	)
}
