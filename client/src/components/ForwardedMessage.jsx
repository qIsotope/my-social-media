import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import UserImage from './UserImage'
import moment from 'moment'

const ForwardedMessage = ({
	picturePath, firstName, createdAt, text, userId
}) => {
	const formattedDate = `${moment(createdAt).format('DD MMM')} at ${moment(createdAt).format('LT')}`
	const theme = useTheme()
	return (
		<Box display='flex' gap="10px" marginBottom="20px" alignItems="center">
			<Link to={'/profile/' + userId}>
				<UserImage size="36px" image={picturePath} />
			</Link>
			<Box>
				<Box display="flex" alignItems="center" gap="15px">
					<Link to={'/profile/' + userId}>
						<Typography sx={{
							"&:hover": {
								textDecoration: 'underline',
								cursor: "pointer",
							},
							color: theme.palette.neutral.main
						}}>
							{firstName}
						</Typography>
					</Link>
					<Typography color={theme.palette.neutral.medium} sx={{ fontSize: '11px', fontWeight: '400', paddingTop: '2px' }}>
						{formattedDate}
					</Typography>
				</Box>
				<Typography sx={{ color: theme.palette.neutral.mediumMain }}>{text}</Typography>
			</Box>
		</Box>
	)
}

export default ForwardedMessage