"use client"

import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme, Tab, Typography} from "@mui/material";
import {DropzoneArea} from "mui-file-dropzone";
import PreviewCard from "../(components)/preview_card";
import Editor from "../../../components/editor/Editor";
import {useRouter} from "next/navigation";
import TextField from "@mui/material/TextField";
import PostAPI from "../../../lib/post";
import UniAlert from "../../../components/alert/alert";
import {convertPureMarkdown} from "../../../lib/utils";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import IconButton from "@mui/material/IconButton";
import PreviewIcon from '@mui/icons-material/Preview';
import VideoPreview from "../../../components/video-preview/video_preview";

const NewPost = () => {
    const myTheme = createTheme({
        // Set up your custom MUI theme here
    })
    const [markdown, setMarkdown] = useState("");
    const [jsonText, setJsonText] = useState({})
    const [htmlText, setHtmlText] = useState("")
    const [plainText, setPlainText] = useState("")
    const [isCreated, setIsCreated] = useState(false)
    const [files, setFiles] = useState([])
    const [video_url, setVideoUrl] = useState("")
    const [user, setUser] = useState()
    const [title, setTitle] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const [post, setPost] = useState({})
    const [value, setValue] = useState("Disk")
    const router = useRouter()
    const handlePreviewIcon = (fileObject) => {
        // console.log("FileObject=", fileObject)
        return (
            <PreviewCard fileObject={fileObject}/>
        )
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const resetPage = () => {
        sessionStorage.setItem("active_item", "New Post")
        window.location.reload()
        // setMarkdown("")
        // setShowMessage(false)
        // setIsCreated(false)
        // setFiles([])
        // setTitle("")
    }

    const onNewPost = async (event) => {
        event.preventDefault();
        console.log("Submit event:", event)
        const data = new FormData(event.currentTarget);
        if (user) {
            data.append("markdown_text", convertPureMarkdown(markdown))
            data.append("json_text", JSON.stringify(jsonText))
            data.append("html_text", htmlText)
            data.append("plain_text", plainText)
            if (files.length > 0)
                files.map(file => data.append("files", file))
            console.log("Form Data:", data)
            await PostAPI.newPost(data, sessionStorage.getItem("access-token")).then(res => {
                setPost(res.data)
                setIsCreated(true)
                setShowMessage(true)
                setMessage(`Post was successfully created!`)
                setSeverity("success")
            }).catch(error => {
                console.log(error)
                setShowMessage(true)
                setMessage(`Error: ${error.response && error.response.data ? error.response.data.detail : "Unknown"}`)
                setSeverity("error")
            })
        } else {
            router.push("/authentication/signin")
        }
        console.log("End of submit")
        return true
    }

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "New Post")
        const current_user = sessionStorage.getItem("user")
        if (current_user)
            setUser(JSON.parse(current_user))
        else
            router.push("/authentication/signin")
    }, [])

    useEffect(() => {
        console.log("PlainText=", plainText)
    }, [plainText])

    const onChangeEditor = (sub_key, value) => {
        switch (sub_key) {
            case "markdown_text":
                setMarkdown(value)
                return true
            case "json_text":
                setJsonText(value)
                return true
            case "html_text":
                setHtmlText(value)
                return true
            case "plain_text":
                setPlainText(value)
                return true
        }
    }

    return (
        <Box pb={3}>
            {showMessage &&
                <UniAlert severity={severity}>
                    {message}
                </UniAlert>
            }
            <Typography variant="h5" color="primary" sx={{marginTop: 2, marginBottom: 0}}>
                Text Description*
            </Typography>
            <Editor onChange={(value, value_json, value_html, value_text) => {
                onChangeEditor("markdown_text", value)
                onChangeEditor("json_text", value_json)
                onChangeEditor("html_text", value_html)
                onChangeEditor("plain_text", value_text)
            }
            }/>
            <Box component="form" onSubmit={onNewPost} noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Post Title"
                    value={title}
                    name="title"
                    onChange={event => setTitle(event.target.value)}
                    autoComplete="title"
                    InputLabelProps={{shrink: true}}
                    autoFocus
                    focused
                />

                <Box sx={{width: '100%', typography: 'body1'}}>
                    <Typography variant="h5" color="primary" sx={{marginTop: 2, marginBottom: 0}}>
                        Media Content
                    </Typography>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChange} aria-label="source changer">
                                <Tab label="From Disk" value="Disk"/>
                                <Tab label="From URL" value="URL"/>
                            </TabList>
                        </Box>
                        <TabPanel value="Disk">
                            <DropzoneArea
                                acceptedFiles={[".jpeg", ".png", ".mp4"]}
                                maxFileSize={104857600}
                                getPreviewIcon={handlePreviewIcon}
                                onChange={(files) => {
                                    setFiles(files)
                                }}
                                value={files}
                                showPreviews={true}
                                showPreviewsInDropzone={false}
                                showFileNamesInPreview={true}
                            />
                        </TabPanel>
                        <TabPanel value="URL">
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="video_url"
                                label="Video URL"
                                value={video_url}
                                name="video_url"
                                onChange={event => setVideoUrl(event.target.value)}
                                autoComplete="video_url"
                                InputLabelProps={{shrink: true}}
                            />
                            {video_url && video_url.length > 7 &&
                                <VideoPreview url={video_url}/>
                            }
                        </TabPanel>
                    </TabContext>
                </Box>
                {!isCreated &&
                    <Button sx={{marginTop: 2}} type="submit" variant="contained">Create New Post</Button>
                }
            </Box>
            {isCreated &&
                <Box flexDirection="row" p={2}>
                    <Button m={1} type="button" onClick={() => router.push(`/profile/queue_post/${post.id}`)}
                            variant="contained">POST</Button>
                    <Button m={1} type="button" color="secondary" onClick={resetPage} variant="outlined">Create Next
                        Post</Button>
                </Box>
            }
        </Box>
    );
};

export default NewPost;