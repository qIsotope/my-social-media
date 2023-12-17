import { Search } from '@mui/icons-material'
import { Box, IconButton, InputBase, useTheme, Popper, Typography } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import { useDebounce } from 'hooks/useDebounce'
import React, { useEffect, useRef, useState } from 'react'
import { FriendList } from '../Friends/FriendList'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import WidgetWrapper from 'components/WidgetWrapper'
import { useLocation } from 'react-router-dom'
import { useLazySearchUserByQuery } from 'state/service/userApi'
import { useSelector } from 'react-redux'

export const SearchWidget = () => {
	const { palette } = useTheme();
	const neutralLight = palette.neutral.light;
	const { refs } = useSelector(state => state.auth)
	const location = useLocation()
	const popperAnchor = useRef(null)
	const popper = useRef(null)
	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);
	const debauncedValue = useDebounce(value, 200);
	const [fetchData, { data, loading }] = useLazySearchUserByQuery()

	const handleClickOutside = () => setOpen(false);
	useOnClickOutside([...refs, popper, popperAnchor], handleClickOutside)

	useEffect(() => setOpen(false), [location.pathname])


	const getUsers = async (value) => await fetchData(value);

	useEffect(() => {
		if (open && debauncedValue.length) {
			getUsers(debauncedValue)
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
							<WidgetWrapper backgroundColor={palette.neutral.light}>
								<FriendList friends={data} search loading={loading} title="People" />
							</WidgetWrapper>
						</>
					}
				</Box>
			</Popper>
		</FlexBetween>
	)
}