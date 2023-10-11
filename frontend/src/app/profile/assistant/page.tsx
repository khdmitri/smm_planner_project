"use client"

import React, {useEffect, useState} from 'react';
import {
    Box,
    Card,
    CardContent,
    Divider,
    FormControl, FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography
} from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TextInput from "../../../components/chat/TextInput";
import UniAlert from "../../../components/alert/alert";

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const ChatGPT = () => {
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")

    const [conversation_id, setConversationId] = useState("")
    const [jailbreak, setJailbreak] = useState("default")
    const [internet_access, setInternetAccess] = useState(false)
    const [model, setModel] = useState("gpt-4")
    const [prompt, setPrompt] = useState("")
    const [history, setHistory] = useState([])

    const onSubmit = () => {
        const chatRequest = {
            conversation_id,
            jailbreak,
            model,
            content: {
                conversation: history,
                internet_access,
                prompt
            }
        }
    }

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Assistant")
        if (!localStorage.getItem("conversation_id")) {
            const uuid = uuidv4()
            setConversationId(uuid)
            localStorage.setItem("conversation_id", uuid)
        } else
            setConversationId(localStorage.getItem("conversation_id"))

        if (!localStorage.getItem("history")) {
            setHistory([])
            localStorage.setItem("history", JSON.stringify([]))
        } else
            setHistory(JSON.parse(localStorage.getItem("history")))
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
                <Box sx={{padding: 2}} display="flex" flexDirection="row" justifyContent="space-between"
                     alignItems="center">
                    <Typography components="h1" variant="h4">
                        AI Chat Assistant
                    </Typography>
                    <DynamicFeedIcon fontSize="large" color="info" m={2} p={2}/>
                </Box>
                <CardContent>
                    <TextInput setter={setPrompt} onSubmit={onSubmit}/>
                    <Box display="flex" direction="row">
                        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="demo-simple-select-standard-label">Model</InputLabel>
                            <Select
                                labelId="model-label"
                                id="model-id"
                                value={model}
                                onChange={setModel}
                                label="Model"
                            >
                                <MenuItem value="gpt-3.5-turbo">GPT-3.5</MenuItem>
                                <MenuItem value="gpt-4">GPT-4</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="demo-simple-select-standard-label">Jailbreak</InputLabel>
                            <Select
                                labelId="jailbreak-label"
                                id="jailbreak-id"
                                value={jailbreak}
                                onChange={setJailbreak}
                                label="Jailbreak"
                            >
                                <MenuItem value="default">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="gpt-dan-11.0">DAN</MenuItem>
                                <MenuItem value="gpt-evil">Evil</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch checked={internet_access}
                                             onChange={() => setInternetAccess(!internet_access)} />}
                            label="Use Web Search" />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChatGPT;