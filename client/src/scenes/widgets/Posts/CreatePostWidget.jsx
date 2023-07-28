import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone from "react-dropzone";
import {
	Box,
	Typography,
	useTheme,
	Divider,
	InputBase,
	Button,
} from "@mui/material";
import {
	EditOutlined,
	AttachFileOutlined,
	GifBoxOutlined,
	ImageOutlined,
	MicOutlined,
} from "@mui/icons-material";

import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useCreatePostMutation } from 'state/service/postsApi';

const CreatePostWidget = () => {
	const { user } = useSelector(state => state.auth)
	const [createPost, {isLoading, isFetching}] = useCreatePostMutation()
	const [isAttachFile, setIsAttachFile] = useState(false);
	const [picture, setPicture] = useState(null)
	const [description, setDescription] = useState('')
	const theme = useTheme();
	const medium = theme.palette.neutral.medium;
	const mediumMain = theme.palette.neutral.mediumMain;

	const sendPost = () => {
		const formData = new FormData();
		formData.append('description', description);
		formData.append('picture', picture);
		formData.append('userId', user._id)
		formData.append('picturePath', picture ? picture.name : '')
		setPicture(null)
		setDescription('')
		setIsAttachFile(false)
		createPost(formData);
	}
	return (
		<WidgetWrapper>
			<FlexBetween gap="1.5rem">
				<UserImage image={user.picturePath} />
				<InputBase
					placeholder="What's on your mind..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					sx={{
						width: "100%",
						backgroundColor: theme.palette.neutral.light,
						borderRadius: "2rem",
						padding: "1rem 2rem",
					}}
				/>
			</FlexBetween>
			{isAttachFile && (
				<Box
					border={`1px solid ${medium}`}
					borderRadius="5px"
					mt="1rem"
					p="1rem"
				>
					<Dropzone
						acceptedFiles=".jpg,.jpeg,.png"
						multiple={false}
						onDrop={(acceptedFiles) => setPicture(acceptedFiles[0])}
					>
						{({ getRootProps, getInputProps }) => (
							<FlexBetween>
								<Box
									{...getRootProps()}
									border={`2px dashed ${theme.palette.primary.main}`}
									p="1rem"
									width="100%"
									sx={{ "&:hover": { cursor: "pointer" } }}
								>
									<input {...getInputProps()} />
									{!picture ? (
										<p>Add Image Here</p>
									) : (
										<FlexBetween>
											<Typography>{picture?.name}</Typography>
											<EditOutlined />
										</FlexBetween>
									)}
								</Box>
							</FlexBetween>
						)}
					</Dropzone>
				</Box>
			)}

			<Divider sx={{ margin: "1.25rem 0" }} />
			<FlexBetween>
				<FlexBetween gap="0.25rem" sx={{ cursor: 'pointer' }} onClick={() => setIsAttachFile(!isAttachFile)}>
					<ImageOutlined sx={{ color: mediumMain }} />
					<Typography
						color={mediumMain}
						sx={{ "&:hover": { cursor: "pointer", color: medium } }}
					>
						Image
					</Typography>
				</FlexBetween>
				<FlexBetween gap="0.25rem">
					<GifBoxOutlined sx={{ color: mediumMain }} />
					<Typography
						color={mediumMain}
						sx={{ "&:hover": { cursor: "pointer", color: medium } }}
					>
						Clip
					</Typography>
				</FlexBetween>
				<FlexBetween gap="0.25rem">
					<AttachFileOutlined sx={{ color: mediumMain }} />
					<Typography
						color={mediumMain}
						sx={{ "&:hover": { cursor: "pointer", color: medium } }}
					>
						Attachment
					</Typography>
				</FlexBetween>
				<FlexBetween gap="0.25rem">
					<MicOutlined sx={{ color: mediumMain }} />
					<Typography
						color={mediumMain}
						sx={{ "&:hover": { cursor: "pointer", color: medium } }}
					>
						Audio
					</Typography>
				</FlexBetween>
				<Button
					sx={{
						color: theme.palette.background.alt,
						backgroundColor: theme.palette.primary.main,
						borderRadius: "3rem",
					}}
					onClick={sendPost}
					disabled={isLoading || isFetching}
				>
					{(isLoading || isFetching) ? 'Loading...' : 'Post'}
				</Button>
			</FlexBetween>
		</WidgetWrapper >
	)
}

export default CreatePostWidget