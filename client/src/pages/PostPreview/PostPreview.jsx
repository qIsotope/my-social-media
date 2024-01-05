import { Box, Dialog, Typography, useTheme } from '@mui/material';
import { Friend } from 'components/Friend';
import { PostActions } from 'components/PostActions';
import WidgetWrapper from 'components/WidgetWrapper';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommentsWidget } from 'widgets/Comments/Comments';
import { CreateCommentWidget } from 'widgets/Comments/CreateComment';
import { useLazyGetPostQuery } from 'state/service/postsApi';
import { updateRefs } from 'state/slices/auth';

const PostPreview = () => {
	const { user } = useSelector(state => state.auth)
	const { palette } = useTheme()
	const dialogRef = useCallback(ref => {
		if (ref) {
			dispatch(updateRefs({ current: ref }))
		}
	}, [])
	const location = useLocation();
	const dispatch = useDispatch()
	const navigate = useNavigate();
	const [originalPath, postId] = location.pathname.split('/post/');
	const [getPost, { data }] = useLazyGetPostQuery()
	const [showComments, setShowComments] = useState(false)
	useEffect(() => {
		if (!postId) return
		getPost(postId)
	}, [postId])

	return (
		<>
			{data && postId && (<Dialog ref={dialogRef} open={!!data && !!postId} fullWidth={true} maxWidth="sm" onClose={() => navigate(originalPath)}
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							width: "100%",
							maxWidth: "700px",
							'&::-webkit-scrollbar': {
								width: '5px',
								backgroundColor: palette.neutral.light,
							},
							'&::-webkit-scrollbar-track': {
								backgroundColor: palette.neutral.light,
							},
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: palette.neutral.mediumLight,
								width: '2px',
								borderRadius: '4px',
							},
							'&::-webkit-scrollbar-thumb:hover': {
								backgroundColor: palette.neutral.medium,
							},
						},
					},
				}}>
				<WidgetWrapper borderRadius="0">
					<Box padding="15px">
						<Friend
							friendId={data.postUserId}
							name={`${data.firstName} ${data.lastName}`}
							subtitle={data.location}
							picturePath={data.userPicturePath}
							isAuthor={user._id === data.postUserId}
							postId={data.postId}
							setIsDeleted={data.setIsDeleted}
							time={data.formattedDate}
						/>
						<Box>
							<Typography color={palette.neutral.main} sx={{ mt: "1rem" }}>
								{data.description}
							</Typography>
						</Box>
						<Box mt="10px" mb="20px" display='flex' justifyContent="center">
							{data.picturePath && <Box
								component="img"
								alt="post"
								sx={{
									maxHeight: "620px",
									maxWidth: "620px",
								}}
								style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
								src={!data.picturePath.includes('https') ? `http://localhost:5005/assets/${data.picturePath}` : data.picturePath}
							/>}
						</Box>
						<PostActions preview createdAt={data.createdAt} likes={data.likes} postId={postId} comments={data.comments} setShowComments={setShowComments} showComments={showComments} />
						{!!data.comments.length && <CommentsWidget comments={data.comments} postUserId={data.postUserId} postId={postId} />}
						{(!!data.comments.length || showComments) && <CreateCommentWidget postId={postId} postUserId={data.postUserId} />}
					</Box>
				</WidgetWrapper>
			</Dialog>)}
		</>
	)
}

export default PostPreview