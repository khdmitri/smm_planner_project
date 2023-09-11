import {useEffect, useState} from 'react';
import {Box, Card, CardContent, FormGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import Editor from "../../../../components/editor/Editor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const ChatForm = ({chat, post, activateSubmit = false}) => {
    const [markdown, setMarkdown] = useState("");
    const [jsonText, setJsonText] = useState({})
    const [title, setTitle] = useState("")
    const [isIncluded, setIsIncluded] = useState(true)
    const [when, setWhen] =useState(moment(chat.next_post_time))

    const onSubmit = () => {

    }

    useEffect(() => {
        console.log("Current title:", title)
        console.log("Init form:", chat.id)
    }, [])

    useEffect(() => {
        console.log("ActivateSubmit=", activateSubmit)
        console.log("chat ID=", chat.id)
    }, [activateSubmit])

    return (
        <Card>
            <CardContent>
                <Box>
                    <Editor onChange={setMarkdown} json_setter={setJsonText} initial_value={post.json_text}/>
                    <Box component="form" key={chat.id} noValidate sx={{mt: 1}} name={`form_${chat.id.toString()}`}>
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