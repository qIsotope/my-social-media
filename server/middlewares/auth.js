import jsonwebtoken from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
	try {
		let token = req.headers.authorization;
		if (!token) {
			return res.status(403).send("Access denied")
		}
		if (token.startsWith("Bearer ")) {
			token = token.slice(7, token.length).trimLeft();
		}

		const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, res) => {
			if (err) {
				return null
			}
			return res;
		});

		if (!verified) {
			return res.status(405).json({ msg: 'Invalid token' })
		}
		req.id = verified;
		next()
	} catch (error) {
		console.log('error', error);
	}
};