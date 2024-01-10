import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import NotificationsWidget from 'widgets/Notifications/NotificationsWidget/NotificationsWidget'
import WidgetOptions from 'widgets/Notifications/NotificationsWidget/WidgetOptions'
import UserWidget from 'widgets/User/UserWidget'
import { useLazyGetNotificationsQuery } from 'state/service/notificationApi'

const ALL_NOTIFICATIONS = 'All Notifications';
const FROM_FRIENDS = 'From Friends';
const COMMENTS_REPLIES = 'Comments and Replies';
const ADD_COMMENT = 'addComment';
const REPLY = 'reply';

const NotificationPage = () => {
	const { user } = useSelector(state => state.auth)
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const [getNotifications, { data: notifications }] = useLazyGetNotificationsQuery();
	const [activeOption, setActiveOption] = useState(0)
	useEffect(() => {
		if (user._id) {
			getNotifications(user._id)
		}
	}, [user])

	const filterOptionsLabels = [ALL_NOTIFICATIONS, FROM_FRIENDS, COMMENTS_REPLIES];
	const mappingFilterOptionsToHandlers = {
		[ALL_NOTIFICATIONS]: (value) => value,
		[FROM_FRIENDS]: (value) => user.friends.some((friend) => friend._id === value[0].linkUserId),
		[COMMENTS_REPLIES]: (value) => value[0].type === ADD_COMMENT || value[0].type === REPLY,
	};
	const filteredNotifications = useMemo(() => notifications && [...Object.values(notifications?.readed), ...Object.values(notifications?.unReaded)]
		.filter(mappingFilterOptionsToHandlers[filterOptionsLabels[activeOption]]), [activeOption, notifications]);

	return (
		<Box>
			<Box
				width="100%"
				padding="112px 6%"
				display={isNonMobileScreens ? "flex" : "block"}
				gap="2rem"
				justifyContent="space-between"
			>
				<Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
					<UserWidget user={user} />
				</Box>
				<Box
					flexBasis={isNonMobileScreens ? "42%" : undefined}
				>
					<NotificationsWidget notifications={filteredNotifications} />
				</Box>
				<Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
					<WidgetOptions optionsLabels={filterOptionsLabels} activeOption={activeOption} setActiveOption={setActiveOption} />
				</Box>
			</Box>
		</Box>
	)
}

export default NotificationPage