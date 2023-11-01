"use client"

import React, {useEffect, useState} from 'react';
import Avatar from "@mui/material/Avatar";
import {red} from '@mui/material/colors';

const UserAvatar = () => {
    const [userInitials, setUserInitials] = useState("-")

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"))
        if (user) {
            const f_letter = user.first_name.split("", 1)
            const l_letter = user.last_name.split("", 1)
            let initials = f_letter ? f_letter[0].toUpperCase() : ""
            initials += l_letter ? l_letter[0].toUpperCase() : ""
            setUserInitials(initials)
        }
    })
    return (
        <Avatar>
            <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                {userInitials}
            </Avatar>
        </Avatar>
    );
};

export default UserAvatar;