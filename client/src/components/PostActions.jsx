import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import moment from 'moment'
import React, { useMemo, useRef, useState } from 'react'
import { useLikeDislikePostMutation } from 'state/service/postsApi'
import FlexBetween from './FlexBetween'
import { ChatBubbleOutlineOutlined, Close, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material'
import { LikesTooltip } from './LikesTooltip'
import UserImage from './UserImage'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PostActions = ({ createdAt, likes, postId, comments, preview, showComments, setShowComments }) => {
	const { user } = useSelector(state => state.auth)
	const { palette } = useTheme()
	const formattedDate = `${moment(createdAt).format('DD MMM')} at ${moment(createdAt).format('LT')}`

	const [likeDislike] = useLikeDislikePostMutation()
	const [showLikes, setShowLikes] = useState(false);
	const [showLikesModal, setShowLikesModal] = useState(false);
	const timeoutRef = useRef(null);

	const primary = palette.primary.main;
	const isLiked = !!likes.find(like => like._id === user._id);
	const likesCount = likes.length;
	const commentsLength = useMemo(() => comments.reduce((acc, comm) => {
		return acc + comm.comments.length
	}, 0) + comments.length, [comments])

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

	const handleShowComments = () => {
		if (!setShowComments) return

		setShowComments(!showComments);
	};

	return (
		<>
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
						<IconButton onClick={handleShowComments}>
							<ChatBubbleOutlineOutlined />
						</IconButton>
						<Typography>{commentsLength}</Typography>
					</FlexBetween>
				</FlexBetween>
				{!preview
					? <IconButton>
						<ShareOutlined />
					</IconButton>
					: <Typography color={palette.neutral.medium} fontSize="0.75rem" >{formattedDate}</Typography>
				}
			</FlexBetween>
			<Divider />
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
