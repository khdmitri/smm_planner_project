"use client"

import React, {useEffect, useState} from 'react';
import {Box, Button, createTheme} from "@mui/material";
import {Theaters, Image as ImageIcon} from '@mui/icons-material';
import {DropzoneArea} from "mui-file-dropzone";
import PreviewCard from "../(components)/preview_card";
import MUIRichTextEditor from "mui-rte";
import {ThemeProvider} from "@mui/styles";
import { convertToRaw } from 'draft-js'
import LexicalEditor from "../(components)/lexical_editor";

const NewPost = () => {
    const myTheme = createTheme({
        // Set up your custom MUI theme here
    })
    const [files, setFiles] = useState([])
    const [editorState, setEditorState] = useState()
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

    const onEditorChanged = (state) => {
        // console.log(JSON.stringify(convertToRaw(state.getCurrentContent())))
        console.log(state.getCurrentContent().getPlainText())
        setEditorState(state)
    }

    useEffect(() => {
        console.log("Files:", files)
    }, [files])

    return (
        <Box>
            <DropzoneArea
                acceptedFiles={[".jpeg", ".png", ".mp4"]}
                maxFileSize={104857600}
                getPreviewIcon={handlePreviewIcon}
                onChange={(files) => {
                    setFiles(files)
                }}
                showPreviews={true}
                showPreviewsInDropzone={false}
                showFileNamesInPreview={true}
            />
            <LexicalEditor />
        </Box>
    );
};

export default NewPost;