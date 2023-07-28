import { Typography } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import WidgetWrapper from 'components/WidgetWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import {
	Close,
} from "@mui/icons-material";
import UserImage from 'components/UserImage';
import { socket } from 'socket';

const getformattedNotification = (notification) => {
	console.log(notification);
	if (!notification) return {}
	switch (notification.type) {
		case 'friendRequest':
			return {
				title: 'New Friend Request!',
				text: `${notification.fromUser.name} has sent a friend request`,
				imagePath: notification.fromUser.picturePath
			}

		default:
			return notification
	}
}

export const NotificationsWidget = () => {
	const [notification, setNotification] = useState(null)

	useEffect(() => {
		socket.on('notification', (body) => {
			console.log(body);
			setNotification(getformattedNotification(body))
		});
	}, [socket])
	// useEffect(() => {
	// 	if (notification) {
	// 		setTimeout(() => {
	// 			setNotification(null)
	// 		}, 5000);
	// 	}
	// }, [notification])
	// const formattedNotification = useMemo(() => getformattedNotification(notification), [notification])
	// console.log(formattedNotification);
	return (
		<WidgetWrapper width="300px" position="fixed" bottom="10px" right="30px" sx={{ visibility: notification ? 'visible' : 'hidden' }}>
			<FlexBetween>
				<Typography>{notification?.title}</Typography>
				<Close />
			</FlexBetween>
			<FlexBetween mt="25px" gap="20px" pb="10px">
				<UserImage image={notification?.imagePath} size='40px' />
				<Typography>{notification?.text}</Typography>
			</FlexBetween>
		</WidgetWrapper>
	)
}
