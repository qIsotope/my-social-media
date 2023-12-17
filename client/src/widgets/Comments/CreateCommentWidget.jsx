import { Box, Divider, InputAdornment, InputBase, useTheme } from '@mui/material'
import {
	AttachFile,
	Send,
} from "@mui/icons-material";
import FlexBetween from 'components/FlexBetween'
import UserImage from 'components/UserImage'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useCreateCommentMutation } from 'state/service/commentsApi';

export const CreateCommentWidget = ({ postId, parentCommentId, postUserId, name, repliedToId, autofocus, resetCommentInfo }) => {
	const { palette } = useTheme()
	const { user } = useSelector((state) => state.auth)

	const [recipient, setRecipient] = useState('')
	const [value, setValue] = useState('')
	const [createComment] = useCreateCommentMutation()
	useEffect(() => {})

	useEffect(() => {
		const firstName = name?.split(' ')[0];
		setRecipient(firstName ? firstName + ', ' : '')
		setValue(firstName ? firstName + ', ' : '')
	}, [name])

	const haveRecipient = value.startsWith(recipient) ||  recipient.slice(0, -1)
	const sendComment = () => {
		if (!value.replace(recipient, '').length) {
			return
		}
		const body = {
			userId: user._id,
			postId,
			text: value,
			parentCommentId,
			repliedToName: haveRecipient && recipient,
			repliedToId: haveRecipient && repliedToId
			// picturePath, todo
		}
		createComment({ body, postUserId, parentCommentId })
		setValue('');
		setRecipient('');
		name && resetCommentInfo(null)
	}

	return (
		<>
			<FlexBetween width="100%" mt="20px" mb="10px">
				<Box width="100%" display="flex" gap="10px">
					<UserImage image={user.picturePath} size="35px" />
					<FlexBetween
						backgroundColor={palette.neutral.light}
						borderRadius="9px"
						gap="3rem"
						padding="0.1rem 1rem"
						position="relative"
						width="90%"
					>
						<InputBase
							autoFocus={autofocus}
							multiline
							fullWidth
							value={value}
							onChange={(e) => setValue(e.target.value)}
							placeholder='Leave a comment...'
							endAdornment={<InputAdornment position="end"><AttachFile sx={{ cursor: 'pointer', color: palette.neutral.medium, '&:hover': { color: palette.neutral.main } }} /></InputAdornment>}
						/>
					</FlexBetween>
				</Box>
				<Send onClick={() => sendComment()} 
				sx={{ cursor: 'pointer', color: palette.neutral.medium, '&:hover': { color: !!value.replace(recipient, '').length && palette.neutral.main } }} />
			</FlexBetween>
			<Divider />
		</>
	)
}
