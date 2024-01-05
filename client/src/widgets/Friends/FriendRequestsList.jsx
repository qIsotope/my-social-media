import { Box, Tab, Tabs, Typography, } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useState } from 'react'
import { FriendList } from './FriendList';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUsers } from 'state/slices/auth';

const TabPanel = ({ children, value, index }) => {
	return (
		<Box role="tabpanel" hidden={value !== index}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Box>
	);
};

export const FriendsRequestsListWidget = ({ friends }) => {
	const [value, setValue] = useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const { receivedFriendRequests, sentFriendRequests } = friends;

	return (
		<WidgetWrapper mt="20px">
			<Box mb="10px">
				<Typography variant='h4'>
					Friend Requests
				</Typography>
			</Box>
			<Tabs value={value} onChange={handleChange}>
				<Tab label="Recieved Friend Requests" />
				<Tab label="Sent Friend Requests" />
			</Tabs>
			<TabPanel value={value} index={0}><FriendList friends={receivedFriendRequests} friendRequest /></TabPanel>
			<TabPanel value={value} index={1}><FriendList friends={sentFriendRequests} friendRequest /></TabPanel>
		</WidgetWrapper>
	)
}
