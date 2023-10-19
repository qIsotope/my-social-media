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
        src={image ? picturePath : 'https://firebasestorage.googleapis.com/v0/b/my-social-media-c3987.appspot.com/o/users%2FdefaultUserImage.jpg?alt=media&token=adb2a1ad-59af-47f3-a235-27f49f14ca12&_gl=1*1cew9mf*_ga*MTk4NTQ4Njk4MS4xNjk1NzI0MDk0*_ga_CW55HF8NVT*MTY5NzcyMTQ3My43LjEuMTY5NzcyMzg3NS44LjAuMA..'}
      />
    </Box>
  );
};

export default UserImage;
