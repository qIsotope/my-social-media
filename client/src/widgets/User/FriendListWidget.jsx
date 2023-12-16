import WidgetWrapper from 'components/WidgetWrapper'
import React from 'react'
import {
	Box,
	useTheme,
	Typography,
	Skeleton
} from "@mui/material";
import { Friend } from 'components/Friend';
import { useSelector } from 'react-redux';
import { SearchedUsers } from 'components/SearchedUsers';

export const FriendListWidget = ({ friends, search, loading }) => {
	const { palette } = useTheme()
	const { pending } = useSelector(state => state.auth)
	const isLoading = loading || pending
	const emptyArray = new Array(2);
	if (isLoading) {
		return (
			<WidgetWrapper>
				<Skeleton variant="text" width="200px" sx={{ fontSize: '16px', fontWeight: '500', mb: '1.5rem' }} />
				<Box display="flex" flexDirection="column" gap="1.5rem">
					<Friend loading />
					{[...emptyArray].map((_, index) => <Friend key={index} loading />)}
				</Box>
			</WidgetWrapper>
		)
	}

	return (
		<WidgetWrapper backgroundColor={search && palette.neutral.light}>
			{search && <SearchedUsers />}
			<Typography
				color={palette.neutral.dark}
				variant="h5"
				fontWeight="500"
				sx={{ mb: "1.5rem" }}
			>
				{search ? 'People' : 'Friend List'}
			</Typography>
			<Box display="flex" flexDirection="column" gap="1.5rem">
				{
					friends?.map((friend) => (
						<Friend
							key={friend._id}
							name={`${friend.firstName} ${friend.lastName}`}
							subtitle={friend.location}
							picturePath={friend.picturePath}
							friendId={friend._id}
							search={search}
						/>
					))
				}
				{
					friends?.length === 0 && <Typography p="1rem" variant="h5" textAlign="center">
						{search ? 'No matches' : 'Friend List is Empty'}
					</Typography>
				}
			</Box>
		</WidgetWrapper>
	)
}
