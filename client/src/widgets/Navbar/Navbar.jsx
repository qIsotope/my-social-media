import React, { useRef, useState } from 'react'
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
	Badge,
} from "@mui/material";

import {
	Message,
	DarkMode,
	LightMode,
	Notifications,
	Help,
} from "@mui/icons-material";
import FlexBetween from 'components/FlexBetween';
import { SearchWidget } from 'widgets/User/SearchWidget';
import NotificationsWindow from 'widgets/Notifications/NotificationWindow/NotificationsWindow';

export default function Navbar() {
	const theme = useTheme();
	const { mode, user } = useSelector(state => state.auth)
	const neutralLight = theme.palette.neutral.light;
	const dark = theme.palette.neutral.dark;
	const primaryLight = theme.palette.primary.light;
	const alt = theme.palette.background.alt;
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const notificationIcon = useRef(null);
	const [open, setOpen] = useState(false)

	const logout = () => {
		dispatch(logoutAction());
		navigate('/')
	}

	const name = user.firstName || '';

	return (
		<FlexBetween padding="1rem 6%" width="100%" position="fixed" zIndex="100" backgroundColor={alt}>
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
				<IconButton onClick={() => navigate('/messaging')}>
					<Message sx={{ fontSize: "25px", color: dark }} />
				</IconButton>
				<IconButton onClick={() => setOpen(!open)} ref={notificationIcon}>
					<Badge badgeContent={user.notificationsCount} color="error">
						<Notifications sx={{ fontSize: "25px", color: dark }} />
					</Badge>
				</IconButton>
				{open && <NotificationsWindow anchorRef={notificationIcon} open={open} setOpen={setOpen} />}
				<IconButton>
					<Help sx={{ fontSize: "25px", color: dark }} />
				</IconButton>
				<FormControl variant="standard" value={name}>
					<Select
						value={name}
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
						defaultValue='name'
						input={<InputBase />}
					>
						<MenuItem value={name}>
							<Link to={`/profile/${user._id}`}>
								<Typography>{name}</Typography>
							</Link>
						</MenuItem>
						<MenuItem value="logout" onClick={logout}>Log Out</MenuItem>
					</Select>
				</FormControl>
			</FlexBetween>
		</FlexBetween>
	)
}
