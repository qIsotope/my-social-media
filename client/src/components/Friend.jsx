import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Box,
	useTheme,
	Typography,
	IconButton,
	Skeleton,
} from "@mui/material";
import {
	PersonAddOutlined,
	PersonRemoveOutlined,
	Delete,
} from "@mui/icons-material";
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { Link } from 'react-router-dom';
import { useAddRemoveFriendMutation } from 'state/service/userApi';
import { useDeletePostMutation } from 'state/service/postsApi';

export const Friend = ({ friendId, name, subtitle, picturePath, isAuthor, postId, setIsDeleted, search, loading }) => {
	const { palette } = useTheme();
	const { user, pending } = useSelector(state => state.auth)
	const [isFriend, setIsFriend] = useState(false)

	const primaryLight = search ? palette.primary.mediumLight : palette.primary.light;
	const primaryDark = palette.primary.dark;
	const main = search ? palette.neutral.dark : palette.neutral.mediumMain;
	const medium = search ? palette.neutral.mediumMain : palette.neutral.medium;
	
	const isLoading = loading || pending;
	const [addRemoveFriend] = useAddRemoveFriendMutation();
	const [deletePostAction] = useDeletePostMutation()

	useEffect(() => {
		if (user.friends?.some(friend => friend._id === friendId)) {
			setIsFriend(true)
		} else {
			setIsFriend(false)
		};
	}, [user.friends])
	const toggleFriend = () => {
		addRemoveFriend({ id: user._id, friendId })
		setIsFriend(!isFriend);
	}

	const deletePost = (id) => {
		setIsDeleted(true)
		deletePostAction(id)
	}

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
							<UserImage size="55" image={picturePath} />
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
								<Typography color={medium} fontSize="0.75rem">
									{subtitle}
								</Typography>
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
					: friendId !== user._id && <IconButton
						sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
						onClick={toggleFriend}
					>
						{isFriend ? (
							<PersonRemoveOutlined sx={{ color: primaryDark }} />
						) : (
							<PersonAddOutlined sx={{ color: primaryDark }} />
						)}
					</IconButton>
				}
			</FlexBetween>
		</Box>
	)
}
