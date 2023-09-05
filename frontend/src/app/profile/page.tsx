"use client"

import React, {useEffect} from 'react';
import {Typography} from "@mui/material";

const Profile = () => {
    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Dashboard")
    }, [])
    return (
        // <Box>
        //     {/*<Typography component="p" variant="h1">*/}
        //     {/*    Profile page*/}
        //     {/*</Typography>*/}
        //     Profile
        // </Box>
        <Typography component="p" variant="h1">
            Profile page
        </Typography>
    );
};

export default Profile;