
export const errorHandler = (responseStatus) => {
	switch (responseStatus) {
		case 405:
			return 'This Email already exist.'
		case 406:
			return 'User with this Email doesn`t exist.'
		case 432:
			return 'Invalid credentials.'
		default:
			return 'Service unavailable. Please try again later.'
	}
}