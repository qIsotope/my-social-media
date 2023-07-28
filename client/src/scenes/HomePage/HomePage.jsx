import React from 'react'
import {
	Box,
} from "@mui/material";
import { useSelector } from 'react-redux'

import Navbar from 'scenes/Navbar/Navbar';
import UserWidget from 'scenes/widgets/User/UserWidget';
import CreatePostWidget from 'scenes/widgets/Posts/CreatePostWidget';
import { FriendListWidget } from 'scenes/widgets/User/FriendListWidget';
import { PostsWidget } from 'scenes/widgets/Posts/PostsWidget';

export default function HomePage() {
	const { user } = useSelector(state => state.auth)

	return (
		<Box>
			<Navbar />
			<Box
				width="100%"
				padding="2rem 6%"
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
					<FriendListWidget friends={user.friends} />
				</Box>
			</Box>
		</Box>
	)
}
