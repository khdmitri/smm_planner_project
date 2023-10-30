"use client"

import React, {useEffect, useState} from 'react';
import usePieData from "../../lib/hooks/UsePieData";
import UserAPI from "@/lib/user";
import {PieChart} from "@mui/icons-material";

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
                <PieChart data={usePieData(userStatistic)}/>
            }
        </>
    );
};

export default Profile;