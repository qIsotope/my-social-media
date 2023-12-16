import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useLazyGetMessagesQuery } from 'state/service/messagingApi'
import { useParams } from "react-router-dom";
import { Box, useMediaQuery } from '@mui/material';
import { FriendsListWidget } from 'scenes/widgets/Friends/FriendsListWidget';
import DialogWidget from 'scenes/widgets/Messaging/DialogWidget';
import { useSelector } from 'react-redux';

const DialogPage = () => {
	const { dialogId } = useParams();
	const { user } = useSelector(state => state.auth);
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const [limit, setLimit] = React.useState(40);

	const [getMessages, { data = {}, isSuccess, originalArgs, isFetching }] = useLazyGetMessagesQuery();
	useEffect(() => {
		if (dialogId && !isFetching) {
			getMessages({ id: dialogId, limit });
		}
	}, [dialogId, limit])
	return (
		<Box>
			<Box
				width="100%"
				padding="112px 6% 0 6%"
				display={"flex"}
				flexDirection={isNonMobileScreens ? "row" : "column-reverse"}
				gap="2rem"
				justifyContent="center"
			>
				<Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
					<FriendsListWidget friends={user?.friends} title="Friend list" />
				</Box>
				<Box
					flexBasis={isNonMobileScreens ? "42%" : undefined}
				>
					<DialogWidget participant={data.participant} messages={data.messages}
						hasUnreadMessages={data.hasUnreadMessages} setLimit={setLimit} isSuccess={isSuccess}
						originalArgs={originalArgs} messagesCount={data.messagesCount} isFetching={isFetching}
						limit={limit}
					/>
				</Box>
			</Box>
		</Box>
	);
}

export default DialogPage