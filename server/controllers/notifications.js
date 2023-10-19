import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
	try {
		const { id } = req.params;
		const notifications = await Notification.find({ ['user.id']: id }).sort({ createdAt: -1 }).limit(100);
		await Notification.updateMany(
			{ 'user.id': id },
			{ $set: { unRead: false } }
		)
		if (!notifications) return res.status(405).json({ msg: 'Error with getting notifications' });
		return res.status(200).json({ notifications });
	}
	catch (err) {
		res.status(500).json({ error: err.message });
	}

}
