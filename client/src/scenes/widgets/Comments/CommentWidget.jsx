import { Box, Divider, Typography, useTheme } from '@mui/material'
import {
	ModeEdit,
	Close,
	FavoriteBorder,
	FavoriteOutlined,
} from "@mui/icons-material";
import FlexBetween from 'components/FlexBetween'
import UserImage from 'components/UserImage'
import moment from 'moment'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useLikeDislikeCommentMutation } from 'state/service/commentsApi';
import { ChildCommentsWidget } from './ChildCommentsWidget';
import { Link } from 'react-router-dom';

export const CommentWidget = ({
	name,
	id,
	userId,
	text,
	picturePath,
	userPicturePath,
	likes,
	comments,
	createdAt,
	postUserId,
	postId,
	parentCommentId,
	setChildCommentInfo,
	repliedToName,
	repliedToId
}) => {
	const formattedDate = `${moment(createdAt).format('DD MMM')} at ${moment(createdAt).format('LT')}`
	const { palette } = useTheme()
	const { user } = useSelector(state => state.auth);
	const isLiked = likes.includes(user._id)	
	const [likeUnlikeComment] = useLikeDislikeCommentMutation();
	const likeComment = () => {
		likeUnlikeComment({ commentId: id, postUserId, postId, parentCommentId })
	}
	const [commentInfo, setCommentInfo] = useState(null);

	const saveComment = () => {
		if (setChildCommentInfo) {
			setChildCommentInfo({
				parentCommentId: parentCommentId || id,
				name,
				id: userId,
			})
		} else {
			setCommentInfo({
				parentCommentId: parentCommentId || id,
				name,
				id: userId,
			})
		}
	}

	return (
		<Box>
			<FlexBetween mt='10px' mb='5px' sx={{ '&:hover .control': { opacity: '1' } }}>
				<Box display="flex" gap="10px" width="100%">
					<UserImage image={userPicturePath} size="35px" />
					<Box width="100%">
						<FlexBetween mt="-4px">
							<Link to={`/profile/${userId}`}>
							<Typography color={palette.neutral.main} sx={{ fontSize: '14px', fontWeight: '500', '&:hover': {textDecoration: 'underline'} }}>{name}</Typography>
							</Link>
							<Box className="control" display="flex" gap="10px" sx={{ opacity: "0", transition: 'all 0.1s ease' }}>
								<ModeEdit sx={{ fontSize: '16px', fontWeight: '500', color: palette.neutral.mediumMain, '&:hover': { color: palette.neutral.main }, cursor: 'pointer' }} />
								<Close sx={{ fontSize: '18px', fontWeight: '500', color: palette.neutral.mediumMain, '&:hover': { color: palette.neutral.main }, cursor: 'pointer' }} />
							</Box>
						</FlexBetween>
						<Box color={palette.neutral.mediumMain} sx={{ fontSize: '12px', fontWeight: '500' }}>
							{
								repliedToId
								&& <Link to={`/profile/${repliedToId}`}>
									<Typography color={palette.neutral.main} fontWeight="500" display="inline"
										sx={{ '&:hover': { cursor: 'pointer', textDecoration: 'underline' } }}>
										{repliedToName}
									</Typography>
								</Link>
							}
							{text}
						</Box>
						<FlexBetween>
							<Box display="flex" gap="10px" alignItems="center">
								<Typography color={palette.neutral.medium} sx={{ fontSize: '11px', fontWeight: '400' }}>{formattedDate}</Typography>
								<Typography onClick={saveComment} pb="2px" color={palette.neutral.dark} 
								sx={{ fontSize: '12px', fontWeight: '400', cursor: "pointer", '&:hover': { textDecoration: 'underline' }}}>Reply</Typography>
							</Box>
							<Box onClick={likeComment} className="control" sx={{ opacity: likes.length ? '1' : '0' }} display="flex" gap="5px" alignItems="center">
								{isLiked ? <FavoriteOutlined
									sx={{ fontSize: '16px', fontWeight: '500', color: palette.neutral.medium, '&:hover': { color: palette.neutral.main }, transition: "all 0.1s ease", cursor: 'pointer' }}
								/>
									: <FavoriteBorder
										sx={{ fontSize: '16px', fontWeight: '500', color: palette.neutral.medium, '&:hover': { color: palette.neutral.main }, transition: "all 0.1s ease", cursor: 'pointer' }}
									/>}
								{likes.length}
							</Box>
						</FlexBetween>
					</Box>
				</Box>
			</FlexBetween>
			<Divider />
			{<ChildCommentsWidget comments={comments} postUserId={postUserId} postId={postId} commentInfo={commentInfo} />}
		</Box>
	)
}
