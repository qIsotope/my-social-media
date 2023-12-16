import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Box,
	useTheme,
	Typography,
	IconButton,
	Skeleton,
	Badge,
	Popper
} from "@mui/material";
import {
	MoreHoriz,
} from "@mui/icons-material";
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { Link } from 'react-router-dom';
import { useDeletePostMutation } from 'state/service/postsApi';
import { useAcceptFriendRequestMutation, useCancelSendedFriendRequestMutation, useDeleteFriendMutation, useSendFriendRequestMutation } from 'state/service/friendsApi';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import Show from './Show';
import { SendMessage } from './SendMessageWindow';
import { updateRefs } from 'state/slices/auth';

export const Friend = ({ friendId, name, subtitle, picturePath, isAuthor, postId, setIsDeleted, search, loading, post, time }) => {
	const { palette } = useTheme();
	const { user, pending, activeUsers } = useSelector(state => state.auth)
	const popperAnchor = useRef(null);
	const dispatch = useDispatch()
	const { refs } = useSelector(state => state.auth)
	const popper = useCallback(ref => {
		if (ref) {
			dispatch(updateRefs({ current: ref }))
		}
		return { current: ref }
	}, [])
	const [showPopper, setShowPopper] = useState(false)
	const [showMessageModal, setShowMessageModal] = useState(false)
	useOnClickOutside([...refs, popperAnchor], () => setShowPopper(false))

	const [sendFriendRequest] = useSendFriendRequestMutation();
	const [cancelFriendRequest] = useCancelSendedFriendRequestMutation();
	const [acceptFriendRequest] = useAcceptFriendRequestMutation();
	const [deleteFriend] = useDeleteFriendMutation();
	const [deletePostAction] = useDeletePostMutation()
	const main = search ? palette.neutral.dark : palette.neutral.mediumMain;
	const medium = search ? palette.neutral.mediumMain : palette.neutral.medium;

	const isLoading = loading || pending;

	const deletePost = (id) => {
		setIsDeleted(true)
		deletePostAction(id)
	}

	const getFriendStatus = () => {
		if (user.friends?.some(friend => friend._id === friendId)) {
			return {
				action: () => deleteFriend({ id: user._id, friendId }),
				actionName: 'Delete Friend',
			}
		} else if (user.sentFriendRequests?.some(friend => friend._id === friendId)) {
			return {
				action: () => cancelFriendRequest({ id: user._id, friendId }),
				actionName: 'Cancel Friend Request',
			}
		} else if (user.receivedFriendRequests?.some(friend => friend._id === friendId)) {
			return {
				action: () => acceptFriendRequest({ id: user._id, friendId }),
				actionName: 'Add to Friend'
			}
		} else {
			return {
				action: () => sendFriendRequest({ id: user._id, friendId }),
				actionName: 'Send Friend Request'
			}
		}
	};

	const { action, actionName } = getFriendStatus();

	const saveSearchedUser = useCallback(() => {
		if (!search) return
		const savedUser = {
			picturePath,
			name: name.split(' ')[0],
			id: friendId,
		}
		let users = JSON.parse(window.localStorage.getItem('searchedUsers'))
		if (!users) return window.localStorage.setItem('searchedUsers', JSON.stringify([savedUser]))
		const alreadySaved = users.find(user => user.id === friendId)
		if (alreadySaved) users = users.filter(user => user.id !== alreadySaved.id)
		return window.localStorage.setItem('searchedUsers', JSON.stringify([savedUser, ...users]))
	}, [search])

	const handleOpenMessageModal = () => {
		setShowMessageModal(true)
		setShowPopper(false)
	}

	const showOnline = activeUsers.includes(friendId)

	return (
		<>
			<Box display="flex" flexDirection="column" gap="1.5rem">
				<FlexBetween>
					<FlexBetween gap="1rem">
						{isLoading
							?
							<>
								<Skeleton variant="circular" width="55px" height="55px" />
								<Box>
									<Skeleton variant="text" sx={{ fontWeight: "500", fontSize: '16px' }} width="150px" />
									<Skeleton variant="text" sx={{ fontSize: '0.75rem' }} width="100px" />
								</Box>
							</>
							:
							<>
								<Badge variant={showOnline ? "dot" : ''} color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									sx={{ '& .MuiBadge-badge': { bottom: '6px', right: "3px", zIndex: 0 } }}>
									<UserImage size="55" image={picturePath} />
								</Badge>
								<Box>
									<Link to={'/profile/' + friendId}>
										<Typography
											color={main}
											variant="h5"
											fontWeight="500"
											sx={{
												"&:hover": {
													color: palette.primary.light,
													cursor: "pointer",
												},
											}}
											onClick={saveSearchedUser}
										>
											{name}
										</Typography>
									</Link>
									{postId
										? <Link to={'post/' + postId}>
											<Typography color={medium} fontSize="0.75rem" sx={{ "&:hover": { textDecoration: "underline", } }}>
												{time}
											</Typography>
										</Link>
										: <Typography color={medium} fontSize="0.75rem">
											{subtitle}
										</Typography>
									}
								</Box>
							</>
						}
					</FlexBetween>
					<IconButton onClick={() => setShowPopper(!showPopper)} ref={popperAnchor}>
						<MoreHoriz sx={{ color: palette.neutral.mediumMain, fontSize: '26px' }} />
					</IconButton>
					<Popper ref={popper} open={showPopper} anchorEl={popperAnchor.current} placement='bottom-end' sx={{ zIndex: '10000' }}>
						<Box width="170px" bgcolor={palette.neutral.mediumLight} padding="7px 0" borderRadius="7px">
							<Show condition={!isAuthor}>
								<Box onClick={action} padding="10px" sx={{ ":hover": { bgcolor: palette.neutral.medium, cursor: 'pointer' } }}>{actionName}</Box>
								<Box onClick={handleOpenMessageModal}
									padding="10px" sx={{ ":hover": { bgcolor: palette.neutral.medium, cursor: 'pointer' } }}>Write a Message</Box>
							</Show>
							<Show condition={isAuthor}>
								<Box onClick={() => deletePost(postId)} padding="10px" sx={{ ":hover": { bgcolor: palette.neutral.medium, cursor: 'pointer' } }}>Delete Post</Box>
								<Box padding="10px" sx={{ ":hover": { bgcolor: palette.neutral.medium, cursor: 'pointer' } }}>Edit Post</Box>
							</Show>
						</Box>
					</Popper>
				</FlexBetween>
			</Box >
			<Show condition={showMessageModal}>
				<SendMessage open={showMessageModal} user={{ firstName: name, picturePath, id: friendId }} handleClose={() => setShowMessageModal(false)} />
			</Show>
		</>
	)
}
