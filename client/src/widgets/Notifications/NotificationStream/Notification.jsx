import { Box, Typography, useTheme } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import WidgetWrapper from 'components/WidgetWrapper'
import React, { useEffect, useRef, useState } from 'react'
import {
	Close,
} from "@mui/icons-material";
import UserImage from 'components/UserImage';
import { Link, useLocation } from 'react-router-dom';
import Show from 'components/Show';

export const Notification = ({ notification }) => {
	const [showNotification, setShowNotification] = useState(!!notification)
	const location = useLocation()
	const timeoutRef = useRef(null);
	const { palette } = useTheme();

	useEffect(() => {
		if (notification) {
			timeoutRef.current = setTimeout(() => {
				setShowNotification(null)
			}, 120000);
		}
		return () => clearInterval(timeoutRef.current)
	}, [notification])

	const handleMouseEnter = () => {
		clearTimeout(timeoutRef.current)
	}

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setShowNotification(false)
		}, 22000);
	}

	return (
		<>
			{showNotification && <Box
				sx={{ visibility: showNotification ? 'visible' : 'visible' }
				}
				padding="1.2rem 1rem 0.75rem 1rem"
				backgroundColor={palette.background.alt}
				borderRadius="0.75rem"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				mb="20px"
			>
				<FlexBetween>
					<Typography>{notification?.title}</Typography>
					<Close sx={{ cursor: 'pointer' }} onClick={() => setShowNotification(null)} />
				</FlexBetween>
				<FlexBetween>
					<Box display="flex" mt="15px" gap="20px" pb="10px">
						<Link to={'/profile/' + notification?.linkUserId}>
							<UserImage image={notification?.userImagePath} size='40px' />
						</Link>
						<Box>
							<Typography
								color={palette.neutral.medium} sx={{ fontSize: '14px', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}
							>
								<Link to={'/profile/' + notification?.linkUserId}>{notification?.name + ' '}</Link>
							</Typography>
							<Typography color={palette.neutral.mediumMain} pt="3px">
								{notification.content}
							</Typography>
						</Box>
						<Typography color={palette.neutral.main} ml="-15px">
							{notification?.text}
						</Typography>
					</Box>
					<Box>
						{notification.postLink && <Link to={location.pathname + '/post/' + notification.postLink}>
							<Show condition={notification.postImagePath?.length}>
								<Box width="40px" height="40px">
									<img
										style={{ objectFit: "cover", borderRadius: "5%" }}
										width="40px"
										height="40px"
										alt="user"
										src={notification.postImagePath}
									/>
								</Box>
							</Show>
						</Link>}
					</Box>
				</FlexBetween>
			</Box>}
		</>
	)
}


export default Notification