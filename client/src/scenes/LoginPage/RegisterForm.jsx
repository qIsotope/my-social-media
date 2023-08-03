import React, { useEffect } from 'react'
import {
	Box,
	Button,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRegisterMutation } from 'state/service/userApi';
import { errorHandler } from './errorHandler';

const initialValuesRegister = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	location: "",
	occupation: "",
};

const registerSchema = yup.object().shape({
	firstName: yup.string().required("required"),
	lastName: yup.string().required("required"),
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
	location: yup.string().required("required"),
	occupation: yup.string().required("required"),
	picture: yup.string(),
});

export default function Form({ setPageType, setError, setSuccess }) {
	const { palette } = useTheme();
	const [fetchRegisterUser, { isSuccess, isError, error, isFetching, isLoading }] = useRegisterMutation();
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: initialValuesRegister,
		resolver: yupResolver(registerSchema),
	})
	const values = getValues();
	
	const registerUser = async (data) => {
		await fetchRegisterUser(data);
	}

	useEffect(() => {
		if (isSuccess) { 
			setSuccess(true)
			setPageType('login') 
		};
		if (isError) setError(errorHandler(error.status))
	}, [isSuccess, isError, error])

	const onSubmit = async (data) => {
		const formData = new FormData();
		for (let value in data) {
			formData.append(value, data[value]);
		}
		formData.append("picture", values.picture);
		formData.append("picturePath", values.picture?.name || '');
		registerUser(formData);
	}

	return (
		<>
			<Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
				<TextField
					label="First Name"
					sx={{ gridColumn: "span 2" }}
					{...register("firstName")}
					helperText={errors.firstName?.message}
					error={errors.firstName}
				/>
				<TextField
					label="Last Name"
					sx={{ gridColumn: "span 2" }}
					{...register("lastName")}
					helperText={errors.lastName?.message}
					error={errors.lastName}
				/>
				<TextField
					label="Location"
					sx={{ gridColumn: "span 2" }}
					{...register("location")}
					helperText={errors.location?.message}
					error={errors.location}
				/>
				<TextField
					label="Occupation"
					sx={{ gridColumn: "span 2" }}
					{...register("occupation")}
					helperText={errors.occupation?.message}
					error={errors.occupation}
				/>
				<Box
					gridColumn="span 4"
					border={`1px solid ${palette.neutral.medium}`}
					borderRadius="5px"
					p="1rem"
				>
					<Dropzone
						// acceptedFiles=".jpg,.jpeg,.png"
						multiple={false}
						onDrop={(acceptedFiles) => {
							setValue("picture", acceptedFiles[0], { shouldValidate: true })
						}}
					>
						{({ getRootProps, getInputProps }) => (
							<Box
								{...getRootProps()}
								border={`2px dashed ${palette.primary.main}`}
								p="1rem"
								sx={{ "&:hover": { cursor: "pointer" } }}
							>
								<input {...getInputProps()} />
								{!values.picture ? (
									<p>Add Picture Here</p>
								) : (
									<FlexBetween>
										<Typography>{values.picture.name}</Typography>
										<EditOutlinedIcon />
									</FlexBetween>
								)}
							</Box>
						)}
					</Dropzone>
				</Box>
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
					{isLoading || isFetching ? 'Loading ...' : 'Register'}
				</Button>
				<Typography
					onClick={() => {
						setPageType("login")
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
					Already have an account? Login here.
				</Typography>
			</Box>
		</>
	)
}
