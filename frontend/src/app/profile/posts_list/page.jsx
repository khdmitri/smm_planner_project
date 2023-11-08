"use client"

import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Divider, Typography} from "@mui/material";
import {useRouter} from "next/navigation";
import PostAPI from "../../../lib/post";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import PostListTable from "./(components)/post_list_table";
import UniAlert from "../../../components/alert/alert";

const PostList = () => {
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const [data, setData] = useState([])
    const router = useRouter()

    const postList = async () => {
        await PostAPI.getPosts(sessionStorage.getItem("access-token")).then(res => {
            setData(res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const deleteFunc = async (post_id) => {
        await PostAPI.deletePost(post_id, sessionStorage.getItem("access-token")).then(async (res) => {
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

    const editFunc = (post_id) => {
        router.push(`/profile/post_list/edit/${post_id}`)
    }

    const queuedFunc = (post_id) => {
        router.push(`/profile/queue_post/${post_id}`)
    }

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Posts")
        postList()
    }, [])

    return (
        <Box>
            {showMessage &&
                <UniAlert severity={severity}>
                    {message}
                </UniAlert>
            }
            <Divider/>
            <Card>
                <Box sx={{padding: 2}} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography component="h1" variant="h4">
                        Post List
                    </Typography>
                    <DynamicFeedIcon fontSize="large" color="info" m={2} p={2} />
                </Box>
                <CardContent>
                    <PostListTable data={data} deleteFunc={deleteFunc} editFunc={editFunc} queuedFunc={queuedFunc}/>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PostList;