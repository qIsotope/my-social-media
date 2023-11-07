import { Box, Divider, Typography, useTheme } from '@mui/material'
import UserImage from 'components/UserImage'
import moment from 'moment'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Notification from '../../../../components/Notification'
import Show from 'components/Show'

const getText = (type, count) => {
	if (type === 'postLike') {
		return `liked your ${count} posts`
	} else if (type === 'addComment') {
		return `left ${count} comments on your posts`
	} else if (type === 'reply') {
		return `replied ${count} times to your comments`
	}
}

const NotificationGroup = ({ notifications, notificationInfo, unRead, page }) => {
	const { palette } = useTheme()
	const [openGroup, setOpenGroup] = useState(false)
	const [type, linkUserId] = [notifications[0].type, notifications[0].linkUserId];
	const posts = notifications.map(notification => ({
		post: notification.postImagePath,
		id: notification.postLink
	}));
	const name = notifications[0].name;
	const userPicture = notifications[0].userImagePath;
	const text = getText(type, notifications.length);
	const formattedDate = `${moment(notifications[0].time).format('DD MMM')} at ${moment(notifications[0].time).format('LT')}`;

	return (
		<>
			{!openGroup && (<>
				<Box bgcolor={unRead && palette.neutral.mediumLight} onClick={() => setOpenGroup(true)}
					padding="10px 20px 10px 20px" display="flex" justifyContent="space-between" sx={{ cursor: 'pointer' }}>
					<Box display="flex" gap="20px">
						<Link to={'/profile/' + linkUserId}>
							<UserImage image={userPicture} size={page ? '55px' : '40px'} />
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
							<Box display="flex" mt="5px" gap="7px">
								{posts.map((post, index) => (
									<React.Fragment key={index}>
										{index < 7 && <Link to={'post/' + post.id}>
											<Show condition={post.post?.length}>
												<Box>
													<img
														style={{ objectFit: "cover", borderRadius: "3px" }}
														width={page ? '45px' : "35px"}
														height={page ? '45px' : "35px"}
														alt="user"
														src={post.post}
													/>
												</Box>
											</Show>
										</Link>}
									</React.Fragment>
								))}
							</Box>
							<Typography pt="5px" color={palette.neutral.medium} sx={{ fontSize: '11px', fontWeight: '400' }}>{formattedDate}</Typography>
						</Box>
					</Box>
					<Box sx={{ cursor: 'pointer' }}>
						<KeyboardArrowDownOutlinedIcon onClick={() => setOpenGroup(true)} />
					</Box>
				</Box>
				<Divider sx={{ backgroundColor: palette.background.default, }} />
			</>)}
			{openGroup && notifications.map(notification => (
				<Notification key={notification.id} {...notification} page={page} />
			))}
		</>
	)
}

export default NotificationGroup