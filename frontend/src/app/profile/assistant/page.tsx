"use client"

import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Divider, Typography} from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

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
    const [prompt, setPrompt] = useState("")
    const [history, setHistory] = useState([])

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Assistant")
        if (!localStorage.getItem("conversation_id")) {
            const uuid = uuidv4()
            setConversationId(uuid)
            localStorage.setItem("conversation_id", uuid)
        }
        else
            setConversationId(localStorage.getItem("conversation_id"))

        if (!localStorage.getItem("history")) {
            setHistory([])
            localStorage.setItem("history", JSON.stringify([]))
        }
        else
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
                <Box sx={{padding: 2}} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography components="h1" variant="h4">
                        AI Chat Assistant
                    </Typography>
                    <DynamicFeedIcon fontSize="large" color="info" m={2} p={2} />
                </Box>
                <CardContent>

                </CardContent>
            </Card>
        </Box>
    );
};

export default ChatGPT;