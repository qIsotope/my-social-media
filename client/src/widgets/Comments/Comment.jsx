import { Box, Divider, Tooltip, Typography, useTheme } from '@mui/material'
import {
	ModeEdit,
	Close,
	FavoriteBorder,
	FavoriteOutlined,
} from "@mui/icons-material";
import FlexBetween from 'components/FlexBetween'
import UserImage from 'components/UserImage'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDeleteCommentMutation, useDeleteThreadMutation, useLikeDislikeCommentMutation } from 'state/service/commentsApi';
import { ChildCommentsWidget } from './ChildComments';
import { Link } from 'react-router-dom';
import { EditCommentWidget } from './EditComment';

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
	repliedToId,
	isDeleted: isCommentDeleted
}) => {
	const formattedDate = `${moment(createdAt).format('DD MMM')} at ${moment(createdAt).format('LT')}`
	const { palette } = useTheme()
	const { user } = useSelector(state => state.auth);

	const [isDeleted, setIsDeleted] = useState(false)
	const [commentInfo, setCommentInfo] = useState(null);
	const [isDeletedThread, setIsDeletedThread] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [editedText, setIsEditedText] = useState(null)

	const [likeUnlikeComment] = useLikeDislikeCommentMutation();
	const [fetchDeleteComment] = useDeleteCommentMutation()
	const [fetchDeleteThread] = useDeleteThreadMutation()
	const likeComment = () => {
		likeUnlikeComment({ commentId: id, postUserId, postId, parentCommentId })
	}

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

	const deleteComment = () => {
		fetchDeleteComment(id)
		setIsDeleted(true)
	}

	const restoreComment = () => {
		fetchDeleteComment(id)
		setIsDeleted(false)
		setIsDeletedThread(false)
	}

	const deleteThread = () => {
		const ids = comments.map(comment => comment._id);
		fetchDeleteThread(ids)
		setIsDeletedThread(true)
		setIsDeleted(true)
	}

	const restoreThread = () => {
		const ids = comments.map(comment => comment._id);
		fetchDeleteThread(ids)
		setIsDeletedThread(false)
		setIsDeleted(false)
	}

	const isPostAuthor = postUserId === user._id;
	const isCommentAuthor = userId === user._id;
	const isLiked = likes.includes(user._id)

	return (
		<Box>
			{
				isDeleted || isEdit
					? <>
						{isDeleted && !isEdit && <FlexBetween mt='10px' mb='5px' padding="15px" >
							<Typography color={palette.neutral.main}>
								{isCommentDeleted ? 'Thread was deleted. ' : 'Comment was deleted. '}
								<Typography
									onClick={isCommentDeleted ? restoreThread : restoreComment}
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
						</FlexBetween>}
						{
							isEdit && !isDeleted && <EditCommentWidget setIsEdit={setIsEdit} editedText={editedText}
								currentValue={text} userPicturePath={userPicturePath} id={id} setIsEditedText={setIsEditedText} />
						}
					</>
					: <FlexBetween mt='10px' mb='5px' sx={{ '&:hover .control': { opacity: '1' } }}>
						<Box display="flex" gap="10px" width="100%">
							<UserImage image={userPicturePath} size="35px" />
							<Box width="100%">
								<FlexBetween mt="-4px">
									<Link to={`/profile/${userId}`}>
										<Typography color={palette.neutral.main} sx={{ fontSize: '14px', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}>{name}</Typography>
									</Link>
									{<Box className="control" display="flex" gap="10px" sx={{ opacity: "0", transition: 'all 0.1s ease' }}>
										{(isPostAuthor || isCommentAuthor) && <>
											{isCommentAuthor &&
												<Tooltip title="Edit Comment" placement="top">
													<ModeEdit onClick={() => setIsEdit(true)}
														sx={{ fontSize: '16px', fontWeight: '500', color: palette.neutral.mediumMain, '&:hover': { color: palette.neutral.main }, cursor: 'pointer' }} />
												</Tooltip>}
											<Tooltip title={isCommentDeleted ? 'Delete Thread' : "Delete Comment"} placement='top'>
												<Close onClick={isCommentDeleted ? deleteThread : deleteComment} sx={{ fontSize: '18px', fontWeight: '500', color: palette.neutral.mediumMain, '&:hover': { color: palette.neutral.main }, cursor: 'pointer' }} />
											</Tooltip>
										</>}
									</Box>}
								</FlexBetween>
								<Box color={isCommentDeleted ? palette.neutral.main : palette.neutral.mediumMain}
									mt={isCommentDeleted && "-7px"} pb={isCommentDeleted && "3px"}
									fontSize={isCommentDeleted ? '14px' : '12px'} fontWeight="500">
									{
										repliedToId
										&& <Link to={`/profile/${repliedToId}`}>
											<Typography color={palette.neutral.main} fontWeight="500" display="inline"
												sx={{ '&:hover': { cursor: 'pointer', textDecoration: 'underline' } }}>
												{repliedToName}
											</Typography>
										</Link>
									}
									{editedText || (text.startsWith(repliedToName) ? text.replace(repliedToName, '') : text)}
								</Box>
								<FlexBetween>
									<Box display="flex" gap="10px" alignItems="center">
										<Typography color={palette.neutral.medium} sx={{ fontSize: '11px', fontWeight: '400' }}>{formattedDate}</Typography>
										<Typography onClick={saveComment} pb="2px" color={palette.neutral.dark}
											sx={{ fontSize: '12px', fontWeight: '400', cursor: "pointer", '&:hover': { textDecoration: 'underline' } }}>Reply</Typography>
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
					</FlexBetween>}
			<Divider />
			{!isDeletedThread && <ChildCommentsWidget comments={comments} postUserId={postUserId} postId={postId} commentInfo={commentInfo} />}
		</Box>
	)
}
