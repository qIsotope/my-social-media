import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import {
	Close,
} from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import { Friend } from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { CreateCommentWidget } from '../Comments/CreateCommentWidget';
import { CommentsWidget } from '../Comments/CommentsWidget';
import { useDeletePostMutation } from 'state/service/postsApi';
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { PostActions } from 'components/PostActions';

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
	createdAt,
}) => {
	const { user } = useSelector(state => state.auth);
	const { palette } = useTheme();
	const formattedDate = `${moment(createdAt).format('DD MMM')} at ${moment(createdAt).format('LT')}`

	const [showComments, setShowComments] = useState(false)
	const [isDeleted, setIsDeleted] = useState(false)

	const [deletePost] = useDeletePostMutation()
	const [showLikesModal, setShowLikesModal] = useState(false);

	const main = palette.neutral.main;
	const likesCount = likes.length;

	const restorePost = () => {
		deletePost(postId)
		setIsDeleted(false)
	}
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
							time={formattedDate}
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
						<PostActions likes={likes} postId={postId} comments={comments} showComments={showComments} setShowComments={setShowComments} />
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
							<Link key={like._id} to={`/profile/${like._id}`}>
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
