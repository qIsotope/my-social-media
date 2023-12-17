import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FriendsListWidget } from "scenes/widgets/Friends/FriendsListWidget";
import { PostsWidget } from "scenes/widgets/Posts/PostsWidget";
import UserWidget from "scenes/widgets/User/UserWidget";
import { useGetUserProfileQuery } from "state/service/userApi";

const ProfilePage = () => {
	const { id } = useParams();
	const { user: accountUser } = useSelector(state => state.auth)
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const { data: userProfile = {} } = useGetUserProfileQuery(id);
	let user = userProfile;
	if (id === accountUser._id) user = accountUser;
	useEffect(() => {
		document.title = user?.name
	}, [user])

	return (
		<Box>
			<Box
				width="100%"
				padding="112px 6%"
				display={isNonMobileScreens ? "flex" : "block"}
				gap="2rem"
				justifyContent="center"
			>
				<Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
					<UserWidget user={user} />
					<Box m="2rem 0" />
					<FriendsListWidget friends={user?.friends} title="Friend list"/>
				</Box>
				<Box
					flexBasis={isNonMobileScreens ? "42%" : undefined}
					mt={isNonMobileScreens ? "-2rem" : "2rem"}
				>
					<PostsWidget />
				</Box>
			</Box>
		</Box>
	);
};

export default ProfilePage;
