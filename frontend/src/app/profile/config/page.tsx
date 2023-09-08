"use client"

import React, {useEffect} from 'react';
import {Typography} from "@mui/material";

const ProfileConfig = () => {
    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Properties")
    }, [])
    return (
        // <Box>
        //     {/*<Typography component="p" variant="h1">*/}
        //     {/*    Profile page*/}
        //     {/*</Typography>*/}
        //     Profile
        // </Box>
        <Typography component="p" variant="h1">
            General Config Page
        </Typography>
    );
};

export default ProfileConfig;