import { Close } from '@mui/icons-material'
import { Box, Dialog, DialogContent, IconButton, Typography, useTheme, TextField, Button } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import UserImage from './UserImage'
import { Link } from 'react-router-dom'
import { updateRefs } from 'state/slices/auth';
import { useDispatch, useSelector } from 'react-redux'
import { useSendMessageMutation } from 'state/service/messagingApi'

export const SendMessage = ({ open, handleClose, user }) => {
	const { user: accountUser } = useSelector(state => state.auth)
	const [sendMessage, {isSuccess}] = useSendMessageMutation()
	const [messageText, setMessageText] = useState('')
	const dispatch = useDispatch()
	const ref = useCallback(ref => {
		if (ref) {
			dispatch(updateRefs({ current: ref }))
		}
		return { current: ref }
	}, [])

	const handleSendMessage = () => {
		sendMessage({
			toUserId: user.id,
			fromUserId: accountUser._id,
			text: messageText,
		})
	};

	useEffect(() => {
		if (isSuccess) {
			setMessageText('');
			handleClose();
		}
	}, [isSuccess])

	const theme = useTheme()
	return (
		<Dialog
			ref={ref}
			open={open}
			onClose={handleClose}
			fullWidth={true}
			maxWidth="sm"
			PaperProps={{ style: { borderRadius: '12px', } }}
			sx={{ '.MuiDialogContent-root': { padding: '0', } }}
		>
			<DialogContent>
				<Box>
					<Box padding='10px 20px 10px 20px' display="flex" justifyContent="space-between"
						alignItems="center" backgroundColor={theme.palette.neutral.light} >
						<Box><Typography variant="h6">New Message</Typography></Box>
						<Box display="flex" gap="15px" alignItems="center">
							<Box sx={{ ':hover': { cursor: 'pointer', textDecoration: 'underline' } }}>
								<Typography variant='body1'>Open Full Chat with {user.firstName}</Typography>
							</Box>
							<Box>
								<IconButton onClick={() => handleClose()}>
									<Close />
								</IconButton>
							</Box>
						</Box>
					</Box>
					<Box padding='20px' backgroundColor={theme.palette.background.alt}>
						<Box display='flex' gap="10px" marginBottom="20px">
							<Link to={'/profile/' + user._id}>
								<UserImage size="50px" image={user.picturePath} />
							</Link>
							<Link to={'/profile/' + user._id}>
								<Typography sx={{
									"&:hover": {
										textDecoration: 'underline',
										cursor: "pointer",
									},
								}}>
									{user.firstName}
								</Typography>
							</Link>
						</Box>
						<Box marginBottom="20px">
							<TextField value={messageText} onChange={(e) => setMessageText(e.target.value)} multiline rows={5}
								fullWidth sx={{ backgroundColor: theme.palette.neutral.light, }} />
						</Box>
						<Box textAlign="end">
							<Button onClick={handleSendMessage}
								sx={{ backgroundColor: theme.palette.neutral.mediumLight, color: 'white', borderRadius: '8px' }}>Send</Button>
						</Box>
					</Box>
				</Box>
			</DialogContent>
		</Dialog >
	)
}
