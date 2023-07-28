import { Box, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FlexBetween from './FlexBetween'
import { Link } from 'react-router-dom'
import UserImage from './UserImage'

export const SearchedUsers = () => {
	const { palette } = useTheme()
	const [parsedUsers, setParsedUsers] = useState([])
	const users = window.localStorage.getItem('searchedUsers')
	useEffect(() => {
		if (users) setParsedUsers(JSON.parse(users))
	}, [users])

	if (!users) return
	const clearSearchedUsers = () => {
		window.localStorage.removeItem('searchedUsers')
		setParsedUsers([])
	}
	parsedUsers.length = 4;
	return (
		<Box>
			<FlexBetween>
				<Typography variant="h6">
					Recent
				</Typography>
				<Typography sx={{ '&:hover': { color: palette.primary.light }, cursor: 'pointer' }} onClick={clearSearchedUsers} variant="h6">
					Clear
				</Typography>
			</FlexBetween>
			<Box mb="10px" mt="10px" display="flex" gap="10px">
				{parsedUsers.map(user =>
					<Box width="88px" borderRadius="10px" padding="10px" sx={{ '&:hover': { backgroundColor: palette.primary.mediumLight }, cursor: "pointer" }}>
						<Link to={`/profile/${user.id}`}>
							<Box display="flex" flexDirection="column" alignItems="center">
								<UserImage size="55" image={user.picturePath} />
								<Typography>{user.name}</Typography>
							</Box>
						</Link>
					</Box>
				)}
			</Box>
		</Box>
	)
}
