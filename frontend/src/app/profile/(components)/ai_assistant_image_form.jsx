"use client"

import {useFormik} from "formik";
import {aiAssistantImageFormSchema} from "../../(schemes)";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ChatAPI from "../../../lib/chat";
import Typography from "@mui/material/Typography";
import {useState} from "react";

const defaultTheme = createTheme();

export default function AiAssistantImageForm({setResponse}) {
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit = async (event) => {
        console.log(event);
        const form_data = new FormData()
        form_data.append("prompt", event.prompt)
        form_data.append("style", event.style)
        form_data.append("num_images", event.num_images)
        form_data.append("width", event.width)
        form_data.append("height", event.height)
        form_data.append("negative_prompt_unclip", event.negative_prompt_unclip)
        setIsLoading(true)
        await ChatAPI.generate_image(form_data, sessionStorage.getItem("access-token"))
            .then(async (res) => {
                setResponse({success: true, ...res.data})
                setIsLoading(false)
            })
            .catch(error => {
                console.log("ERROR:", error)
                setResponse({success: false, error: error.data.detail})
                setIsLoading(false)
            })
    }
    const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            prompt: "",
            num_images: 1,
            style: "DEFAULT",
            width: 1024,
            height: 1024,
            negative_prompt_unclip: ""
        },
        validationSchema: aiAssistantImageFormSchema,
        onSubmit
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '80vh'
                    }}
                >
                    <Box>
                        <Typography component="h3" variant="h5" color="info">
                            AI Image Generation Properties
                        </Typography>
                    </Box>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="prompt"
                                    name="prompt"
                                    required
                                    fullWidth
                                    id="prompt"
                                    label="Describe image by text"
                                    value={values.prompt}
                                    onChange={handleChange}
                                    error={!!(errors.prompt && touched.prompt)}
                                    helperText={errors.prompt && touched.prompt ? errors.prompt : ""}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="negative_prompt_unclip"
                                    name="negative_prompt_unclip"
                                    required
                                    fullWidth
                                    id="negative_prompt_unclip"
                                    label="Describe Negative (what AI must avoid to use)"
                                    value={values.negative_prompt_unclip}
                                    onChange={handleChange}
                                    error={!!(errors.negative_prompt_unclip && touched.negative_prompt_unclip)}
                                    helperText={errors.negative_prompt_unclip && touched.negative_prompt_unclip ? errors.negative_prompt_unclip : ""}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="style_id_label">Style</InputLabel>
                                    <Select
                                        labelId="style_id_label"
                                        id="style_id"
                                        name="style"
                                        value={values.style}
                                        label="Image Style"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="DEFAULT">No Style</MenuItem>
                                        <MenuItem value="KANDINSKY">Kandinsky</MenuItem>
                                        <MenuItem value="ANIME">Anime</MenuItem>
                                        <MenuItem value="UHD">High Resolution</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="num_images_id"
                                    type="number"
                                    label="Images Quantity"
                                    name="num_images"
                                    value={values.num_images}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!(errors.num_images && touched.num_images)}
                                    helperText={errors.num_images && touched.num_images ? errors.num_images : ""}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="width_id"
                                    type="number"
                                    label="Image Width"
                                    name="width"
                                    value={values.width}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!(errors.width && touched.width)}
                                    helperText={errors.width && touched.width ? errors.width : ""}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="height_id"
                                    type="number"
                                    label="Image Height"
                                    name="height"
                                    value={values.height}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!(errors.height && touched.height)}
                                    helperText={errors.height && touched.height ? errors.height : ""}
                                />
                            </Grid>
                        </Grid>
                        {!isLoading ?
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Request AI
                            </Button>
                            :
                            <Box sx={{marginTop: 3}}>
                                <Typography component="p" variant="h4" color="#1133aa">
                                    Loading... please wait...
                                </Typography>
                            </Box>
                        }
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}