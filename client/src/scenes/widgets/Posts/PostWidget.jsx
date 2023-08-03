import React, { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import {
	ChatBubbleOutlineOutlined,
	Close,
	FavoriteBorderOutlined,
	FavoriteOutlined,
	ShareOutlined,
} from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { Friend } from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch } from 'react-redux'
import { CreateCommentWidget } from '../Comments/CreateCommentWidget';
import { CommentsWidget } from '../Comments/CommentsWidget';
import { useDeletePostMutation, useLikeDislikePostMutation } from 'state/service/postsApi';
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';
import { LikesTooltip } from 'components/LikesTooltip';

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
	const { user } = useSelector(state => state.auth);
	const { palette } = useTheme();

	const [showComments, setShowComments] = useState(false)
	const [isDeleted, setIsDeleted] = useState(false)

	const [likeDislike] = useLikeDislikePostMutation()
	const [deletePost] = useDeletePostMutation()
	const [showLikes, setShowLikes] = useState(false);
	const [showLikesModal, setShowLikesModal] = useState(false);
	const timeoutRef = useRef(null);

	const main = palette.neutral.main;
	const primary = palette.primary.main;
	const isLiked = !!likes.find(like => like._id === user._id);
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

	const handleMouseEnter = () => {
		if (!likesCount) return;
		timeoutRef.current = setTimeout(() => {
			setShowLikes(true);
		}, 400);
	};

	const handleMouseLeave = () => {
		clearTimeout(timeoutRef.current);
		setShowLikes(false);
	};

	return (
		<>
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
							src={!picturePath.includes('https') ? `http://localhost:5005/assets/${picturePath}` : picturePath}
						/>}
						<FlexBetween mt="0.25rem">
							<FlexBetween gap="1rem" position="relative">
								<FlexBetween gap="0.3rem" sx={{ cursor: "pointer" }} zIndex="10" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
									<IconButton onClick={likeDislikePost}>
										{isLiked ? (
											<FavoriteOutlined sx={{ color: primary }} />
										) : (
											<FavoriteBorderOutlined />
										)}
									</IconButton>
									<Typography>{likesCount}</Typography>
									{showLikes && <LikesTooltip onClick={() => setShowLikesModal(true)} showLikes={showLikes} likesCount={likesCount} likes={likes} />}
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
						{(!!comments.length || showComments) && <CreateCommentWidget postId={postId} postUserId={postUserId} />}
					</>}
			</WidgetWrapper>
			<Dialog open={showLikesModal} onClose={() => setShowLikesModal(false)} fullWidth={true} maxWidth="sm">
				<DialogTitle sx={{ m: 0, p: 2 }}>
					Likes {likesCount}
					<IconButton
						onClick={() => setShowLikesModal(false)}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
						}}>
						<Close />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<Box display="flex" gap="15px" padding="10px 0" flexWrap="wrap">
						{likes.map(like => (
							<Link to={`/profile/${like._id}`}>
								<Box sx={{ cursor: 'pointer' }} display="flex" flexDirection="column" gap="7px" alignItems="center">
									<Box width="95px" height="95px">
										<UserImage image={like.picturePath} size="95px" />
									</Box>
									<Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>{like.name}</Typography>
								</Box>
							</Link>
						))}
					</Box>
				</DialogContent>
			</Dialog>
		</>
	)
}
