import React, { useState, useRef, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { DeleteOutlineOutlined, KeyboardVoiceOutlined, Send } from '@mui/icons-material';
import moment from 'moment';
import Show from 'components/Show';
import { v4 } from 'uuid';
import getBlobDuration from 'get-blob-duration'

const VoiceRecorder = ({ handleUpload, handleSendMessage }) => {
	const theme = useTheme();
	const [mediaRecorder, setMediaRecorder] = useState(null);
	const [chunks, setChunks] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [recordTime, setRecordTime] = useState(0);

	const timer = useRef(null);
	const audioRef = useRef(null);
	const streamReference = useRef(null);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamReference.current = stream;
			const recorder = new MediaRecorder(stream);

			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					// setChunks([]);

					setChunks((prevChunks) => [...prevChunks, e.data]);
				}
			};

			setMediaRecorder(recorder);
			setIsRecording(true);
			recorder.start(250);
		} catch (error) {
			console.error('Помилка при старті запису:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder && isRecording) {

			mediaRecorder.stop();
			setRecordTime(0);
			setIsRecording(false);
			clearInterval(timer.current);
			streamReference.current?.getTracks().forEach((track) => track.stop());
			streamReference.current = null;

		}
	};

	const handleSend = async () => {
		await mediaRecorder.stop();
		if (chunks.length > 0) {
			const formData = new FormData();
			const blob = new Blob(chunks, { type: 'audio/wav' });
			const duration = await getBlobDuration(blob)
			const path = `messaging/audiofile.${v4()}`
			formData.append('image', blob);
			formData.append('path', path);
			formData.append('type', 'mp3');
			formData.append('duration', duration);
			handleUpload(formData).then(({data}) => handleSendMessage(data));
			stopRecording();
		}
	}

	useEffect(() => {
		if (isRecording) {
			timer.current = setInterval(() => {
				setRecordTime((prevTime) => prevTime + 1);
			}, 1000);
		}
		return () => {
			clearInterval(timer.current);
		};
	}, [isRecording]);


	const milliseconds = recordTime * 1000;
	const duration = moment.duration(milliseconds);

	const formattedTime = moment.utc(duration.as('milliseconds')).format('m:ss');


	return (
		<Box pt="2px" display="flex" gap="10px" alignItems="center">
			<Show condition={isRecording}>
				<DeleteOutlineOutlined onClick={stopRecording} fontSize='large'
					sx={{ cursor: 'pointer', color: theme.palette.neutral.medium, '&:hover': { color: theme.palette.neutral.main } }} />
				<Send onClick={handleSend} sx={{ cursor: 'pointer', color: theme.palette.neutral.medium, '&:hover': { color: theme.palette.neutral.main } }} />
				{formattedTime}
			</Show>
			<Show condition={!isRecording}>
				<KeyboardVoiceOutlined onClick={startRecording} fontSize='large'
					sx={{ cursor: 'pointer', color: theme.palette.neutral.medium, '&:hover': { color: theme.palette.neutral.main } }} />
			</Show>
		</Box>
	);
};

export default VoiceRecorder;