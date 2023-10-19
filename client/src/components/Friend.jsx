import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Box,
	useTheme,
	Typography,
	IconButton,
	Skeleton,
	Badge,
	Tooltip
} from "@mui/material";
import {
	PersonAddOutlined,
	PersonRemoveOutlined,
	RemoveOutlined,
	Delete,
} from "@mui/icons-material";
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { Link } from 'react-router-dom';
import { useDeletePostMutation } from 'state/service/postsApi';
import { useAcceptFriendRequestMutation, useCancelSendedFriendRequestMutation, useDeleteFriendMutation, useSendFriendRequestMutation } from 'state/service/friendsApi';

export const Friend = ({ friendId, name, subtitle, picturePath, isAuthor, postId, setIsDeleted, search, loading, post, time }) => {
	const { palette } = useTheme();
	const { user, pending, activeUsers } = useSelector(state => state.auth)

	const [sendFriendRequest] = useSendFriendRequestMutation();
	const [cancelFriendRequest] = useCancelSendedFriendRequestMutation();
	const [acceptFriendRequest] = useAcceptFriendRequestMutation();
	const [deleteFriend] = useDeleteFriendMutation();
	const [deletePostAction] = useDeletePostMutation()

	const primaryLight = search ? palette.primary.mediumLight : palette.primary.light;
	const primaryDark = palette.primary.dark;
	const main = search ? palette.neutral.dark : palette.neutral.mediumMain;
	const medium = search ? palette.neutral.mediumMain : palette.neutral.medium;

	const isLoading = loading || pending;

	const handleSendFriendRequest = () => {
		sendFriendRequest({ id: user._id, friendId })
	}

	const handleCancelFriendRequest = () => {
		cancelFriendRequest({ id: user._id, friendId });
	}

	const handleAcceptFriendRequest = () => {
		acceptFriendRequest({ id: user._id, friendId })
	}

	const handleDeleteFriendRequest = () => {
		deleteFriend({ id: user._id, friendId });
	}

	const deletePost = (id) => {
		setIsDeleted(true)
		deletePostAction(id)
	}

	const getFriendStatus = () => {
		if (user.friends?.some(friend => friend._id === friendId)) {
			return {
				action: () => {
					handleDeleteFriendRequest()
				},
				icon: PersonRemoveOutlined,
				tooltip: 'Delete Friend',
			}
		} else if (user.sentFriendRequests?.some(friend => friend._id === friendId)) {
			return {
				action: () => {
					handleCancelFriendRequest()
				},
				icon: RemoveOutlined,
				tooltip: 'Cancel Request',
			}
		} else if (user.receivedFriendRequests?.some(friend => friend._id === friendId)) {
			return {
				action: () => {
					handleAcceptFriendRequest()
				},
				icon: PersonAddOutlined,
				tooltip: 'Add to Friend'
			}
		} else {
			return {
				action: () => {
					handleSendFriendRequest()
				},
				icon: PersonAddOutlined,
				tooltip: 'Send Request'
			}
		}
	};

	const { action, reverseAction, tooltip, icon: Icon } = getFriendStatus();

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

	const showOnline = activeUsers.includes(friendId)

	return (
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
				{isAuthor
					? <IconButton
						sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
						onClick={() => deletePost(postId)}
					>
						<Delete sx={{ color: primaryDark }} />
					</IconButton>
					: friendId !== user._id &&
					<Tooltip title={tooltip} placement="bottom">
						<IconButton
							sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
							onClick={() => action()}
						>
							<Icon />
						</IconButton>
					</Tooltip>
				}
			</FlexBetween>
		</Box >
	)
}
