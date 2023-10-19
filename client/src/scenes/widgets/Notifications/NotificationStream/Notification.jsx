import { Box, Typography, useTheme } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import WidgetWrapper from 'components/WidgetWrapper'
import React, { useEffect, useRef, useState } from 'react'
import {
	Close,
} from "@mui/icons-material";
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';

export const Notification = ({ notification }) => {
	const [showNotification, setShowNotification] = useState(!!notification)
	const timeoutRef = useRef(null);
	const { palette } = useTheme();

	useEffect(() => {
		if (notification) {
			timeoutRef.current = setTimeout(() => {
				setShowNotification(null)
			}, 10000);
		}
		return () => clearInterval(timeoutRef.current)
	}, [notification])

	const handleMouseEnter = () => {
		clearTimeout(timeoutRef.current)
	}

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setShowNotification(false)
		}, 2000);
	}

	return (
		<>
			{showNotification && <WidgetWrapper
				sx={{ visibility: showNotification ? 'visible' : 'hidden' }
				}
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
						<Typography>
							<Typography
								sx={{
									"&:hover": {
										color: palette.neutral.mediumMain,
										cursor: "pointer",
										textDecoration: 'underline',
									}
								}
								}
							>
								<Link to={'/profile/' + notification?.linkUserId}>{notification?.name + ' '}</Link>
							</Typography>
							{notification?.text}
						</Typography>
					</Box>
					<Box>
						{notification.postLink && <Link to={'/post/' + notification.postLink}>
							<Box width="40px" height="40px">
								<img
									style={{ objectFit: "cover", borderRadius: "5%" }}
									width="40px"
									height="40px"
									alt="user"
									src={notification.postImagePath}
								/>
							</Box>
						</Link>}
					</Box>
				</FlexBetween>
			</WidgetWrapper>}
		</>
	)
}


export default Notification