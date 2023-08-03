import { Box, Tab, Tabs, } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useState } from 'react'
import { FriendList } from './FriendList';
import { socket } from 'socket';

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};

export const FriendsListWidget = ({ friends }) => {
	const [value, setValue] = useState(0);
	const [activeUsers, setActiveUsers] = useState({});
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		socket.on('get-users', (users) => {
			setActiveUsers(users);
		});
	}, [socket])

	console.log(activeUsers)

	return (
		<WidgetWrapper>
			<Tabs value={value} onChange={handleChange}>
				<Tab label="All Friends" />
				<Tab label="Friends Online" />
			</Tabs>
			<TabPanel value={value} index={0}><FriendList friends={friends} /></TabPanel>
			<TabPanel value={value} index={1}><FriendList friends={friends} /></TabPanel>
		</WidgetWrapper>
	)
}
