import React, { useEffect } from 'react'
import {
	Box,
} from "@mui/material";
import { useSelector } from 'react-redux'
import UserWidget from 'scenes/widgets/User/UserWidget';
import CreatePostWidget from 'scenes/widgets/Posts/CreatePostWidget';
import { FriendsListWidget } from 'scenes/widgets/Friends/FriendsListWidget';
import { PostsWidget } from 'scenes/widgets/Posts/PostsWidget';
import { FriendsRequestsListWidget } from 'scenes/widgets/Friends/FriendRequestsListWidget';

export default function HomePage() {
	const { user } = useSelector(state => state.auth)
	const { receivedFriendRequests, sentFriendRequests, friends } = user;
	useEffect(() => {
		document.title = "Home"
	}, [])

	return (
		<Box>
			<Box
				width="100%"
				padding="112px 6% 2rem"
				display="flex"
				gap="0.5rem"
				justifyContent="space-between"
			>
				<Box flexBasis="26%">
					<UserWidget user={user} />
				</Box>
				<Box flexBasis="42%">
					<CreatePostWidget />
					<PostsWidget />
				</Box>
				<Box flexBasis="26%">
					<FriendsListWidget friends={friends} />
					<FriendsRequestsListWidget friends={{ receivedFriendRequests, sentFriendRequests }} />
				</Box>
			</Box>
		</Box>
	)
}
