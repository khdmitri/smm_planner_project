"use client"

import TextField from '@material-ui/core/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@material-ui/core/Button';
import {useEffect, useState} from "react";
import {makeStyles, createStyles} from "@mui/styles";
import { Theme } from '@material-ui/core';
import {Box} from "@mui/material";

const useStyles = makeStyles((theme) =>
    createStyles({
        wrapForm: {
            display: "flex",
            justifyContent: "center",
            width: "95%",
            // margin: `${theme.spacing(0)} auto`
        },
        wrapText: {
            width: "100%"
        },
        button: {
            //margin: theme.spacing(1),
        },
    })
);


const TextInput = ({setter, onSubmit}) => {
    const [text, setText] = useState("")
    const classes = useStyles();

    const onComponentSubmit = () => {
        onSubmit()
        setText("")
    }

    const onChange = (event) => {
        setText(event.target.value)
        if (event.target.value)
            setter(event.target.value)
    }

    return (
        <Box className={classes.wrapForm} noValidate autoComplete="off">
            <TextField
                id="standard-text"
                label="Prompt"
                name="text"
                value={text}
                className={classes.wrapText}
                onChange={onChange}
                focused
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={onComponentSubmit} sx={{marginX: 1}} disabled={!text}>
                <SendIcon/>
            </Button>
        </Box>
    )
}

export default TextInput;