import Box from "@mui/material/Box";
import ResponsiveAppBar from "./_components/app_bar";

const YogaRootLayout = (props) => {
    const {children} = props
    return (
        <Box>
            <ResponsiveAppBar />
            {children}
        </Box>
    );
};

export default YogaRootLayout;