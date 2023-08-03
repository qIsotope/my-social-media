import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
	try {
		const { userId, description, picturePath } = req.body;
		const user = await User.findById(userId);
		const post = new Post({
			userId,
			firstName: user.firstName,
			lastName: user.lastName,
			location: user.location,
			description,
			userPicturePath: user.picturePath,
			picturePath,
			likes: [],
			comments: {
				postComments: [],
				commentComments: [],
			},
		});

		const savedPost = await post.save()
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const softDeletePost = async (req, res) => {
	try {
		const { id } = req.params;
		const post = await Post.findById(id);
		post.isDeleted = !post.isDeleted;
		await post.save()
		res.status(200).json(post);
	} catch (err) {
		res.status(404).json({ message: err });
	}
}

export const getPosts = async (req, res) => {
	try {
		const posts = await Post.find({ isDeleted: false }).sort({ createdAt: -1 }).populate(['likes', 'comments.postComments', 'comments.commentComments.comment']).exec()
		const filterendPosts = posts.map(post => {
			post.comments.commentComments = post.comments.commentComments.filter((comm) => !comm.comment.isDeleted);
			return post
		})
		res.status(200).json(filterendPosts);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const getUserPosts = async (req, res) => {
	try {
		const { userId } = req.params;
		const post = await Post.find({ userId, isDeleted: false }).populate(['likes', 'comments.postComments', 'comments.commentComments.comment']).exec()
		res.status(200).json(post);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}

export const addRemoveLike = async (req, res) => {
	try {
		const { postId } = req.params;
		const { id } = req.id;
		const user = await User.findById(id);
		const post = await Post.findById(postId).populate('likes').exec();
		const liked = post.likes.some(like => like._id.toString() === id);
		if (liked) {
			post.likes = post.likes.filter(like => like._id.toString() !== id)
		} else {
			post.likes.push(user)
		}
		await post.save()

		res.status(200).json(post);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
}