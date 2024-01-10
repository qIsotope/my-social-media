import { ArrowBackIosOutlined, MoreHorizOutlined, Close, DeleteOutlineOutlined } from '@mui/icons-material'
import { Box, Button, Tooltip, Typography, useTheme } from '@mui/material'
import Show from 'components/Show'
import UserImage from 'components/UserImage'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteRestoreMessagesMutation } from 'state/service/messagingApi'
import { setToSliceSelectedMessages } from 'state/slices/messaging'

const DialogHeaderBarWidget = ({ image, name, selectedMessages, setSelectedMessages, limit }) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [deleteRestoreMessages, { }] = useDeleteRestoreMessagesMutation()

	const handleForwardMessages = () => {
		dispatch(setToSliceSelectedMessages(selectedMessages))
		navigate('/messaging')
	}

	const handleReplyMessages = () => {
		dispatch(setToSliceSelectedMessages(selectedMessages))
		setSelectedMessages([])
	}

	const handleDeleteRestoreMessages = () => {
		deleteRestoreMessages({ messageIds: selectedMessages.map(message => message._id), limit: limit })
		setSelectedMessages([])
	}

	return (
		<Box height="42px" mt="-10px" paddingBottom="10px">
			<Show condition={!!selectedMessages.length}>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Box display="flex" alignItems="center" gap="10px">
						<Typography>{selectedMessages.length} messages</Typography>
						<Close sx={{ cursor: 'pointer' }} onClick={() => setSelectedMessages([])} fontSize='small' />
					</Box>
					<Box display="flex" gap="15px" alignItems="center">
						<Tooltip title="Delete" placement="top">
							<DeleteOutlineOutlined onClick={handleDeleteRestoreMessages} fontSize='large' sx={{ color: theme.palette.neutral.main, cursor: "pointer" }} />
						</Tooltip>
						<Button
							onClick={handleReplyMessages}
							sx={{ backgroundColor: theme.palette.neutral.mediumLight, color: 'white', borderRadius: '8px' }}
						>
							Reply
						</Button>
						<Button
							onClick={handleForwardMessages}
							sx={{ backgroundColor: theme.palette.neutral.mediumLight, color: 'white', borderRadius: '8px' }}
						>
							Forward
						</Button>
					</Box>
				</Box>
			</Show>
			<Show condition={!!!selectedMessages.length}>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Link to='/messaging'>
						<Box display="flex" alignItems="center" gap="10px">
							<ArrowBackIosOutlined />
							<Typography>Back</Typography>
						</Box>
					</Link>
					<Box>
						<Typography>{name}</Typography>
					</Box>
					<Box display="flex" alignItems="center" gap="30px">
						<MoreHorizOutlined fontSize='large' />
						<UserImage image={image} size="32px" />
					</Box>
				</Box>
			</Show>
		</Box>
	)
}

export default DialogHeaderBarWidget