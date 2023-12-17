import { Box, Divider, InputAdornment, InputBase, Typography, useTheme } from '@mui/material'
import {
	ArrowBackIosOutlined,
	MoreHorizOutlined,
	AttachFileOutlined,
	SentimentSatisfiedOutlined,
	KeyboardVoiceOutlined,
} from '@mui/icons-material';
import WidgetWrapper from 'components/WidgetWrapper'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import UserImage from 'components/UserImage';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import Message from 'components/Message';
import { useLazyMarkMessageAsReadQuery, useSendMessageMutation } from 'state/service/messagingApi';
import { useSelector } from 'react-redux';
import { useIntersectionObserver } from 'hooks/useIntersection';

const getDateFormat = (date) => {
	const today = moment().format('D MMM');
	const yesterday = moment().subtract(1, 'day').format('D MMM');
	const dateToFormat = moment(date).format('D MMM');
	if (today === dateToFormat) {
		return 'Today';
	} else if (yesterday === dateToFormat) {
		return 'Yesterday';
	} else {
		return dateToFormat;
	}
}

const getHoursDiff = (firstDate, secondDate) => {
	const firstMomentDate = moment(firstDate)
	const secondMomentDate = moment(secondDate)
	return firstMomentDate.diff(secondMomentDate, 'hours')
}

const DialogWidget = ({ participant, messages, hasUnreadMessages, setLimit, isFetching, isSuccess, originalArgs, messagesCount, limit }) => {
	const theme = useTheme();
	const bottomBlockRef = useRef(null);
	const topBlockRef = useRef(null);
	const testRef = useRef(null);
	const firstUnreadMessageRef = useRef(null);
	const { user } = useSelector(state => state.auth);
	const firstRender = useRef(true);
	const [messageText, setMessageText] = useState('');
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const [sendMessage, { }] = useSendMessageMutation();
	const [lastViewedMessage, setLastViewedMessage] = useState(undefined);
	const [markAsRead,] = useLazyMarkMessageAsReadQuery();
	const { dialogId } = useParams();
	const entry = useIntersectionObserver(topBlockRef, false);
	const originalScrollHeightRef = useRef(0);

	useEffect(() => {
		if (entry?.isIntersecting && !isFetching && messages && Object.keys(messages).length) {
			originalScrollHeightRef.current = testRef.current.scrollHeight;

			setLimit((prev) => {
				if (prev < messagesCount) {
					return prev + 40;
				}
				return prev;
			});
		}
	}, [entry]);

	useEffect(() => {
		if (!isSendingMessage && testRef.current) {
			const originalScrollTop = testRef.current.scrollTop;
			testRef.current.scrollTop = originalScrollTop + (testRef.current.scrollHeight - originalScrollHeightRef.current);
		}
	}, [messages, isSendingMessage]);



	useEffect(() => {
		if (lastViewedMessage) {
			markAsRead({ dialogId, id: lastViewedMessage, limit });
		}
	}, [lastViewedMessage])
	useEffect(() => {
		if (hasUnreadMessages) {
			firstUnreadMessageRef.current?.scrollIntoView({ block: 'end' });
			firstRender.current = false;
		} else if (originalArgs?.limit === 40) {
			bottomBlockRef.current?.scrollIntoView({ block: 'end' });
		}
	}, [hasUnreadMessages, isSuccess, originalArgs]);

	const handleSendMessage = () => {
		setIsSendingMessage(true);
		sendMessage({
			toUserId: participant._id,
			fromUserId: user._id,
			text: messageText,
			limit,
		}).then(() => {
			setIsSendingMessage(false);
			bottomBlockRef.current?.scrollIntoView({ block: 'end' });
		});
		setMessageText('');
	};

	const messagingContainerStyles = {
		'&::-webkit-scrollbar': {
			width: '5px',
			backgroundColor: theme.palette.neutral.light,
		},
		'&::-webkit-scrollbar-track': {
			backgroundColor: theme.palette.neutral.light,
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: theme.palette.neutral.mediumLight,
			width: '2px',
			borderRadius: '4px',
		},
		'&::-webkit-scrollbar-thumb:hover': {
			backgroundColor: theme.palette.neutral.medium,
		},
		overflowY: 'scroll',
	}
	return (
		<WidgetWrapper backgroundColor={theme.palette.background.light}>
			<Box mt="-10px" display="flex" alignItems="center" justifyContent="space-between" paddingBottom="10px">
				<Link to='/messaging'>
					<Box display="flex" alignItems="center" gap="10px">
						<ArrowBackIosOutlined />
						<Typography>Back</Typography>
					</Box>
				</Link>
				<Box>
					<Typography>{participant?.name}</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap="30px">
					<MoreHorizOutlined fontSize='large' />
					<UserImage image={participant?.picturePath} size="32px" />
				</Box>
			</Box>
			<Box margin='0 -1.5rem'>
				<Divider />
			</Box>
			<Box ref={testRef} bgcolor={theme.palette.background.alt} height="70vh" margin="0 -1.5rem" padding="1.5rem 1.5rem 0" sx={messagingContainerStyles}>
				<Box ref={topBlockRef} id="upperBlock" />
				{messages && Object.keys(messages).map((date, keyIndex) => (
					<Box key={date}>
						<Box mt="20px" mb="20px">
							<Typography align='center' color={theme.palette.neutral.main}>
								{getDateFormat(date)}
							</Typography>
						</Box>
						<Box>
							{messages[date].map((message, index) => {
								const previousMessage = messages[date][index - 1];
								const firstUnreadMessage = message.unRead && !previousMessage?.unRead && message.fromUserId._id !== user._id;
								// const showAvatar = index === 0 || previousMessage?.fromUserId._id !== message.fromUserId._id
								// 	|| getHoursDiff(message.createdAt, previousMessage?.createdAt) > 1;
								return (
									<div id={message._id}>
										<Message
											id={message._id}
											createdAt={message.createdAt}
											firstName={message.fromUserId.firstName}
											picturePath={message.fromUserId.picturePath}
											text={message.text}
											key={message._id}
											unRead={message.unRead}
											fromUserId={message.fromUserId._id}
											firstUnreadMessageRef={hasUnreadMessages && firstUnreadMessage ? firstUnreadMessageRef : null}
											lastViewedMessage={lastViewedMessage}
											setLastViewedMessage={setLastViewedMessage}
											showAvatar={true}
										/>
									</div>
								)
							})}
							<Box pb="1rem" ref={bottomBlockRef} />
						</Box>
					</Box>
				))}
			</Box>
			<Box padding="15px 10px 0 0" display="flex" alignItems="center" gap="15px">
				<AttachFileOutlined sx={{ color: theme.palette.neutral.medium }} fontSize='large' />
				<InputBase
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					sx={{ border: '1px solid #555555', width: '100%', borderRadius: '6px', padding: '5px 15px 5px 14px' }}
					placeholder='Write a message'
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSendMessage();
						}
					}}
					endAdornment={
						<InputAdornment position="end">
							<SentimentSatisfiedOutlined sx={{ cursor: 'pointer', color: theme.palette.neutral.medium, '&:hover': { color: theme.palette.neutral.main } }} />
						</InputAdornment>}
				/>
				<KeyboardVoiceOutlined sx={{ color: theme.palette.neutral.medium }} fontSize='large' />
			</Box>
		</WidgetWrapper>
	)
}

export default DialogWidget