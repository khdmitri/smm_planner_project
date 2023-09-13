import {useEffect, useState} from 'react';
import {Box, Card, CardContent, FormGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import Editor from "../../../../components/editor/Editor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import ConfigAPI from "../../../../lib/config";

const ChatForm = ({chat, post, dispatch}) => {
    const get_full_config = async (config_id) => {
        await ConfigAPI.getTelegramConfig(config_id, sessionStorage.getItem("access-token"))
            .then(res => dispatch({
                type: "update_item",
                key: chat.id,
                payload: {
                    ...post,
                    "when": moment(res.data.next_post_time)
                }
            }))
            .catch(error => {
                console.log("error:", error)
                dispatch({
                    type: "update_item",
                    key: chat.id,
                    payload: {
                        ...post,
                        "when": new Date()
                    }
                })
            })
    }

        useEffect(() => {
            console.log("POST:", post)
            if (!post.when)
                get_full_config(chat.id)
        }, [])

        const onChange = (sub_key, value) => {
            console.log("onChange:", sub_key, value)
            dispatch({
                type: "update_item",
                key: chat.id,
                payload: {
                    ...post,
                    [sub_key]: value
                }
            })
        }

        return (
            <Card>
                <CardContent>
                    <Box>
                        <Editor
                            onChange={(value, value_json) => {
                                onChange("markdown_text", value)
                                onChange("json_text", value_json)
                            }
                            }
                            initial_value={post.json_text}/>
                        <Box component="form" key={chat.id} noValidate sx={{mt: 1}} name={`form_${chat.id.toString()}`}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Post Title"
                                value={post.title}
                                name="title"
                                onChange={event => onChange("title", event.target.value)}
                                autoComplete="title"
                                InputLabelProps={{shrink: true}}
                                autoFocus
                                focused
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox name="isIncluded" value={post.is_included}
                                                       onChange={() => onChange("is_included", !post.is_included)}/>
                                    }
                                    label="Include This Chat"/>
                            </FormGroup>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker value={post.when} onChange={(value) => onChange("when", value)}/>
                            </LocalizationProvider>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    export default ChatForm;