import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import HomePage from 'scenes/HomePage/HomePage';
import LoginPage from 'scenes/LoginPage/LoginPage';
import ProfilePage from 'scenes/ProfilePage/ProfilePage';
import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useAuthMeQuery } from 'state/service/userApi'
import { NotificationsWidget } from 'scenes/widgets/Notifications/NotificationsWidget';
import { socket } from 'socket';

function App() {
	const { mode, user, error } = useSelector(state => state.auth)
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const navigate = useNavigate()
	const { } = useAuthMeQuery(undefined, {
		skip: !localStorage.getItem('token')
	})
	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/')
		}
	}, [])

	useEffect(() => {
		if (Object.keys(user).length) {
			socket.emit('add-user', user._id)
		}
		return () => {
			console.log('return')
			socket.emit('remove-user', user._id)
		}
	}, [user])

	return (
		<div className="app">
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/profile/:id" element={<ProfilePage />} />
				</Routes>
				<NotificationsWidget />
			</ThemeProvider>
		</div>
	);
}

export default App;
