import { Box, useTheme } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper'
import React from 'react'

const WidgetOptions = ({ optionsLabels, activeOption, setActiveOption }) => {
	const theme = useTheme()
	return (
		<WidgetWrapper>
			<Box display="flex" flexDirection="column" gap="10px" p="5px 0 10px" fontSize="15px">
				{optionsLabels.map((label, index) => (
					<Box onClick={() => setActiveOption(index)}
						borderRadius="10px"
						p="10px 10px" key={label}
						bgcolor={index === activeOption && theme.palette.neutral.light}
						sx={{ cursor: 'pointer' }}
					>
						{label}
					</Box>
				))}
			</Box>
		</WidgetWrapper>
	)
}

export default WidgetOptions