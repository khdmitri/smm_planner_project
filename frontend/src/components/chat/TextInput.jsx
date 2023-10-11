"use client"

import TextField from '@material-ui/core/TextField';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import SendIcon from '@mui/icons-material/Send';
import Button from '@material-ui/core/Button';
import {useEffect, useState} from "react";


const useStyles = makeStyles((theme) =>
    createStyles({
        wrapForm: {
            display: "flex",
            justifyContent: "center",
            width: "95%",
            margin: `${theme.spacing(0)} auto`
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

    const onChange = (event) => {
        setText(event.target.value)
    }

    useEffect(() => {
        setter(text)
    }, [text])

    return (
        <box className={classes.wrapForm} noValidate autoComplete="off">
            <TextField
                id="standard-text"
                label="Prompt"
                name="text"
                className={classes.wrapText}
                onChange={onChange}
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={onSubmit}>
                <SendIcon/>
            </Button>
        </box>
    )
}

export default TextInput;