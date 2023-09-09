import React, {useEffect} from 'react';
import {Box, Card, CardContent, FormGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import Editor from "../../../../components/editor/Editor";
import {useState} from "@types/react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

const ChatForm = ({chat, post, activateSubmit = false}) => {
    const [markdown, setMarkdown] = useState("");
    const [jsonText, setJsonText] = useState({})
    const [title, setTitle] = useState(post.title)
    const [isIncluded, setIsIncluded] = useState(true)
    const [when, setWhen] =useState()

    const onSubmit = () => {

    }

    useEffect(() => {
        console.log("ActivateSubmit=", activateSubmit)
    }, [activateSubmit])

    return (
        <Card>
            <CardContent>
                <Box>
                    <Editor onChange={setMarkdown} json_setter={setJsonText} value={post.json_text}/>
                    <Box component="form" noValidate sx={{mt: 1}}>
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
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox name="isIncluded" value={isIncluded}
                                                   onChange={() => setIsIncluded(!isIncluded)} defaultChecked/>}
                                label="Include This Chat"/>
                        </FormGroup>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker value={when} onChange={(value) => setWhen(value)}/>
                        </LocalizationProvider>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChatForm;