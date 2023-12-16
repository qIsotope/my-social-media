import { Box, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import UserImage from './UserImage'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useIntersectionObserver } from 'hooks/useIntersection';

const Message = ({ picturePath, firstName, createdAt, text, unRead, fromUserId, firstUnreadMessageRef, firstMessageRef, setLastViewedMessage, id, showAvatar }) => {
	const formattedDate = `${moment(createdAt).format('LT')}`;
	const messageRef = useRef(null);
	const { user } = useSelector(state => state.auth);
	const theme = useTheme();
	const entry = useIntersectionObserver(messageRef, true);
	useEffect(() => {
		if (unRead && fromUserId !== user._id && entry?.isIntersecting) {
			setLastViewedMessage(id);
		}
	}, [entry]);

	return (
		<Box ref={firstUnreadMessageRef}>
			<Box
				ref={unRead && fromUserId !== user._id ? messageRef : null}
				bgcolor={unRead ? theme.palette.background.light : ''}
				padding="7px" borderRadius="3px"
				display="flex" gap="15px" alignItems="center" mb="20px"
			>
				{showAvatar && <UserImage size="40px" image={picturePath} />}
				<Box ref={firstMessageRef}>
					<Box display="flex" gap="20px" alignItems="center">
						<Typography color={theme.palette.neutral.main} sx={{ fontSize: '14px', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}>
							{firstName}
						</Typography>
						<Typography color={theme.palette.neutral.medium} sx={{ fontSize: '11px', fontWeight: '400' }}>{formattedDate}</Typography>
					</Box>
					<Typography fontWeight={400} color={theme.palette.neutral.mediumMain}>{text}</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default Message