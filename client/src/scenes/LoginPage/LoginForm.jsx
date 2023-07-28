import React, { useEffect } from 'react'
import {
	Box,
	Button,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from 'state/service/userApi';
import { errorHandler } from './errorHandler';

const initialValuesLogin = {
	email: "",
	password: "",
};

const loginSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
});


export default function Form({ setPageType, setError }) {
	const { palette } = useTheme();
	const { token } = useSelector(state => state.auth)
	const navigate = useNavigate()
	const [login, { isLoading, isFetching, isError, error }] = useLoginMutation()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: initialValuesLogin,
		resolver: yupResolver(loginSchema),
	})

	const onSubmit = async (data) => {
		await login(data)
	}
	useEffect(() => {
		if (isError) {
			setError(errorHandler(error.status))
		}
	}, [error, isError])

	useEffect(() => {
		if (window.localStorage.getItem('token')) {
			navigate('/home')
			reset()
		}
	}, [window.localStorage.getItem('token')])

	return (
		<>
			<Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
				<TextField
					label="Email"
					sx={{ gridColumn: "span 4" }}
					{...register("email")}
					helperText={errors.email?.message}
					error={errors.email}
				/>
				<TextField
					label="Password"
					sx={{ gridColumn: "span 4" }}
					{...register("password")}
					helperText={errors.password?.message}
					error={errors.password}
				/>
			</Box>
			<Box>
				<Button
					fullWidth
					type="submit"
					sx={{
						m: "2rem 0",
						p: "1rem",
						backgroundColor: palette.primary.main,
						color: palette.background.alt,
						"&:hover": { color: palette.primary.main },
					}}
					onClick={handleSubmit(onSubmit)}
					disabled={isLoading || isFetching}
				>
					{isLoading || isFetching ? 'Loading ...' : "Login"}
				</Button>
				<Typography
					onClick={() => {
						setPageType("register")
						reset()
					}}
					sx={{
						textDecoration: "underline",
						color: palette.primary.main,
						"&:hover": {
							cursor: "pointer",
							color: palette.primary.light,
						},
					}}
				>
					Don't have an account? Sign Up here.
				</Typography>
			</Box>
		</>
	)
}
