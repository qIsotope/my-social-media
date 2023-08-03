import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

export const ImageModal = ({open, handleClose, imageUrl}) => {
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogContentText>
				<img src={imageUrl} alt="Зображення" style={{ width: '100%', height: '100%' }} />
			</DialogContentText>
		</Dialog>
	)
}
