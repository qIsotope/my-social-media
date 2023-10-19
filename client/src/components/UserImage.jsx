import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
	const picturePath = !image?.includes('firebase') ? `http://localhost:5005/assets/${image}` : image;
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={image ? picturePath : 'http://localhost:5005/assets/defaultUserImage.jpg'}
      />
    </Box>
  );
};

export default UserImage;
