"use client"

import React, {useEffect, useState} from 'react';
import usePieData from "../../lib/hooks/UsePieData";
import UserAPI from "@/lib/user";
import {PieChart} from "@mui/icons-material";
import CardAvatar from "../../components/cards/card_avatar";
import Divider from "@mui/material/Divider";
import {Box, Typography} from "@mui/material";
import moment from "moment/moment";

const Profile = () => {
    const [userStatistic, setUserStatistic] = useState()
    const getUserStatistic = async () => {
        (await UserAPI.getStatistic(sessionStorage.getItem("access-token"))).then(response => {
            setUserStatistic(response.data)
        }).catch(error => {
            console.log("Statistic error:", error)
        })
    }
    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Dashboard")
        getUserStatistic()
    }, [])
    return (
        <>
            {userStatistic &&
                <CardAvatar caption="Post Statistic">
                    <PieChart data={usePieData(userStatistic)}/>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                            Posts Created:
                        </Typography>
                        <Typography variant="h3">
                            {userStatistic.posts_created}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                            Posts Sent:
                        </Typography>
                        <Typography variant="h3">
                            {userStatistic.posts_sent}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                            Last Activity:
                        </Typography>
                        <Typography variant="h3">
                            {userStatistic.last_activity ? moment(userStatistic.last_activity).format("DD-MM-YYYY hh:mm") : "-"}
                        </Typography>
                    </Box>
                </CardAvatar>
            }
        </>
    );
};

export default Profile;