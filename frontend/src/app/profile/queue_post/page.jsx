"use client"

import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Divider, Tab, Typography} from "@mui/material";
import {useRouter} from "next/navigation";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import UniAlert from "../../../components/alert/alert";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import PostListTableTg from "./(componnets)/post_list_table_tg";
import QueueAPI from "../../../lib/queue";

const PostList = () => {
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const [dataTg, setDataTg] = useState([])
    const [dataFb, setDataFb] = useState([])
    const [dataIg, setDataIg] = useState([])
    const [dataVk, setDataVk] = useState([])
    const [value, setValue] = useState();

    const postList = async () => {
        await QueueAPI.getTelegramPosts(sessionStorage.getItem("access-token")).then(res => {
            setDataTg(res.data)
            console.log("Tg Data:", res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
        await QueueAPI.getFacebookPosts(sessionStorage.getItem("access-token")).then(res => {
            setDataFb(res.data)
            console.log("Fb Data:", res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
        await QueueAPI.getInstagramPosts(sessionStorage.getItem("access-token")).then(res => {
            setDataIg(res.data)
            console.log("IG Data:", res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
        await QueueAPI.getVkPosts(sessionStorage.getItem("access-token")).then(res => {
            setDataVk(res.data)
            console.log("VK Data:", res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const deleteFuncTg = async (post_id) => {
        await QueueAPI.deleteTelegramPost(post_id, sessionStorage.getItem("access-token")).then(async (res) => {
            setShowMessage(true)
            setMessage(res.data.msg)
            setSeverity("success")
            await postList()
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const deleteFuncFb = async (post_id) => {
        await QueueAPI.deleteFacebookPost(post_id, sessionStorage.getItem("access-token")).then(async (res) => {
            setShowMessage(true)
            setMessage(res.data.msg)
            setSeverity("success")
            await postList()
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const deleteFuncIg = async (post_id) => {
        await QueueAPI.deleteInstagramPost(post_id, sessionStorage.getItem("access-token")).then(async (res) => {
            setShowMessage(true)
            setMessage(res.data.msg)
            setSeverity("success")
            await postList()
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const deleteFuncVk = async (post_id) => {
        await QueueAPI.deleteVkPost(post_id, sessionStorage.getItem("access-token")).then(async (res) => {
            setShowMessage(true)
            setMessage(res.data.msg)
            setSeverity("success")
            await postList()
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Queue")
        postList()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box>
            {showMessage &&
                <UniAlert severity={severity}>
                    {message}
                </UniAlert>
            }
            <Divider/>
            <Card>
                <Box sx={{padding: 2}} display="flex" flexDirection="row" justifyContent="space-between"
                     alignItems="center">
                    <Typography component="h1" variant="h4">
                        Queued Post List
                    </Typography>
                    <DynamicFeedIcon fontSize="large" color="info" m={2} p={2}/>
                </Box>
                <CardContent>
                    <Box sx={{width: '100%', typography: 'body1'}}>
                        <TabContext value={value ? value : "telegram"}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={handleChange} aria-label="queued tabs">
                                    {["telegram", "facebook", "instagram", "vk"].map(name =>
                                        <Tab label={name.toUpperCase()} value={name}
                                             key={name}/>
                                    )
                                    }
                                </TabList>
                            </Box>
                            {["telegram", "facebook", "instagram", "vk"].map(name =>
                                <TabPanel value={name} key={name}>
                                    {name === "telegram" &&
                                        <PostListTableTg data={dataTg} deleteFunc={deleteFuncTg}/>
                                    }
                                    {name === "facebook" &&
                                        <PostListTableTg data={dataFb} deleteFunc={deleteFuncFb}/>
                                    }
                                    {name === "instagram" &&
                                        <PostListTableTg data={dataIg} deleteFunc={deleteFuncIg}/>
                                    }
                                    {name === "vk" &&
                                        <PostListTableTg data={dataVk} deleteFunc={deleteFuncVk}/>
                                    }
                                </TabPanel>
                            )
                            }
                        </TabContext>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PostList;