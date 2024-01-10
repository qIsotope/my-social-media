import { Box, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import UserImage from './UserImage'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Show from './Show'

const Dialog = ({ participants, lastMessage, _id, updatedAt, unReadMessages }) => {
	const { user } = useSelector(state => state.auth)
	const dialogUser = participants.filter(participant => participant._id !== user._id)[0]
	const { palette } = useTheme();
	const formattedDate = `${moment(lastMessage.createdAt).format('DD MMM')} at ${moment(lastMessage.updatedAt).format('LT')}`
	return (
		<Box key={_id}>
			<Link to={'/dialogs/' + _id}>
				<Box bgcolor={unReadMessages > 0 && palette.neutral.mediumLight} padding="10px 20px 10px 20px" display="flex">
					<Box display="flex" gap="20px" flex="1">
						<UserImage image={dialogUser.picturePath} size='55px' />
						<Box flexBasis="80%">
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
									{dialogUser.firstName + ' ' + dialogUser.lastName}
								</Typography>
							</Box>
							<Box display="flex" alignItems="center" gap="10px" flex="1">
								<Show condition={lastMessage.fromUserId === user._id}>
									<UserImage image={user.picturePath} size='25px' />
								</Show>
								<Box mt="5px" width="100%"
									p="2px 0px 3px 10px" borderRadius="5px" bgcolor={lastMessage.unRead && palette.neutral.mediumLight}
									sx={{ color: palette.neutral.mediumMain, fontSize: '14px', fontWeight: '500' }}
								>
									{lastMessage.text}
									<Show condition={lastMessage.attachments?.length}>
										<Box sx={{ color: palette.neutral.medium, fontSize: '14px', fontWeight: '400' }}>
											{lastMessage.attachments?.length} attachment
										</Box>
									</Show>
								</Box>
							</Box>
						</Box>
					</Box>
					<Box>
						<Typography
							pt="5px"
							color={palette.neutral.medium}
							display="inline"
							sx={{ fontSize: '11px', fontWeight: '400', }}
						>
							{formattedDate}
						</Typography>
						<Box display="flex" justifyContent="flex-end" mt="10px">
							{unReadMessages > 0 &&
								<Box sx={{
									backgroundColor: palette.primary.main, borderRadius: '50%',
									height: '20px', width: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'
								}}>
									<Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>{unReadMessages}</Typography>
								</Box>}
						</Box>
					</Box>
				</Box >
				<Divider sx={{ backgroundColor: palette.background.default, }} />
			</Link>
		</Box>
	)
}

export default Dialog