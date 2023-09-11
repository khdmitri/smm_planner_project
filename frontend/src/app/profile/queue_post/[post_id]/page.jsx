"use client"

import React, {useEffect, useState} from 'react';
import PostAPI from "../../../../lib/post";
import {error} from "next/dist/build/output/log";
import {Box, Button, Tab} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import UniAlert from "../../../../components/alert/alert";
import {useRouter} from "next/navigation";
import ConfigAPI from "../../../../lib/config";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import ChatForm from "../(componnets)/chat_form";

const Page = ({params}) => {
    const [post, setPost] = useState()
    const [chats, setChats] = useState(null)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const router = useRouter()
    const [value, setValue] = React.useState();
    const [activateSubmit, setActivateSubmit] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getPost = async () => {
        await PostAPI.getPost(parseInt(params.post_id), sessionStorage.getItem("access-token")).then(res => {
            setPost(res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const getConfigList = async () => {
        ConfigAPI.getTelegramConfigList(sessionStorage.getItem("access-token")).then(res => {
            setChats(res.data)
            if (Array.isArray(res.data) && res.data.length > 0)
                setValue(res.data[0].chat_id)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    useEffect(() => {
        getPost()
        getConfigList()
    }, [])

    return (
        <Box>
            <Box m={0} p={2}>
                <Button sx={{marginBottom: 2}} variant="contained" startIcon={<ArrowLeftIcon/>}
                        onClick={() => router.push("/profile/posts_list")}>
                    Back to post list
                </Button>
                {showMessage &&
                    <UniAlert severity={severity}>
                        {message}
                    </UniAlert>
                }
            </Box>
            <Box sx={{width: '100%', typography: 'body1'}}>
                <TabContext value={value ? value.toString() : "None"}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            {chats && chats.map(chat =>
                                <Tab label={chat.description} value={chat.chat_id.toString()} key={chat.chat_id}/>
                            )
                            }
                        </TabList>
                    </Box>
                    {chats && post && chats.map(chat =>
                        <TabPanel value={chat.chat_id.toString()} key={chat.chat_id}>
                            <ChatForm chat={chat} post={post} activateSubmit={activateSubmit} />
                        </TabPanel>
                    )
                    }
                </TabContext>
            </Box>
            {chats &&
                chats.map((chat) => {

                })
            }
        </Box>
    );
};

export default Page;