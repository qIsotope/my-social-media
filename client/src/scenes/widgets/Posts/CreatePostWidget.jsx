import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
	Box,
	Typography,
	useTheme,
	Divider,
	InputBase,
	Button,
	Tooltip,
} from "@mui/material";
import {
	AttachFileOutlined,
	GifBoxOutlined,
	ImageOutlined,
	MicOutlined,
	Close,
} from "@mui/icons-material";
import { v4 } from 'uuid'

import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useCreatePostMutation } from 'state/service/postsApi';
import { ImageModal } from 'components/ImageModal';
import { useUploadImageMutation } from 'state/service/uploadApi';

const CreatePostWidget = () => {
	const { user } = useSelector(state => state.auth)

	const [createPost, { isLoading, isFetching }] = useCreatePostMutation()
	const [uploadImage, { isLoading: isLoadUpload, isFetching: isFetchUpload, data: imageUrl }] = useUploadImageMutation()
	const [openModal, setOpenModal] = useState(false)
	const [pictureURL, setPictureURL] = useState(null);
	const [description, setDescription] = useState('')
	const inputFileRef = useRef(null)

	const theme = useTheme();
	const medium = theme.palette.neutral.medium;
	const mediumMain = theme.palette.neutral.mediumMain;

	useEffect(() => {
		if (imageUrl) {
			setPictureURL(imageUrl.url)
		}
	}, [imageUrl])

	const sendPost = () => {
		setPictureURL(null)
		setDescription('')
		createPost({ description, userId: user._id, picturePath: pictureURL ? pictureURL : '' });
	}

	const handleUpload = (picture) => {
		if (picture) {
			const path = `posts/${picture.name}.${v4()}`
			const formData = new FormData();
			formData.append('image', picture);
			formData.append('path', path);
			uploadImage(formData)
		}
	};

	const handleRemovePhoto = (e) => {
		e.stopPropagation()
		setPictureURL(null)
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
			<Box onClick={() => setOpenModal(true)} mt="20px" width="65%" sx={{ cursor: 'pointer' }} >
				<Box position="relative">
					<Box position="absolute" right="10px" top="10px" sx={{ display: !pictureURL && 'none' }}>
						<Tooltip title="Remove photo" placement='top'>
							<Close onClick={(e) => handleRemovePhoto(e)} sx={{ '&:hover': { color: theme.palette.primary.main }, color: theme.palette.neutral.medium }} />
						</Tooltip>
					</Box>
					{!!pictureURL && <img src={pictureURL} alt="post" height="100%" width='100%' />}
				</Box>
			</Box>
			<ImageModal open={openModal} handleClose={() => setOpenModal(false)} imageUrl={pictureURL} />
			<Divider sx={{ margin: "1.25rem 0" }} />
			<FlexBetween>
				<FlexBetween gap="0.25rem" sx={{ cursor: 'pointer' }} onClick={() => inputFileRef.current.click()}>
					<ImageOutlined sx={{ color: mediumMain }} />
					<Typography
						color={mediumMain}
						sx={{ "&:hover": { cursor: "pointer", color: medium } }}
					>
						Image
					</Typography>
					<input hidden ref={inputFileRef} type='file' accept="image/png, image/jpeg, image/jpg"
						onChange={(e) => handleUpload(e.target.files[0])} />
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
					disabled={isLoading || isFetching || isLoadUpload || isFetchUpload}
				>
					{(isLoading || isFetching || isLoadUpload || isFetchUpload) ? 'Loading...' : 'Post'}
				</Button>
			</FlexBetween>
		</WidgetWrapper >
	)
}

export default CreatePostWidget