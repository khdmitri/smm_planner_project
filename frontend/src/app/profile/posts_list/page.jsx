"use client"

import React, {useEffect} from 'react';
import {Box, Typography} from "@mui/material";

const PostsList = () => {
    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Posts")
    }, [])
    return (
        <Box>
            <Typography variant="h1">
                Posts List
            </Typography>
        </Box>
    );
};

export default PostsList;