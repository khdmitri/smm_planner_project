'use client'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useFormik} from "formik";
import {signupFormSchema} from "../../(schemes)";
import {useEffect, useState} from "react";
import UserAPI from "../../../lib/user";
import UniAlert from "../../../components/alert/alert";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Smm Planner
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
    const onSubmit = async () => {
        console.log(`Submitted: ${JSON.stringify(values)}`)
        console.log("allowExtraEmails:", allowExtraEmails)
        const form = {
            "email": values.email,
            "first_name": values.first_name,
            "last_name": values.last_name,
            "password": values.password,
            "allow_extra_emails": allowExtraEmails
        }

        const onCreateComplete = await UserAPI.createNewUser(form)
        if (onCreateComplete.status === 200 || onCreateComplete.status === 201) {
            console.log("Creation complete:", onCreateComplete)
            setIsCreated(true)
        } else {
            console.log("Creation Error:", onCreateComplete)
        }
    };

    const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            password2: ""
        },
        validationSchema: signupFormSchema,
        onSubmit
    });

    const [allowExtraEmails, setAllowExtraEmails] = useState(true)
    const [isCreated, setIsCreated] = useState(false)
    let user = null

    useEffect(() => {
        user = JSON.parse(sessionStorage.getItem("user"))
    }, [])

    const allowExtraEmailsChanged = () => {
        setAllowExtraEmails(!allowExtraEmails)
    }

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
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {isCreated || user ?
                        <Box sx={{mt: 3}} display="flex" justifyContent="center">
                            {isCreated &&
                                <UniAlert severity="success">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            User was successfully created!
                                        </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            You can now&nbsp;
                                            <Link href="signin">Sign In</Link>!
                                        </Grid>
                                    </Grid>
                                </UniAlert>
                            }
                            {user &&
                                <UniAlert>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            You are Singed In!
                                        </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            Visit your
                                            <Link href="/profile">Profile</Link>!
                                        </Grid>
                                    </Grid>
                                </UniAlert>
                            }
                        </Box>
                        :
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="first_name"
                                        required
                                        fullWidth
                                        id="first_name"
                                        label="First Name"
                                        value={values.first_name}
                                        onChange={handleChange}
                                        error={errors.first_name && touched.first_name}
                                        helperText={errors.first_name && touched.first_name ? errors.first_name : ""}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="last_name"
                                        label="Last Name"
                                        name="last_name"
                                        autoComplete="family-name"
                                        value={values.last_name}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.last_name && touched.last_name}
                                        helperText={errors.last_name && touched.last_name ? errors.last_name : ""}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        type="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={values.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.email && touched.email}
                                        helperText={errors.email && touched.email ? errors.email : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.password && touched.password}
                                        helperText={errors.password && touched.password ? errors.password : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password2"
                                        label="Repeat Password"
                                        type="password"
                                        id="password2"
                                        autoComplete="repeat-password"
                                        value={values.password2}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.password2 && touched.password2}
                                        helperText={errors.password2 && touched.password2 ? errors.password2 : ""}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value={allowExtraEmails}
                                                           onChange={allowExtraEmailsChanged}
                                                           color="primary" checked={allowExtraEmails}/>}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}
