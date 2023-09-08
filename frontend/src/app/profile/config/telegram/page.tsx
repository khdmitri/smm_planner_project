"use client"

import React, {useEffect} from 'react';
import {Box, Typography} from "@mui/material";

const TelegramConfig = () => {
    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Telegram")
    }, [])
    return (
        <Box>

        </Box>
    );
};

export default TelegramConfig;