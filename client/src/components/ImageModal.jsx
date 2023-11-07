import { Button, Dialog, DialogActions, DialogContentText } from '@mui/material'
import React from 'react'

export const ImageModal = ({ open, handleClose, imageUrl }) => {
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogContentText sx={{ overflowY: 'hidden' }}>
				<img src={imageUrl} alt="image" style={{ width: '100%', height: '100%' }} />
			</DialogContentText>
		</Dialog>
	)
}
