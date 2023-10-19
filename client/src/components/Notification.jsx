import { Box, Divider, Typography, useTheme } from '@mui/material'
import UserImage from 'components/UserImage'
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'

const Notification = ({ userImagePath, text, linkUserId, name, time, postImagePath, postLink, unRead, content, page }) => {
	const { palette } = useTheme()
	const formattedDate = `${moment(time).format('DD MMM')} at ${moment(time).format('LT')}`
	return (
		<>
			<Box bgcolor={unRead && palette.neutral.mediumLight} padding="10px 20px 10px 20px" display="flex" justifyContent="space-between">
				<Box display="flex" gap="20px">
					<Link to={'/profile/' + linkUserId}>
						<UserImage image={userImagePath} size={page ? '55px' : '40px'} />
					</Link>
					<Box>
						<Box sx={{ color: palette.neutral.main, }}>
							<Typography
								sx={{
									paddingRight: '0.5rem',
									display: 'inline-block',
									color: '#fff',
									fontSize: '14px',
									fontWeight: '500',
									"&:hover": {
										cursor: "pointer",
										textDecoration: 'underline',
									}
								}
								}
							>
								<Link to={'/profile/' + linkUserId}>{name + ' '}</Link>
							</Typography>
							{text}
						</Box>
						<Box sx={{ color: palette.neutral.mediumMain, fontSize: '14px', fontWeight: '500' }}>{content}</Box>
						<Link to={'post/' + postLink}>
							<Typography
								pt="5px"
								color={palette.neutral.medium}
								display="inline"
								sx={{ fontSize: '11px', fontWeight: '400', '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
							>
								{formattedDate}
							</Typography>
						</Link>
					</Box>
				</Box>
				{postLink && <Link to={'post/' + postLink}>
					<Box>
						<img
							style={{ objectFit: "cover", borderRadius: "5%" }}
							width={page ? '45px' : "35px"}
							height={page ? '45px' : "35px"}
							alt="user"
							src={postImagePath}
						/>
					</Box>
				</Link>}
			</Box>
			<Divider sx={{ backgroundColor: palette.background.default, }} />
		</>
	)
}

export default Notification