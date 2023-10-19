import { Box, Tooltip, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import UserImage from './UserImage'

export const LikesTooltip = ({ showLikes, likesCount, likes, onClick }) => {
	const { palette } = useTheme()	
	return (
		<Box position="absolute" top="-80px" paddingBottom="20px"
			sx={{ cursor: "pointer", opacity: showLikes ? '1' : '0', transition: 'all 0.2s ease' }}>
			<Box onClick={onClick} bgcolor={palette.neutral.light} padding="8px" borderRadius="10px">
				<Typography>{likesCount + ' people liked'}</Typography>
				<Box mt="4px" display="flex" gap="5px">
					{likes.map((like, index) => {
						if (index < 3) {
							return (
								<Tooltip key={index} title={like.name}>
									<Box width="36px" height="36px">
										<Link to={`/profile/${like._id}`}>
											<UserImage image={like.picturePath} size='36px' />
										</Link>
									</Box>
								</Tooltip>
							)
						}
					})}
					{likesCount > 3 && <Box borderRadius="50%" bgcolor={palette.primary.mediumLight} width="36px" height="36px" display="flex" justifyContent="center" alignItems="center">
						<Tooltip title="See who liked">
							{`+${likesCount - 3}`}
						</Tooltip>
					</Box>}
				</Box>
			</Box>
		</Box>
	)
}
