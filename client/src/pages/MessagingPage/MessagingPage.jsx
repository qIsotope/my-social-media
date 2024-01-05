import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MessagingWidget from 'widgets/Messaging/MessagingWidget';
import WidgetOptions from 'widgets/Notifications/NotificationsWidget/WidgetOptions';
import UserWidget from 'widgets/User/UserWidget';
import { useLazyGetDialogsQuery } from 'state/service/messagingApi';

const ALL_DIALOGS = 'All Dialogs';
const UNREAD = 'Unread';
const GROUP_CHAT = 'Group Chat';

const MessagingPage = () => {
	const { user } = useSelector(state => state.auth)
	const [activeOption, setActiveOption] = useState(0)
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const filterOptionsLabels = [ALL_DIALOGS, UNREAD, GROUP_CHAT];
	const [getDialogs, { data }] = useLazyGetDialogsQuery();
	useEffect(() => {
		if (user?._id) {
			getDialogs(user._id);
		}
	}, [user])
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
					<MessagingWidget dialogs={data?.dialogs} unReadMessages={data?.unReadMessages} />
				</Box>
				<Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
					<WidgetOptions optionsLabels={filterOptionsLabels} activeOption={activeOption} setActiveOption={setActiveOption} />
				</Box>
			</Box>
		</Box>
	)
}

export default MessagingPage