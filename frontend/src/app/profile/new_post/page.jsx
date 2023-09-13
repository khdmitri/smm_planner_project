"use client"

import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme} from "@mui/material";
import {DropzoneArea} from "mui-file-dropzone";
import PreviewCard from "../(components)/preview_card";
import Editor from "../../../components/editor/Editor";
import {useRouter} from "next/navigation";
import TextField from "@mui/material/TextField";
import PostAPI from "../../../lib/post";
import UniAlert from "../../../components/alert/alert";
import {convertPureMarkdown} from "../../../lib/utils";

const NewPost = () => {
    const myTheme = createTheme({
        // Set up your custom MUI theme here
    })
    const [markdown, setMarkdown] = useState("**Bold *Italic***");
    const [jsonText, setJsonText] = useState({})
    const [isCreated, setIsCreated] = useState(false)
    const [files, setFiles] = useState([])
    const [user, setUser] = useState()
    const [title, setTitle] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const [post, setPost] = useState({})
    const router = useRouter()
    const handlePreviewIcon = (fileObject) => {
        // console.log("FileObject=", fileObject)
        return (
            <PreviewCard fileObject={fileObject}/>
        )
    }

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
        console.log("Submit")
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (user) {
            data.append("markdown_text", convertPureMarkdown(markdown))
            data.append("json_text", JSON.stringify(jsonText))
            if (files.length > 0)
                files.map(file => data.append("files", file))
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
        console.log("markdown=", markdown)
    }, [markdown])

    const onChangeEditor = (sub_key, value) => {
        switch(sub_key) {
            case "markdown_text":
                setMarkdown(value)
                return true
            case "json_text":
                setJsonText(value)
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
            <Editor onChange={(value, value_json) => {
                            onChangeEditor("markdown_text", value)
                            onChangeEditor("json_text", value_json)
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
                {!isCreated &&
                    <Button type="submit" variant="contained">Create New Post</Button>
                }
            </Box>
            {isCreated &&
                <Box flexDirection="row" p={2}>
                    <Button m={1} type="button" onClick={() => router.push(`/profile/queue_post/${post.id}`)} variant="contained">POST</Button>
                    <Button m={1} type="button" color="secondary" onClick={resetPage} variant="outlined">Create Next Post</Button>
                </Box>
            }
        </Box>
    );
};

export default NewPost;