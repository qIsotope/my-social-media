import { Box, Divider, InputBase, useTheme, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import Dialog from 'components/Dialog';

const MessagingWidget = ({ dialogs, unReadMessages }) => {
	const { palette } = useTheme();

	return (
		<Box bgcolor={palette.background.alt} borderRadius="0.75rem">
			<Box p="12px">
				<InputBase
					startAdornment={
						<InputAdornment position="start">
							<Search fontSize='medium' />
						</InputAdornment>
					}
					fullWidth
					placeholder='Search'
				/>
			</Box>
			<Divider sx={{ backgroundColor: '#0A0A0A', height: '10px' }} />
			<Box display="flex" flexDirection="column">
				{dialogs?.map((dialog, index) => (
					<Dialog key={dialog._id} {...dialog} unReadMessages={unReadMessages[index]} />
				))}
			</Box>
		</Box>

	)
}

export default MessagingWidget