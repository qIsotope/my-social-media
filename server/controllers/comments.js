import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addRemoveLike = async (req, res) => {
	try {
		const { commentId } = req.params;
		const { id } = req.id;
		const { postId, parentCommentId } = req.body;

		const post = await Post.findById(postId);
		const comment = await Comment.findById(commentId);

		const updateLikes = (comm, liked) => {
			return {
				...comm,
				likes: liked ? comm.likes.filter(like => like !== id) : [...comm.likes, id]
			}
		};

		if (parentCommentId) {
			post.comments = post.comments.map(comm =>
				comm._id.toString() === parentCommentId
					? { ...comm, comments: comm.comments.map(childComm => (childComm._id.toString() === commentId ? updateLikes(childComm, childComm.likes.includes(id)) : childComm)) }
					: comm
			);
		} else {
			post.comments = post.comments.map(comm =>
				comm._id.toString() === commentId ? updateLikes(comm, comm.likes.includes(id)) : comm
			);
		}
		await post.save();
		if (comment.likes.includes(id)) {
			comment.likes = comment.likes.filter(like => like !== id)
		} else {
			comment.likes.push(id);
		}
		const savedComment = await comment.save();
		res.status(200).json(savedComment);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const createComment = async (req, res) => {
	try {
		const { userId, text, postId, picturePath, parentCommentId, repliedToName, repliedToId } = req.body;
		const user = await User.findById(userId);
		const post = await Post.findById(postId);
		if (!user || !post) {
			return res.status(404).json({ message: 'Something went wrong' })
		}
		const comment = new Comment({
			userId,
			postId,
			firstName: user.firstName,
			lastName: user.lastName,
			location: user.location,
			text,
			parentCommentId,
			userPicturePath: user.picturePath,
			picturePath,
			repliedToName,
			repliedToId,
		});
		const savedComment = await comment.save()
		if (parentCommentId) {
			post.comments = post.comments.map(comm =>
				comm._id.toString() === parentCommentId
					? { ...comm, comments: [...comm.comments, savedComment] }
					: comm
			);
		} else {
			post.comments.push(savedComment)
		}
		await post.save()
		res.status(200).json(savedComment);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}