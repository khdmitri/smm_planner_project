"use client"

import React, {useEffect, useState} from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import TelegramIcon from '@mui/icons-material/Telegram';
import {useRouter} from "next/navigation";
import FacebookIcon from '@mui/icons-material/Facebook';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

const MenuList = (props) => {
    const {open} = props
    const [active, setActive] = useState()
    const router = useRouter()

    const onMenuItemClick = (route, active_text) => {
        setActive(active_text)
        router.push(route)
    }

    useEffect(() => {
        setActive(sessionStorage.getItem("active_item") || "Dashboard")
    }, [])

    const renderListItem = (item) => {
        return (
            <ListItem key={item.text} disablePadding sx={{display: 'block'}}>
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: active && active === item.text && 'secondary.main'
                    }}
                    onClick={() => onMenuItemClick(item.route, item.text)}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: active && active === item.text && 'secondary.main'
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{opacity: open ? 1 : 0}}/>
                </ListItemButton>
            </ListItem>
        )
    }

    return (
        <>
            <List>
                {[{text: 'Dashboard', icon: <DashboardIcon/>, route: '/profile'},
                    {text: 'New Post', icon: <PostAddIcon/>, route: '/profile/new_post'},
                    {text: 'Posts', icon: <DynamicFeedIcon/>, route: '/profile/posts_list'},
                    {text: 'Queue', icon: <ScheduleIcon/>, route: '/profile/queue_post'}]
                    .map((item, index) => (
                        renderListItem(item)
                    ))}
            </List>
            <Divider/>
            <List>
                {[{text: 'Properties', icon: <PermDataSettingIcon/>, route: '/profile/config'},
                  {text: 'Telegram', icon: <TelegramIcon/>, route: '/profile/config/telegram'},
                  {text: 'Facebook', icon: <FacebookIcon/>, route: '/profile/config/facebook'},
                  {text: 'Vkontakte', icon: <DeveloperBoardIcon/>, route: '/profile/config/vk'}
                ]
                    .map((item, index) => (
                        renderListItem(item)
                    ))}
            </List>
        </>
    );
};

export default MenuList;