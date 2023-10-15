"use client"

import React, {useEffect, useState} from 'react';
import {
    Box,
    Card,
    CardContent, createTheme,
    Divider,
    FormControl, FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch, ThemeProvider,
    Typography
} from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import TextInput from "../../../components/chat/TextInput";
import UniAlert from "../../../components/alert/alert";
import ChatAPI from "../../../lib/chat";
import moment from "moment";
import ChatDisplay from "../../../components/chat/Chat";

const MAX_LENGTH = 10

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const decodeUnicode = (str) => {
    return str.replace(/\\u([a-fA-F0-9]{4})/g, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
};

const ChatGPT = () => {
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")

    const [conversation_id, setConversationId] = useState("")
    const [jailbreak, setJailbreak] = useState("default")
    const [internet_access, setInternetAccess] = useState(false)
    const [model, setModel] = useState("")
    const [prompt, setPrompt] = useState("")
    const [history, setHistory] = useState([])
    const theme = createTheme();

    const onSubmit = async () => {
        const new_prompt = {
                    role: "user",
                    content: prompt,
                    timestamp: moment()
                }
        if (history.length > 0) {
            const last_in_history = history[history.length - 1]
            console.log("LastInHistory:", last_in_history)
            if (last_in_history.role === "user")
                setHistory([history.slice(0, history.length - 1), new_prompt])
            else
                setHistory([...history, new_prompt])
        } else
            setHistory([...history, new_prompt])
    }

    useEffect(() => {
        console.log("History:", history)
        if (history.length > MAX_LENGTH) {
            setHistory(history.slice(history.length - MAX_LENGTH, history.length))
        }

        if (history.length > 0) {
            const last_in_history = history[history.length - 1]
            if (last_in_history.role === "user") {
                const chatRequest = {
                    conversation_id,
                    jailbreak,
                    model,
                    content: {
                        conversation: history.slice(0, history.length-1),
                        internet_access,
                        prompt: {
                            role: "user",
                            content: prompt,
                            timestamp: moment()
                        }
                    }
                }
                const chat_completion = async () => {
                    await ChatAPI.conversation(chatRequest, sessionStorage.getItem("access-token"))
                        .then(async (res) => {
                            setHistory([...history, {role: "assistant", content: res.data, timestamp: moment()}])
                        })
                        .catch(error => {
                            console.log("ERROR:", error)
                            console.log("HisInConversation:", history)
                            setHistory([...history, {
                                role: "assistant",
                                content: error.response && error.response.data.detail ? error.response.data.detail : "Unknown error",
                                timestamp: moment()
                            }])
                        })
                }
                chat_completion()
            }
        }
    }, [history])

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
        <ThemeProvider theme={theme}>
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
                        <ChatDisplay history={history}/>
                        <TextInput setter={setPrompt} onSubmit={onSubmit}/>
                        <Box display="flex" direction="row">
                            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="demo-simple-select-standard-label">Model</InputLabel>
                                <Select
                                    labelId="model-label"
                                    id="model-id"
                                    value={model}
                                    onChange={event => setModel(event.target.value)}
                                    label="Model"
                                >
                                    <MenuItem value="gpt-3.5-turbo">GPT-3.5</MenuItem>
                                    <MenuItem value="gpt-3.5-turbo-16k">GPT-3.5-16k</MenuItem>
                                    <MenuItem value="gpt-3.5-turbo-0613">Test</MenuItem>
                                    <MenuItem value="gpt-4-0613">GPT-4-0613</MenuItem>
                                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                                    <MenuItem value="claude-v2">Vercel</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="demo-simple-select-standard-label">Jailbreak</InputLabel>
                                <Select
                                    labelId="jailbreak-label"
                                    id="jailbreak-id"
                                    value={jailbreak}
                                    onChange={event => setJailbreak(event.target.value)}
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
                                                 onChange={() => setInternetAccess(!internet_access)}/>}
                                label="Use Web Search"/>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default ChatGPT;