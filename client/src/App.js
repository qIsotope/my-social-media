import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from 'pages/HomePage/HomePage';
import LoginPage from 'pages/LoginPage/LoginPage';
import ProfilePage from 'pages/ProfilePage/ProfilePage';
import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useAuthMeQuery } from 'state/service/userApi'
import { NotificationsStreamWidget } from 'widgets/Notifications/NotificationStream/NotificationsStream';
import { socket } from 'socket';
import Show from 'components/Show';
import PostPreview from 'pages/PostPreview/PostPreview';
import Navbar from 'widgets/Navbar/Navbar';
import NotificationPage from 'pages/NotificationPage/NotificationPage';
import MessagingPage from 'pages/MessagingPage/MessagingPage';
import DialogPage from 'pages/DialogPage/DialogPage';

function App() {
	const { mode, user } = useSelector(state => state.auth)
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const navigate = useNavigate()
	const location = useLocation()
	const {error} = useAuthMeQuery(undefined, {
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
		if (error) navigate('/')
	}, [user, error])

	useEffect(() => {
		const pageTitle = location.pathname.split('/')[1]
		if (pageTitle !== 'profile') {
			document.title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
		}
	}, [location.pathname])

	return (
		<div className="app">
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Show condition={location.pathname !== '/'}><Navbar /></Show>
				<Routes>
					<Route path="/" element={<LoginPage error={error} />} />
					<Route path="/home/post?/:postPreviewId?" element={<HomePage />} />
					<Route path="/profile/:id/post?/:postPreviewId?" element={<ProfilePage />} />
					<Route path="/notifications/post?/:postPreviewId?" element={<NotificationPage />} />
					<Route path="/messaging/post?/:postPreviewId?" element={<MessagingPage />} />
					<Route path="/dialogs/:dialogId" element={<DialogPage />} />
				</Routes>
				<NotificationsStreamWidget />
				<PostPreview />
			</ThemeProvider>
		</div>
	);
}

export default App;
