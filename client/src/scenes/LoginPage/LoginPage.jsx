import React, { useEffect, useState } from 'react'
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage({ error: authError }) {
	const [pageType, setPageType] = useState('login')
	const { theme: appTheme } = useSelector(state => state.auth)
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const isLogin = pageType === 'login'
	const theme = useTheme()

	useEffect(() => {
		if (error) {
			toast.error(error)
			setError('');
		}
		if (success) {
			toast.success('User has been created')
		}
	}, [error, success])

	useEffect(() => {
		document.title = "Login"
	}, [])

	return (
		<Box>
			<Box
				backgroundColor={theme.palette.background.alt}
				width="100%"
				textAlign="center"
				p="1rem 6%"
			>
				<Typography fontWeight="bold" fontSize="32px" color="primary">
					Sociopedia
				</Typography>
			</Box>
			<Box
				margin="3rem auto"
				backgroundColor={theme.palette.background.alt}
				borderRadius="1.5rem"
				width="50%"
				padding="2rem"
			>
				<Typography fontWeight="500" variant="h5" marginBottom="1.5rem">
					Welcome to Socipedia, the Social Media for Sociopaths!
				</Typography>
				<Box>
					{isLogin
						? <LoginForm setPageType={setPageType} setError={setError} authError={authError} />
						: <RegisterForm setPageType={setPageType} setError={setError} setSuccess={setSuccess} />}
				</Box>
			</Box>
			<ToastContainer
				position="bottom-right"
				autoClose={2000}
				theme={appTheme}
			/>
		</Box>
	)
}
