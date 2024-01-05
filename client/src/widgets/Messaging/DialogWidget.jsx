import { Box, Button, Dialog, DialogContent, Divider, ImageList, ImageListItem, InputAdornment, InputBase, Typography, useTheme } from '@mui/material'
import {
	AttachFileOutlined,
	SentimentSatisfiedOutlined,
	KeyboardVoiceOutlined,
	Close,
	ArticleOutlined
} from '@mui/icons-material';
import WidgetWrapper from 'components/WidgetWrapper'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import UserImage from 'components/UserImage';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import Message from 'components/Message';
import { useLazyMarkMessageAsReadQuery, useSendMessageMutation } from 'state/service/messagingApi';
import { useDispatch, useSelector } from 'react-redux';
import { useIntersectionObserver } from 'hooks/useIntersection';
import DialogHeaderBarWidget from './DialogHeaderBarWidget';
import Show from 'components/Show';
import { setToSliceSelectedMessages } from 'state/slices/messaging';
import ForwardedMessage from 'components/ForwardedMessage';
import { useUploadImageMutation } from 'state/service/uploadApi';
import { v4 } from 'uuid';
import VoiceRecorder from './VoiceRecording';

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

const imageTypes = ['jpeg', 'png', 'gif', 'jpg', 'svg'];

const DialogWidget = ({ participant, messages, hasUnreadMessages, setLimit, isFetching, isSuccess, originalArgs, messagesCount, limit }) => {
	const { user } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const { selectedMessages: sliceSelectedMessages } = useSelector(state => state.messaging)
	const theme = useTheme();
	const { dialogId } = useParams();
	const bottomBlockRef = useRef(null);
	const topBlockRef = useRef(null);
	const messagesContainerRef = useRef(null);
	const firstUnreadMessageRef = useRef(null);
	const originalScrollHeightRef = useRef(0);
	const inputRef = useRef(null);

	const [messageText, setMessageText] = useState('');
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const [lastViewedMessage, setLastViewedMessage] = useState(undefined);
	const [selectedMessages, setSelectedMessages] = useState([]);
	const [showForwardedMessages, setShowForwardedMessages] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);


	const [markAsRead,] = useLazyMarkMessageAsReadQuery();
	const [sendMessage, { }] = useSendMessageMutation();
	const [uploadFile, { isFetching: isFetchUpload, data: fetchedUploadedFile }] = useUploadImageMutation();

	const entry = useIntersectionObserver(topBlockRef, false);

	useEffect(() => {
		if (entry?.isIntersecting && !isFetching && messages && Object.keys(messages).length) {
			originalScrollHeightRef.current = messagesContainerRef.current.scrollHeight;

			setLimit((prev) => {
				if (prev < messagesCount) {
					return prev + 40;
				}
				return prev;
			});
		}
	}, [entry]);

	useEffect(() => {
		if (!isSendingMessage && messagesContainerRef.current && originalArgs?.limit > 40) {
			const originalScrollTop = messagesContainerRef.current.scrollTop;
			messagesContainerRef.current.scrollTop = originalScrollTop + (messagesContainerRef.current.scrollHeight - originalScrollHeightRef.current);
		}
	}, [messages, isSendingMessage]);

	useEffect(() => {
		if (lastViewedMessage) {
			markAsRead({ dialogId, id: lastViewedMessage, limit });
		}
	}, [lastViewedMessage])

	useEffect(() => {
		if (hasUnreadMessages && originalArgs?.limit === 40) {
			firstUnreadMessageRef.current?.scrollIntoView({ block: 'end' });
		} else if (originalArgs?.limit === 40) {
			bottomBlockRef.current?.scrollIntoView({ block: 'end' });
		}
	}, [hasUnreadMessages, isSuccess, originalArgs]);

	const handleSendMessage = (data) => {
		if ((!messageText && !sliceSelectedMessages.length && !uploadedFiles.length && !data) || isFetchUpload) return;
		console.log('here2');
		setIsSendingMessage(true);
		sendMessage({
			toUserId: participant._id,
			fromUserId: user._id,
			text: messageText,
			limit,
			dialogId,
			forwardedMessages: sliceSelectedMessages,
			attachments: data ? data : uploadedFiles,
		}).then(() => {
			setIsSendingMessage(false);
			bottomBlockRef.current?.scrollIntoView({ block: 'end' });
		});
		setUploadedFiles([]);
		setMessageText('');
		handleClearSelectedMessages();
	};

	const handleClearSelectedMessages = () => {
		setSelectedMessages([]);
		dispatch(setToSliceSelectedMessages([]));
	}

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

	const handleUpload = (file) => {
		if (file) {
			const path = `messaging/${file.name || 'audiofile'}.${v4()}`
			const lastDot = file.name.lastIndexOf('.');
			const ext = file.name.substring(lastDot + 1);
			const formData = new FormData();
			formData.append('image', file);
			formData.append('path', path);
			formData.append('type', ext);
			formData.append('name', file.name)
			uploadFile(formData)
		}
	};

	useEffect(() => {
		if (fetchedUploadedFile && uploadedFiles.length < 7) {
			setUploadedFiles([...uploadedFiles, fetchedUploadedFile])
		}
	}, [fetchedUploadedFile])

	const nonImageTypeFiles = useMemo(() => uploadedFiles.filter(file => !imageTypes.includes(file.type)), [uploadedFiles]);
	const imageTypeFiles = useMemo(() => uploadedFiles.filter(file => imageTypes.includes(file.type)), [uploadedFiles]);

	return (
		<WidgetWrapper backgroundColor={theme.palette.background.light}>
			<DialogHeaderBarWidget image={participant?.picturePath} name={participant?.name} selectedMessages={selectedMessages} setSelectedMessages={setSelectedMessages} limit={limit} />
			<Box margin='0 -1.5rem'>
				<Divider />
			</Box>
			<Box ref={messagesContainerRef} bgcolor={theme.palette.background.alt} height="70vh" margin="0 -1.5rem" padding="1.5rem 1.5rem 0" sx={messagingContainerStyles}>
				<Box ref={topBlockRef} id="upperBlock" />
				{messages && Object.keys(messages).map((date) => (
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
								return (
									<Box>
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
											setLastViewedMessage={setLastViewedMessage}
											selectedMessages={selectedMessages}
											setSelectedMessages={setSelectedMessages}
											forwardedMessages={message.forwardedMessages}
											isDeletedFor={message.isDeletedFor}
											limit={limit}
											attachments={message.attachments}
										/>
									</Box>
								)
							})}
							<Box pb="1rem" ref={bottomBlockRef} />
						</Box>
					</Box>
				))}
			</Box>
			<Box padding="15px 10px 0 0">
				<input hidden type="file" accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf" ref={inputRef} onChange={(e) => handleUpload(e.target.files[0])} />
				<Box display="flex" alignItems="center" gap="15px">
					<AttachFileOutlined
						onClick={() => inputRef.current.click()}
						sx={{ color: theme.palette.neutral.medium, cursor: 'pointer' }}
						fontSize='large'
					/>
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
					<VoiceRecorder handleUpload={uploadFile} handleSendMessage={handleSendMessage} />
				</Box>
				<Show condition={!!sliceSelectedMessages.length}>
					<Box mt="15px" ml="44px" pl="10px" borderLeft={`solid 2px ${theme.palette.neutral.mediumLight}`} display="flex" justifyContent="space-between" alignItems='center'>
						<Box>
							<Typography color={theme.palette.neutral.main} sx={{ marginBottom: '5px' }}>Forwarded Messages</Typography>
							<Typography
								color="#71aaeb" onClick={() => setShowForwardedMessages(true)}
								sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
							>
								{sliceSelectedMessages.length} messages
							</Typography>
						</Box>
						<Close sx={{ cursor: 'pointer', color: theme.palette.neutral.main }} onClick={handleClearSelectedMessages} />
					</Box>
				</Show>
				<Show condition={imageTypeFiles.length}>
					<ImageList
						sx={{ paddingLeft: '45px' }}
						variant="quilted"
						cols={4}
						rowHeight={121}
					>
						{uploadedFiles.filter(file => imageTypes.includes(file.type)).map((file) => (
							<ImageListItem key={file.url}>
								<img
									src={file.url}
									alt=''
									loading="lazy"
								/>
							</ImageListItem>
						))}
					</ImageList>
				</Show>
				<Show condition={nonImageTypeFiles.length}>
					<Box pl="45px">
						{uploadedFiles.filter(file => !imageTypes.includes(file.type)).map((file) => {
							return (
								<Box display="flex" alignItems="center" gap="10px" mt="10px">
									<ArticleOutlined sx={{ color: theme.palette.neutral.medium }} />
									<Typography color={theme.palette.neutral.main}>{file.name}</Typography>
								</Box>
							)
						})}
					</Box>
				</Show>
			</Box >
			<Dialog
				open={showForwardedMessages}
				onClose={() => setShowForwardedMessages(false)}
				fullWidth={true}
				maxWidth="sm"
				PaperProps={{ style: { borderRadius: '12px', } }}
				sx={{ '.MuiDialogContent-root': { padding: '0', } }}
			>
				<DialogContent>
					<Box>
						<Box padding='15px 20px' backgroundColor={theme.palette.neutral.light} >
							<Box><Typography variant="h6">ForwardedMessages</Typography></Box>
						</Box>
						<Box padding='10px 30px' backgroundColor={theme.palette.background.alt}>
							{sliceSelectedMessages.map((message) => (
								<Box key={message._id}>
									<ForwardedMessage createdAt={message.createdAt} text={message.text}
										firstName={message.fromUserId.firstName} picturePath={message.fromUserId.picturePath}
										userId={message.fromUserId._id} />
									<Show condition={message.forwardedMessages.length}>
										<Box m="10px 0 10px 50px" pl="20px" borderLeft={`solid 2px ${theme.palette.neutral.medium}`}>
											{message.forwardedMessages.map((message) => (
												<ForwardedMessage createdAt={message.createdAt} text={message.text}
													firstName={message.fromUserId.firstName} picturePath={message.fromUserId.picturePath}
													userId={message.fromUserId._id} />
											))}
										</Box>
									</Show>
								</Box>
							))}
						</Box>
						<Box p="10px 20px" backgroundColor={theme.palette.neutral.light} textAlign="end">
							<Button onClick={() => setShowForwardedMessages(false)}
								sx={{ backgroundColor: theme.palette.neutral.mediumLight, color: 'white', borderRadius: '8px' }}>Close</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog >
		</WidgetWrapper >
	)
}

export default DialogWidget