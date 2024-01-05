import { storage } from '../firebase.js'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export const uploadImage = async (req, res) => {
	try {
		const { path, type, name, duration } = req.body;
		if (!req.file?.buffer) {
			return res.status(400).json({ message: 'No image uploaded' });
		}
		const metadata = {
			contentType: req.file.mimetype,
		};
		const imageRef = ref(storage, path + '.' + type);
		const uploadTask = uploadBytesResumable(imageRef, req.file?.buffer, metadata);
		uploadTask.on('state_changed',
			() => {},
			(error) => {
				res.status(400).json({ message: error.message });
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					return res.status(200).json({ url: downloadURL, type, name, duration });
				});
			})
	} catch (error) {
		return res.status(403).json({ message: error.message });
	}
};