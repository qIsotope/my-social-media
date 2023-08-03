import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
	Box,
	Typography,
	useTheme,
	Divider,
	InputBase,
	Button,
	LinearProgress,
	Tooltip,
} from "@mui/material";
import {
	EditOutlined,
	AttachFileOutlined,
	GifBoxOutlined,
	ImageOutlined,
	MicOutlined,
	Close,
} from "@mui/icons-material";
import { storage } from 'firebase.js'
import { v4 } from 'uuid'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'

import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { useCreatePostMutation } from 'state/service/postsApi';
import { ImageModal } from 'components/ImageModal';

const CreatePostWidget = () => {
	const { user } = useSelector(state => state.auth)

	const [createPost, { isLoading, isFetching }] = useCreatePostMutation()
	const [isUploading, setIsUploading] = useState(false)
	const [uploadImagePath, setUploadImagePath] = useState('')
	const [openModal, setOpenModal] = useState(false)
	const [pictureURL, setPictureURL] = useState(null);
	const [description, setDescription] = useState('')
	const inputFileRef = useRef(null)

	const theme = useTheme();
	const medium = theme.palette.neutral.medium;
	const mediumMain = theme.palette.neutral.mediumMain;

	const sendPost = () => {
		const formData = new FormData();
		formData.append('description', description);
		formData.append('userId', user._id)
		formData.append('picturePath', pictureURL ? pictureURL : '')
		setPictureURL(null)
		setDescription('')
		createPost(formData);
	}

	const handleUpload = (picture) => {
		if (picture) {
			const path = `preview/${picture.name}.${v4()}`
			setUploadImagePath(path)
			const imageRef = ref(storage, path);
			const uploadTask = uploadBytesResumable(imageRef, picture);
			uploadTask.on(
				'state_changed',
				() => {
					setPictureURL(null);
					setIsUploading(true)
				},
				(error) => {
					console.error(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setPictureURL(downloadURL);
						setIsUploading(false)
					});
				}
			);
		}
	};

	const handleRemovePhoto = (e) => {
		e.stopPropagation()
		const desertRef = ref(storage, uploadImagePath);
		setPictureURL(null)
		setUploadImagePath('')
		deleteObject(desertRef);
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
					<Box position="absolute" right="10px" top="10px" sx={{display: !pictureURL && 'none'}}>
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
					disabled={isLoading || isFetching || isUploading}
				>
					{(isLoading || isFetching || isUploading) ? 'Loading...' : 'Post'}
				</Button>
			</FlexBetween>
		</WidgetWrapper >
	)
}

export default CreatePostWidget