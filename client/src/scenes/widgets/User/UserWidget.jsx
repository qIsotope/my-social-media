import React, { useMemo } from 'react'
import {
	Box,
	IconButton,
	Typography,
	useTheme,
	Divider,
} from "@mui/material";

import {
	ManageAccountsOutlined,
	EditOutlined,
	LocationOnOutlined,
	WorkOutlineOutlined,
} from "@mui/icons-material";
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import UserImage from 'components/UserImage';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserWidget = ({ user }) => {
	const theme = useTheme();
	const dark = theme.palette.neutral.dark;
	const medium = theme.palette.neutral.medium;
	const main = theme.palette.neutral.main;
	const { impressionsCount } = useSelector(state => state.auth)

	return (
		<WidgetWrapper>
			<FlexBetween gap="0.5rem" pb="1.1rem">
				<FlexBetween gap="1rem">
					<UserImage image={user.picturePath} />
					<Box>
						<Link to={`/profile/${user._id}`}>
							<Typography
								variant="h4"
								color={dark}
								fontWeight="500"
								sx={{
									"&:hover": {
										color: theme.palette.primary.light,
										cursor: "pointer",
									},
								}}
							>
								{`${user.firstName} ${user.lastName}`}
							</Typography>
						</Link>
						<Typography color={medium}>{`${user.friends?.length} friends`}</Typography>
					</Box>
				</FlexBetween>
				<IconButton>
					<ManageAccountsOutlined />
				</IconButton>
			</FlexBetween>
			<Divider />
			<Box p="1rem 0">
				<Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
					<LocationOnOutlined fontSize="large" sx={{ color: main }} />
					<Typography color={medium}>{user.location}</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
					<WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
					<Typography color={medium}>{user.occupation}</Typography>
				</Box>
			</Box>
			<Divider />
			<Box p="1rem 0">
				<FlexBetween paddingBottom="0.5rem">
					<Typography color={medium}>Views of profle</Typography>
					<Typography color={main} fontWeight="500">
						{user.views}
					</Typography>
				</FlexBetween>
				<FlexBetween>
					<Typography color={medium}>Impressions of post</Typography>
					<Typography color={main} fontWeight="500">
						{impressionsCount}
					</Typography>
				</FlexBetween>
			</Box>
			<Divider />
			<Box p="1rem 0">
				<Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
					Social Profiles
				</Typography>
				<FlexBetween gap="1rem" mb="0.5rem">
					<FlexBetween gap="1rem">
						<img src="../assets/twitter.png" alt="linkedin" />
						<Box>
							<Typography color={main} fontWeight="500">
								Twitter
							</Typography>
							<Typography color={medium}>Social Network</Typography>
						</Box>
					</FlexBetween>
					<EditOutlined sx={{ color: main }} />
				</FlexBetween>
				<FlexBetween gap="1rem">
					<FlexBetween gap="1rem">
						<img src="../assets/linkedin.png" alt="linkedin" />
						<Box>
							<Typography color={main} fontWeight="500">
								Linkedin
							</Typography>
							<Typography color={medium}>Network Platform</Typography>
						</Box>
					</FlexBetween>
					<EditOutlined sx={{ color: main }} />
				</FlexBetween>
			</Box>
		</WidgetWrapper>
	)
}

export default UserWidget