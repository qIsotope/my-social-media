import { Box } from '@mui/material'
import React from 'react'
import { useNotificationReaderQuery } from 'state/service/notificationApi';
import Notification from './Notification';

export const NotificationsStreamWidget = () => {
	const { data } = useNotificationReaderQuery()

	return (
		<>
			{!!data?.notifications.length && <Box width="350px"
				position="fixed"
				bottom="10px"
				right="30px"
			>
				{data?.notifications.map(notification => <Notification key={notification._id} notification={notification} />)}
			</Box>}
		</>
	)
}
