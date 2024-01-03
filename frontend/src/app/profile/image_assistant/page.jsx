"use client"

import React, {useEffect, useState} from 'react';
import AiAssistantImageForm from "../(components)/ai_assistant_image_form";
import Box from "@mui/material/Box";

const AiImageAssistant = () => {
    const [response, setResponse] = useState({})
    useEffect(() => {
        console.log("Response", response)
        if ("success" in response) {
            if (response.success) {
                console.log("Successfully got images: ", response)
            }
            else {
                console.log("Failed got images: ", response)
            }
        }
    }, [response])
    return (
        <>
            <AiAssistantImageForm setResponse={setResponse} />
            {response.success &&
                response.images.map(image =>
                    <Box>
                        <img src={image} />
                    </Box>
                )
            }
        </>
    );
};

export default AiImageAssistant;