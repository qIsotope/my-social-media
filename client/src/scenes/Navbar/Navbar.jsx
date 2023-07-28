import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout as logoutAction, setMode } from 'state/slices/auth';
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import {
	IconButton,
	InputBase,
	Typography,
	Select,
	MenuItem,
	FormControl,
	useTheme,
} from "@mui/material";

import {
	Message,
	DarkMode,
	LightMode,
	Notifications,
	Help,
} from "@mui/icons-material";
import FlexBetween from 'components/FlexBetween';
import { SearchWidget } from 'scenes/widgets/User/SearchWidget';

export default function Navbar() {
	const theme = useTheme();
	const { mode, user } = useSelector(state => state.auth)
	const neutralLight = theme.palette.neutral.light;
	const dark = theme.palette.neutral.dark;
	const primaryLight = theme.palette.primary.light;
	const alt = theme.palette.background.alt;
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const logout = () => {
		dispatch(logoutAction());
		navigate('/')
	}

	const fullName = user.firstName + ' ' + user.lastName;

	return (
		<FlexBetween padding="1rem 6%" backgroundColor={alt}>
			<FlexBetween gap="1.75rem">
				<Link to="/home">
					<Typography
						fontWeight="bold"
						fontSize="clamp(1rem, 2rem, 2.25rem)"
						color="primary"
						sx={{
							"&:hover": {
								color: primaryLight,
								cursor: "pointer",
							},
						}}>
						Sociopedia
					</Typography>
				</Link>
				<SearchWidget />
			</FlexBetween>
			<FlexBetween gap="2rem">
				<IconButton onClick={() => dispatch(setMode())}>
					{mode === 'light' ? <LightMode sx={{ fontSize: "25px", color: dark }} /> : <DarkMode ssx={{ fontSize: "25px", color: dark }} />}
				</IconButton>
				<IconButton>
					<Message sx={{ fontSize: "25px", color: dark }} />
				</IconButton>
				<IconButton>
					<Notifications sx={{ fontSize: "25px", color: dark }} />
				</IconButton>
				<IconButton>
					<Help sx={{ fontSize: "25px", color: dark }} />
				</IconButton>
				<FormControl variant="standard" value={fullName}>
					<Select
						value={fullName}
						sx={{
							backgroundColor: neutralLight,
							width: "150px",
							borderRadius: "0.25rem",
							p: "0.25rem 1rem",
							"& .MuiSvgIcon-root": {
								pr: "0.25rem",
								width: "3rem",
							},
							"& .MuiSelect-select:focus": {
								backgroundColor: neutralLight,
							},
						}}
						input={<InputBase />}
					>
						<MenuItem value={fullName}>
							<Link to={`/profile/${user._id}`}>
								<Typography>{fullName}</Typography>
							</Link>
						</MenuItem>
						<MenuItem onClick={logout}>Log Out</MenuItem>
					</Select>
				</FormControl>
			</FlexBetween>
		</FlexBetween>
	)
}
