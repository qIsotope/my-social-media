import { Box, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import NotificationGroup from '../NotificationWindow/NotificationGroup'
import Notification from 'components/Notification'

const NotificationsWidget = ({ notifications }) => {
	const theme = useTheme()
	return (
		<Box bgcolor={theme.palette.background.alt} borderRadius="0.75rem">
			<Box p="1.5rem 1.5rem 0.75rem 1.5rem">
				<Typography variant='h4'>
					Notifications
				</Typography>
			</Box>
			<Divider />
			<Box display="flex" flexDirection="column" >
				{notifications?.map((value, index) => {
					if (value.length === 1) return <Notification key={value[0].id} {...value[0]} page />
					return (
						<NotificationGroup key={index} notifications={value} page />
					)
				})}
			</Box>
			<Box
				borderRadius="0 0 0.75rem 0.75rem" color={theme.palette.neutral.medium}
				padding="0.7rem 0" textAlign="center"
			>
				Showing most recent news
			</Box>
		</Box>
	)
}

export default NotificationsWidget