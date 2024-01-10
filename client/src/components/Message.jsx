import { Box, ImageList, ImageListItem, Slider, Typography, useTheme } from '@mui/material'
import { ArticleOutlined, CheckCircleOutlined, PlayCircleOutline, PauseCircleOutlined } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react'
import UserImage from './UserImage'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useIntersectionObserver } from 'hooks/useIntersection';
import Show from './Show';
import ForwardedMessage from './ForwardedMessage';
import { useDeleteRestoreMessagesMutation } from 'state/service/messagingApi';

const imageTypes = ['jpeg', 'png', 'gif', 'jpg', 'svg'];
const audioTypes = ['mp3'];

const Message = ({
	picturePath, firstName, createdAt, text, unRead,
	fromUserId, firstUnreadMessageRef, setLastViewedMessage,
	id, setSelectedMessages, selectedMessages, forwardedMessages,
	isDeletedFor, limit, attachments,
}) => {
	const theme = useTheme();
	const { user } = useSelector(state => state.auth);
	const formattedDate = moment(createdAt).format('LT');
	const messageRef = useRef(null);
	const audioRef = useRef(null);
	const [isMessageHovered, setIsMessageHovered] = useState(false);
	const [deleteRestoreMessages, { }] = useDeleteRestoreMessagesMutation()
	const [currentTime, setCurrentTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(0);

	const entry = useIntersectionObserver(messageRef, true);

	useEffect(() => {
		if (unRead && fromUserId !== user._id && entry?.isIntersecting) {
			setLastViewedMessage(id);
		}
	}, [entry]);

	const handleSelectMessage = () => {
		if (selectedMessages.some(message => message._id === id)) {
			setSelectedMessages(selectedMessages.filter(message => message._id !== id));
		} else {
			setSelectedMessages([...selectedMessages, {
				_id: id,
				fromUserId: {
					_id: fromUserId,
					firstName,
					picturePath
				},
				text,
				createdAt,
				forwardedMessages,
			}]);
		}
	}

	const getBackgroundColor = () => {
		if (isMessageSelected) return theme.palette.background.mediumLight;
		if (unRead) return theme.palette.background.light;
		return ''
	}

	const isMessageSelected = selectedMessages.some(message => message._id === id);

	const nonImageTypeFiles = attachments.filter(file => !imageTypes.includes(file.type) && !audioTypes.includes(file.type));
	const imageTypeFiles = attachments.filter(file => imageTypes.includes(file.type))
	const audioTypeFiles = attachments.filter(file => audioTypes.includes(file.type))

	const handlePauseVoiceMessage = (e) => {
		e.stopPropagation();
		audioRef.current.pause();
	}
	const handleStartVoiceMessage = (e) => {
		e.stopPropagation();
		audioRef.current.play();
	}

	return (
		<>
			<Show condition={isDeletedFor.includes(user._id)}>
				<Box bgcolor={theme.palette.background.light} mt="5px" mb="5px" p="5px 20px 5px 70px" display="flex" gap="5px">
					<Typography color={theme.palette.neutral.mediumMain} sx={{ fontSize: '14px', fontWeight: '400' }}>Message deleted.</Typography>
					<Typography
						onClick={() => deleteRestoreMessages({ messageIds: [id], limit })}
						color={theme.palette.neutral.dark}
						sx={{ fontSize: '14px', fontWeight: '400', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
					>
						Undo
					</Typography>
				</Box>
			</Show>
			<Show condition={!isDeletedFor.includes(user._id)}>
				<Box
					ref={firstUnreadMessageRef}
					onMouseOver={() => setIsMessageHovered(true)}
					onMouseLeave={() => setIsMessageHovered(false)}
					onClick={(e) => handleSelectMessage()}
					bgcolor={getBackgroundColor()}
					borderRadius="3px"
					mb="10px" mt="10px" pl="5px" pb="1px"
					sx={{ cursor: 'pointer' }}
				>
					<Box
						ref={unRead && fromUserId !== user._id ? messageRef : null}
						padding="7px"
						display="flex" gap="15px" alignItems="center"
					>
						<Box mr="15px" pt="4px" sx={{ opacity: isMessageHovered || isMessageSelected ? 1 : 0, transition: 'opacity 0.2s ease' }}>
							<CheckCircleOutlined />
						</Box>
						<UserImage size="40px" image={picturePath} />
						<Box alignSelf="start">
							<Box display="flex" gap="20px" alignItems="center">
								<Typography color={theme.palette.neutral.main} sx={{ fontSize: '14px', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}>
									{firstName}
								</Typography>
								<Typography color={theme.palette.neutral.medium} sx={{ fontSize: '11px', fontWeight: '400' }}>{formattedDate}</Typography>
							</Box>
							<Typography fontWeight={400} color={theme.palette.neutral.mediumMain}>{text}</Typography>
						</Box>
					</Box>
					<Show condition={forwardedMessages.length}>
						<Box m="10px 0 10px 110px" pl="20px" borderLeft={`solid 2px ${theme.palette.neutral.medium}`}>
							{forwardedMessages.map((message) => (
								<ForwardedMessage createdAt={message.createdAt} text={message.text}
									firstName={message.fromUserId.firstName} picturePath={message.fromUserId.picturePath}
									userId={message.fromUserId._id} />
							))}
						</Box>
					</Show>
					<Show condition={imageTypeFiles.length}>
						<ImageList
							sx={{ paddingLeft: '110px' }}
							variant="quilted"
							cols={4}
							rowHeight={121}
						>
							{attachments.filter(file => imageTypes.includes(file.type)).map((file) => (
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
						<Box pl="105px" mb="10px">
							{attachments.filter(file => !imageTypes.includes(file.type)).map((file) => {
								return (
									<Box display="flex" alignItems="center" gap="10px" mt="10px"
										sx={{ '&:hover': { textDecoration: 'underline' } }}
										onClick={() => window.open(file.url, '_blank')}
									>
										<ArticleOutlined sx={{ color: theme.palette.neutral.medium }} />
										<Typography color={theme.palette.neutral.main}>{file.name}</Typography>
									</Box>
								)
							})}
						</Box>
					</Show>
					<Show condition={audioTypeFiles.length}>
						<Box mt={!text && "-10px"} pl="110px" mb="10px">
							{attachments.filter(file => audioTypes.includes(file.type)).map((file) => {
								const duration = moment((+file.duration).toFixed() * 1000).format('m:ss');
								const currentTimeFormatted = moment(currentTime.toFixed() * 1000).format('m:ss');
								return (
									<Box display="flex" alignItems="center" gap="20px" pr="60px">
										<Show condition={!isPlaying}>
											<PlayCircleOutline onClick={(e) => handleStartVoiceMessage(e)} fontSize='large' sx={{ color: theme.palette.neutral.medium }} />
										</Show>
										<Show condition={isPlaying}>
											<PauseCircleOutlined onClick={(e) => handlePauseVoiceMessage(e)} fontSize='large' sx={{ color: theme.palette.neutral.medium }} />
										</Show>
										{currentTimeFormatted}
										<Slider
											value={currentTime}
											color={'neutral'}
											min={0}
											step={1}
											max={file.duration}
											onChange={(_, value) => {
												audioRef.current.currentTime = value
											}}
											onClick={(e) => e.stopPropagation()}
										/>
										{duration}
										<audio ref={audioRef} hidden controls onEnded={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
											onTimeUpdate={e => setCurrentTime(e.target.currentTime)} src={file.url} />
									</Box>
								)
							})}
						</Box>
					</Show>
				</Box>
			</Show>
		</>
	)
}

export default Message