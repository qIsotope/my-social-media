import { Box, Tab, Tabs, Typography, } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useState } from 'react'
import { FriendList } from './FriendList';
import { socket } from 'socket';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUsers } from 'state/slices/auth';

const TabPanel = ({children, value, index}) => {
	return (
		<Box role="tabpanel" hidden={value !== index}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Box>
	);
};

export const FriendsListWidget = ({ friends }) => {
	const [value, setValue] = useState(0);
	const { activeUsers } = useSelector(state => state.auth)
	const dispatch = useDispatch()
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		socket.on('get-users', (users) => {
			dispatch(setActiveUsers(users));
		});
	}, [socket])

	return (
		<WidgetWrapper>
			<Box mb="10px">
				<Typography variant='h4'>
					Friend List
				</Typography>
			</Box>
			<Tabs value={value} onChange={handleChange}>
				<Tab label="All Friends" />
				<Tab label="Friends Online" />
			</Tabs>
			<TabPanel value={value} index={0}><FriendList friends={friends} /></TabPanel>
			<TabPanel value={value} index={1}><FriendList friends={friends?.filter(friend => activeUsers.includes(friend._id))} /></TabPanel>
		</WidgetWrapper>
	)
}
