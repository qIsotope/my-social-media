import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/Navbar/Navbar";
import { FriendListWidget } from "scenes/widgets/User/FriendListWidget";
import { PostsWidget } from "scenes/widgets/Posts/PostsWidget";
import UserWidget from "scenes/widgets/User/UserWidget";
import { useGetUserProfileQuery } from "state/service/userApi";
import { getUserProfile } from "state/slices/auth";

const ProfilePage = () => {
	const { id } = useParams();
	const { user: accountUser } = useSelector(state => state.auth)
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const { data: userProfile = {} } = useGetUserProfileQuery(id);
	let user = userProfile;
	if (id === accountUser._id) user = accountUser;

	return (
		<Box>
			<Navbar />
			<Box
				width="100%"
				padding="2rem 6%"
				display={isNonMobileScreens ? "flex" : "block"}
				gap="2rem"
				justifyContent="center"
			>
				<Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
					<UserWidget user={user} />
					<Box m="2rem 0" />
					<FriendListWidget friends={user?.friends} />
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
