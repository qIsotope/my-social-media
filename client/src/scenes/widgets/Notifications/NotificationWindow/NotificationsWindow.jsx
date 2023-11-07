import { Box, Divider, Popper, Typography, useTheme } from '@mui/material'
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useLazyGetNotificationsQuery } from 'state/service/notificationApi';
import Notification from '../../../../components/Notification';
import NotificationGroup from './NotificationGroup';
import { makeStyles } from "@mui/styles";
import { Link } from 'react-router-dom';
import Show from 'components/Show';

const useStyles = makeStyles({
	customScrollbar: {
		'&::-webkit-scrollbar': {
			width: '5px',
			backgroundColor: (palette) => palette.neutral.light,
		},
		'&::-webkit-scrollbar-track': {
			backgroundColor: (palette) => palette.neutral.light,
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: (palette) => palette.neutral.mediumLight,
			width: '2px',
			borderRadius: '4px',
		},
		'&::-webkit-scrollbar-thumb:hover': {
			backgroundColor: (palette) => palette.neutral.medium,
		},
	},
});

const NotificationsWindow = ({ anchorRef, open, setOpen }) => {
	const { palette } = useTheme();
	const classes = useStyles(palette);
	const popper = useRef()
	const { user, refs } = useSelector(state => state.auth)
	const [getNotifications, { data: notifications }] = useLazyGetNotificationsQuery();

	useEffect(() => {
		if (open) {
			getNotifications(user._id)
		}
	}, [])
	const handleClickOutside = () => setOpen(false)
	useOnClickOutside([...refs, popper, anchorRef], handleClickOutside)
	const haveNotifications = notifications?.readed && Object.values(notifications.readed).length
		|| notifications?.unReaded && Object.values(notifications.unReaded).length
	return (
		<Popper ref={popper} open={open} anchorEl={anchorRef.current} placement='bottom-start'>
			<Box position="absolute" top="5px" left="-160px" width="450px">
				<Box className={classes.customScrollbar} padding="1.5rem 0 0.15rem" borderTop="0.75rem" backgroundColor={palette.neutral.light} maxHeight="595px"
					sx={{ overflowY: 'auto' }}
				>
					<Show condition={haveNotifications}>
						<Box display="flex" flexDirection="column" >
							{notifications?.unReaded && Object.entries(notifications.unReaded).map(([key, value]) => {
								if (value.length === 1) return <Notification key={key} {...value[0]} />
								return (
									<NotificationGroup key={key} unRead notifications={value} notificationInfo={key} />
								)
							})}
							{notifications?.readed && Object.entries(notifications.readed).map(([key, value]) => {
								if (value.length === 1) return <Notification key={key} {...value[0]} />
								return (
									<NotificationGroup key={key} notifications={value} notificationInfo={key} />
								)
							})}
						</Box>
					</Show>

					<Show condition={!haveNotifications}>
						<Box p="50px" textAlign="center">
							<Typography variant="h5">No notifications</Typography>
						</Box>
					</Show>

				</Box>
				<Divider sx={{ backgroundColor: '#0A0A0A' }} />
				<Link onClick={() => setOpen(false)} to="/notifications">
					<Box borderRadius="0 0 0.75rem 0.75rem" backgroundColor={palette.neutral.light} padding="0.5rem 0" sx={{ cursor: 'pointer' }} textAlign="center">
						ShowAll
					</Box>
				</Link>
			</Box>
		</Popper>
	)
}

export default NotificationsWindow