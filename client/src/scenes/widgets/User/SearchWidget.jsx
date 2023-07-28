import { Search } from '@mui/icons-material'
import { Box, IconButton, InputBase, useTheme, Popper, Typography } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import { useDebounce } from 'hooks/useDebounce'
import React, { useEffect, useRef, useState } from 'react'
import { FriendListWidget } from './FriendListWidget'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import WidgetWrapper from 'components/WidgetWrapper'
import { useLocation } from 'react-router-dom'
import { useLazySearchUserByQuery } from 'state/service/userApi'

export const SearchWidget = () => {
	const { palette } = useTheme();
	const neutralLight = palette.neutral.light;
	const location = useLocation()
	const popperAnchor = useRef(null)
	const popper = useRef(null)
	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);
	const debauncedValue = useDebounce(value, 200);
	const [fetchData, { data, loading }] = useLazySearchUserByQuery()

	useEffect(() => setOpen(false), [location.pathname])

	const handleClickOutside = () => {
		setOpen(false)
	}
	useOnClickOutside([popper, popperAnchor], handleClickOutside)

	const getUsers = async () => await fetchData(debauncedValue)

	useEffect(() => {
		if (open) {
			getUsers()
		}
	}, [debauncedValue, open])

	const handleOnChange = (e) => {
		setValue(e.target.value)
		setOpen(true)
	}

	return (
		<FlexBetween
			backgroundColor={neutralLight}
			borderRadius="9px"
			gap="3rem"
			padding="0.1rem 1rem"
			position="relative"
			ref={popperAnchor}
			onClick={() => setOpen(true)}
		>
			<InputBase value={value} onChange={handleOnChange} placeholder='Search...' />
			<IconButton>
				<Search />
			</IconButton>
			<Popper ref={popper} open={open} anchorEl={popperAnchor.current} placement='bottom-start'>
				<Box position="absolute" top="10px" width="400px">
					{!value.length && !data?.length
						? <WidgetWrapper backgroundColor={palette.neutral.light}>
							<Typography pl="20px" mb="10px" variant="h5">Who are we looking for?</Typography>
						</WidgetWrapper>
						: <>
							<FriendListWidget friends={data} search loading={loading} />
						</>
					}
				</Box>
			</Popper>
		</FlexBetween>
	)
}