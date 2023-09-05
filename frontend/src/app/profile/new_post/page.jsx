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

const NewPost = () => {
    const myTheme = createTheme({
        // Set up your custom MUI theme here
    })
    const [markdown, setMarkdown] = useState("");
    const [isCreated, setIsCreated] = useState(false)
    const [files, setFiles] = useState([])
    const [user, setUser] = useState()
    const [title, setTitle] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const router = useRouter()
    const handlePreviewIcon = (fileObject) => {
        console.log("FileObject=", fileObject)
        const {type} = fileObject.file
        // const iconProps = {
        //     className: classes.image,
        // }

        return (
            <PreviewCard fileObject={fileObject}/>
        )

    }

    const resetPage = () => {
        setMarkdown("")
        setShowMessage(false)
        setIsCreated(false)
        setFiles([])
        setTitle("")
    }

    const onNewPost = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (user) {
            data.append("text", markdown)
            if (files.length > 0)
                files.map(file => data.append("files", file))
            await PostAPI.newPost(data, sessionStorage.getItem("access-token")).then(res => {
                setIsCreated(true)
                setShowMessage(true)
                setMessage(`Post was successfully created!`)
                setSeverity("success")
            }).catch(error => {
                console.log(error)
                setShowMessage(true)
                setMessage(`Error: ${error.response.data.detail}`)
                setSeverity("error")
            })

        } else {
            router.push("/authentication/signin")
        }
    }

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "New Post")
        const current_user = sessionStorage.getItem("user")
        if (current_user)
            setUser(JSON.parse(current_user))
        else
            router.push("/authentication/signin")
    }, [])

    return (
        <Box>
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
                <Editor onChange={setMarkdown} value={markdown}/>
                {!isCreated &&
                    <Button type="submit" variant="contained">Create New Post</Button>
                }
            </Box>
            {isCreated &&
                <Button type="button" color="warning" onClick={resetPage} variant="contained">Create Next Post</Button>
            }
        </Box>
    );
};

export default NewPost;