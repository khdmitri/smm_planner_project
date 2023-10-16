"use client"

import {createStyles, makeStyles, Theme} from "@mui/styles";
import {Paper} from "@material-ui/core";
import {MessageLeft, MessageRight} from "./Message";
import {Box, Typography} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";

const useStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            width: "80vw",
            height: "80vh",
            maxWidth: "500px",
            maxHeight: "700px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative"
        },
        paper2: {
            width: "80vw",
            maxWidth: "500px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative"
        },
        container: {
            width: "90vw",
            height: "65vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        messagesBody: {
            width: "80%",
            margin: 10,
            overflowY: "scroll",
            height: "calc( 100% - 80px )"
        }
    })
);

export default function ChatDisplay({history}) {
    const classes = useStyles();
    const theme = createTheme()
    console.log("MESSAGES=", history)
    return (
        <ThemeProvider theme={theme}>
            <Box className={classes.container}>
                <Paper id="style-1" className={classes.messagesBody}>
                    {history && Array.isArray(history) &&
                        history.map((message) => {
                            if (message.role === "assistant" || message.role === "system")
                                return <MessageLeft
                                    key={message.timestamp ? message.timestamp : message.content}
                                    message={message.content}
                                    timestamp={message.timestamp ? message.timestamp.toString() : ""}
                                    displayName=""
                                    avatarDisp={true}
                                />
                            else if (message.role === "user")
                                return <MessageRight
                                    key={message.timestamp ? message.timestamp : message.content}
                                    message={message.content}
                                    timestamp={message.timestamp ? message.timestamp.toString() : ""}
                                    displayName=""
                                    avatarDisp={false}
                                />
                        })
                    }
                </Paper>
            </Box>
        </ThemeProvider>
    );
}