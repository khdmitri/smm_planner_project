"use client"

import React, {useEffect, useReducer, useState} from 'react';
import PostAPI from "../../../../lib/post";
import {Box, Button, Tab} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import UniAlert from "../../../../components/alert/alert";
import {useRouter} from "next/navigation";
import ConfigAPI from "../../../../lib/config";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import ChatForm from "../(componnets)/chat_form";
import QueueAPI from "../../../../lib/queue";
import moment from "moment";
import {reducer_tg, reducer_fb} from "../(lib)/reducers";

const Page = ({params}) => {
    const [post, setPost] = useState()
    const [isPosted, setIsPosted] = useState(false)
    const [chats, setChats] = useState(null)
    const [fbChats, setFbChats] = useState(null)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const router = useRouter()
    const [value, setValue] = React.useState();
    const [state_tg, dispatch_tg] = useReducer(reducer_tg, {}, () => {
    });
    const [state_fb, dispatch_fb] = useReducer(reducer_fb, {}, () => {
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getPost = async () => {
        await PostAPI.getPost(parseInt(params.post_id), sessionStorage.getItem("access-token")).then(res => {
            setPost(res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.response && error.response.data && error.response.data.detail ? error.response.data.detail : error.message)
            setSeverity("error")
        })
    }

    useEffect(() => {
        function set_init_state(configs) {
            // Init reducer state
            const init_state = {}
            configs.map((chat) => {
                init_state[chat.id] = {...post, is_included: true, when: null}
            })
            dispatch({
                type: "init_state",
                payload: init_state
            })
        }
        if (!state_tg && post && chats) {
            set_init_state(chats)
        }
        if (!state_fb && post && fbChats) {
            set_init_state(fbChats)
        }
    }, [post, chats, state_tg, state_fb])

    const getConfigList = async () => {
        await ConfigAPI.getTelegramConfigList(sessionStorage.getItem("access-token")).then(res => {
            setChats(res.data)
            if (Array.isArray(res.data) && res.data.length > 0)
                setValue(res.data[0].chat_id)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.response && error.response.data && error.response.data.detail ? error.response.data.detail : error.message)
            setSeverity("error")
        })

        await ConfigAPI.getFacebookConfigList(sessionStorage.getItem("access-token")).then(res => {
            setFbChats(res.data)
            // if (Array.isArray(res.data) && res.data.length > 0)
            //     setValue(res.data[0].chat_id)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.response && error.response.data && error.response.data.detail ? error.response.data.detail : error.message)
            setSeverity("error")
        })
    }

    useEffect(() => {
        getPost()
        getConfigList()
    }, [])

    const sendPosts = async () => {
        const keys_tg = Object.keys(state_tg)
        if (Array.isArray(keys_tg))
            keys_tg.map(async (key) => {
                const state_post = state_tg[key]
                if (state_post.is_included) {
                    const queued_post = {
                        post_id: state_post.id,
                        telegram_config_id: key,
                        title: state_post.title,
                        text: state_post.html_text,
                        when: state_post.when ? state_post.when.format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm")
                    }
                    await QueueAPI.newTelegramPost(queued_post, sessionStorage.getItem("access-token"))
                        .then(() => {
                            setIsPosted(true)
                            setShowMessage(true)
                            setMessage("Post was successfully appended to queue!")
                            setSeverity("success")
                        })
                        .catch(error => {
                            console.log(error)
                            setShowMessage(true)
                            setMessage(error.response && error.response.data && error.response.data.detail ? error.response.data.detail : error.message)
                            setSeverity("error")
                        })
                }
            })
        const keys_fb = Object.keys(state_fb)
        if (Array.isArray(keys_fb))
            keys_fb.map(async (key) => {
                const state_post = state_fb[key]
                if (state_post.is_included) {
                    const queued_post = {
                        post_id: state_post.id,
                        facebook_config_id: key,
                        title: state_post.title,
                        text: state_post.plain_text,
                        when: state_post.when ? state_post.when.format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm")
                    }
                    await QueueAPI.newFacebookPost(queued_post, sessionStorage.getItem("access-token"))
                        .then(() => {
                            setIsPosted(true)
                            setShowMessage(true)
                            setMessage("Post was successfully appended to queue!")
                            setSeverity("success")
                        })
                        .catch(error => {
                            console.log(error)
                            setShowMessage(true)
                            setMessage(error.response && error.response.data && error.response.data.detail ? error.response.data.detail : error.message)
                            setSeverity("error")
                        })
                }
            })
        if (post) {
            post.is_posted = true
            post.post_date = moment().format("YYYY-MM-DD HH:mm")
            await PostAPI.updatePost(post, sessionStorage.getItem("access-token"))
        }
    }

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
                            {fbChats && fbChats.map(chat =>
                                <Tab label={chat.description} value={chat.chat_id.toString()} key={chat.chat_id}/>
                            )
                            }
                        </TabList>
                    </Box>
                    {state_tg && Object.keys(state_tg).length > 0 && chats.map(chat =>
                        <TabPanel value={chat.chat_id.toString()} key={chat.chat_id}>
                            <ChatForm chat={chat} post={state_tg[chat.id]} dispatch={dispatch_tg}/>
                        </TabPanel>
                    )
                    }
                    {state_fb && Object.keys(state_fb).length > 0 && fbChats.map(chat =>
                        <TabPanel value={chat.chat_id.toString()} key={chat.chat_id}>
                            <ChatForm chat={chat} post={state_fb[chat.id]} dispatch={dispatch_fb}/>
                        </TabPanel>
                    )
                    }
                </TabContext>
            </Box>
            {!isPosted &&
                <Button variant="contained" onClick={sendPosts}>Post to Social Networks</Button>
            }
            {isPosted &&
                <Button variant="outlined" color="success" onClick={() => router.push("/profile/queue_post")}>
                    Check Post Queue
                </Button>
            }
        </Box>
    );
};

export default Page;