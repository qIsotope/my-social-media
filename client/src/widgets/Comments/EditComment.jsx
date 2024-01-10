import { AttachFile, Send } from '@mui/icons-material';
import { Box, Button, InputAdornment, InputBase, useTheme } from '@mui/material'
import FlexBetween from 'components/FlexBetween';
import UserImage from 'components/UserImage';
import React, { useEffect, useState } from 'react'
import { useUpdateCommentMutation } from 'state/service/commentsApi';

export const EditCommentWidget = ({ currentValue, setIsEdit, userPicturePath, picturePath, id, setIsEditedText, editedText }) => {
	const { palette } = useTheme();
	const [value, setValue] = useState('');
	const [updateComment] = useUpdateCommentMutation()
	useEffect(() => setValue(editedText || currentValue), [currentValue])
	const handleUpdateComment = () => {
		updateComment({
			id,
			body: {
				text: value,
				picturePath,
			}
		})
		setIsEditedText(value)
		setIsEdit(false);
	}
	return (
		<Box width="100%" mt="20px" mb="10px">
			<Box width="100%" display="flex" gap="10px">
				<UserImage image={userPicturePath} size="35px" />
				<FlexBetween
					backgroundColor={palette.neutral.light}
					borderRadius="9px"
					gap="3rem"
					padding="0.1rem 1rem"
					position="relative"
					width="90%"
				>
					<InputBase
						autoFocus
						multiline
						fullWidth
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder='Update a comment...'
						endAdornment={<InputAdornment position="end"><AttachFile sx={{ cursor: 'pointer', color: palette.neutral.medium, '&:hover': { color: palette.neutral.main } }} /></InputAdornment>}
					/>
				</FlexBetween>
			</Box>
			<Box mt="20px" display='flex' gap="20px" justifyContent="flex-end" pr="10px">
				<Button onClick={() => setIsEdit(false)} sx={{ backgroundColor: palette.background.alt, color: palette.neutral.dark }} variant='text'>Cancel</Button>
				<Button onClick={handleUpdateComment} sx={{ backgroundColor: palette.neutral.mediumMain, color: palette.neutral.light }} variant="contained">Save</Button>
			</Box>
		</Box>
	)
}
