"use client";

import TextField from "@mui/material/TextField";
import {Box, Button, Card, CardContent, FormControl, FormLabel, Grid, Typography} from "@mui/material";
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import ConfigAPI from "../../../../../../lib/config";
import UniAlert from "../../../../../../components/alert/alert";
import {fbConfigFormSchema} from "../../../../../(schemes)/index";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {useRouter} from "next/navigation";


const EditConfig = ({params}) => {
    const action = params.id > 0 ? "update" : "create"
    const [config, setConfig] = useState(null)
    const [isUpdateComplete, setIsUpdateComplete] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const router = useRouter()

    const get_config = async () => {
        await ConfigAPI.getFacebookConfig(params.id, sessionStorage.getItem("access-token")).then(res => {
            setConfig(res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const onSubmitConfig = async (event) => {
        console.log("Submit")
        const data = {
            chat_id: values.chat_id,
            marker_token: values.marker_token,
            description: values.description,
            schedule: {minutes: values.minutes, hours: values.hours, days: values.days}
        }
        console.log("data=", data)
        if (action === "update") {
            data["id"] = parseInt(params.id)
            await ConfigAPI.updateFacebookConfig(data, sessionStorage.getItem("access-token")).then(res => {
                setShowMessage(true)
                setMessage("Facebook config was successfully updated!")
                setSeverity("success")
                setIsUpdateComplete(true)
            }).catch(error => {
                setShowMessage(true)
                setMessage(error.data && error.data.detail ? error.data.detail : error.message)
                setSeverity("error")
            })
        } else {
            await ConfigAPI.newFacebookConfig(data, sessionStorage.getItem("access-token")).then(res => {
                setShowMessage(true)
                setMessage("Facebook config was successfully created!")
                setSeverity("success")
                setIsUpdateComplete(true)
            }).catch(error => {
                setShowMessage(true)
                setMessage(error.data && error.data.detail ? error.data.detail : error.message)
                setSeverity("error")
            })
        }
    }

    useEffect(() => {
        if (action === "update")
            get_config()
    }, [])

    const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
        enableReinitialize: true,
        initialValues: {
            chat_id: config && config.chat_id ? config.chat_id : "",
            marker_token: config && config.marker_token ? config.marker_token : "",
            description: config && config.description ? config.description : "",
            minutes: config && config.schedule ? config.schedule.minutes : 0,
            hours: config && config.schedule ? config.schedule.hours : 0,
            days: config && config.schedule ? config.schedule.days : 0,
        },
        validationSchema: fbConfigFormSchema,
        onSubmit: onSubmitConfig
    });
    return (
        <Box>
            <Box m={0} p={2}>
                <Button sx={{marginBottom: 2}} variant="contained" startIcon={<ArrowLeftIcon/>}
                        onClick={() => router.push("/profile/config/facebook")}>
                    Back to config list
                </Button>
                {showMessage &&
                    <UniAlert severity={severity}>
                        {message}
                    </UniAlert>
                }
            </Box>
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, maxWidth: 400}}>
                        <TextField
                            type="text"
                            margin="normal"
                            required
                            fullWidth
                            onBlur={handleBlur}
                            id="marker_token"
                            label="Marker Token"
                            value={values.marker_token}
                            onChange={handleChange}
                            error={errors.marker_token && touched.marker_token}
                            helperText={errors.marker_token && touched.marker_token ? errors.marker_token : ""}
                            InputLabelProps={{shrink: true}}
                            autoComplete="chat_id"
                            autoFocus
                            focused
                        />
                        <TextField
                            type="text"
                            margin="normal"
                            required
                            fullWidth
                            onBlur={handleBlur}
                            id="chat_id"
                            label="Chat ID"
                            value={values.chat_id}
                            onChange={handleChange}
                            error={errors.chat_id && touched.chat_id}
                            helperText={errors.chat_id && touched.chat_id ? errors.chat_id : ""}
                            InputLabelProps={{shrink: true}}
                            autoComplete="chat_id"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            onBlur={handleBlur}
                            value={values.description}
                            onChange={handleChange}
                            error={errors.description && touched.description}
                            helperText={errors.description && touched.description ? errors.description : ""}
                            InputLabelProps={{shrink: true}}
                            autoComplete="description"
                        />
                        <FormControl component="fieldset">
                            <FormLabel component="legend">SCHEDULE</FormLabel>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <TextField
                                        type="number"
                                        margin="normal"
                                        required
                                        onBlur={handleBlur}
                                        id="minutes"
                                        label="Minutes"
                                        value={values.minutes}
                                        onChange={handleChange}
                                        error={errors.minutes && touched.minutes}
                                        helperText={errors.minutes && touched.minutes ? errors.minutes : ""}
                                        InputLabelProps={{shrink: true}}
                                        autoComplete="minutes"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        type="number"
                                        margin="normal"
                                        required
                                        onBlur={handleBlur}
                                        id="hours"
                                        label="Hours"
                                        value={values.hours}
                                        onChange={handleChange}
                                        error={errors.hours && touched.hours}
                                        helperText={errors.hours && touched.hours ? errors.hours : ""}
                                        InputLabelProps={{shrink: true}}
                                        autoComplete="hours"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        type="number"
                                        margin="normal"
                                        required
                                        onBlur={handleBlur}
                                        id="days"
                                        label="Days"
                                        value={values.days}
                                        onChange={handleChange}
                                        error={errors.days && touched.days}
                                        helperText={errors.days && touched.days ? errors.days : ""}
                                        InputLabelProps={{shrink: true}}
                                        autoComplete="days"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="p">
                                        <blockquote><small>
                                            The time will be added to last posted message. If you leave all 0 values,
                                            the next message comes immediately at the next handler event.
                                            Example: minutes=0, hours=4, days=0 will post messages each 4 hours at 00
                                            minutes
                                        </small></blockquote>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </FormControl>
                        {!isUpdateComplete && <>
                            {action === "update" && !isUpdateComplete ?
                                <Button type="submit" variant="contained">Update Config</Button> :
                                <Button type="submit" variant="contained">Create Config</Button>
                            }
                        </>
                        }
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
        ;
};

export default EditConfig;