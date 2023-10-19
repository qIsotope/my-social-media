import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
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
import { NotificationsStreamWidget } from 'scenes/widgets/Notifications/NotificationStream/NotificationsStreamWidget';
import { socket } from 'socket';
import Show from 'components/Show';
import PostPreview from 'scenes/PostPreview/PostPreview';
import Navbar from 'scenes/Navbar/Navbar';
import NotificationPage from 'scenes/NotificationPage/NotificationPage';

function App() {
	const { mode, user, error } = useSelector(state => state.auth)
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const navigate = useNavigate()
	const location = useLocation()
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
	}, [user])

	return (
		<div className="app">
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Show condition={location.pathname !== '/'}><Navbar /></Show>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/home/post?/:postPreviewId?" element={<HomePage />} />
					<Route path="/profile/:id/post?/:postPreviewId?" element={<ProfilePage />} />
					<Route path="/notifications/post?/:postPreviewId?" element={<NotificationPage />} />
				</Routes>
				<NotificationsStreamWidget />
				<PostPreview />
			</ThemeProvider>
		</div>
	);
}

export default App;
