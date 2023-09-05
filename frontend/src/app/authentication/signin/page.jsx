"use client"

import * as React from 'react';
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
import {useState} from "react";
import LoginAPI from "../../../lib/login";
import {useRouter} from "next/navigation";
import UniAlert from "../../../components/alert/alert";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                SMM Planner
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const navigate = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('username'),
            password: data.get('password'),
        });
        await LoginAPI.loginAccessToken(data).then(async (res) => {
            console.log("got data on loginAccessToken: ", res)
            sessionStorage.removeItem("access-token")
            sessionStorage.setItem("access-token", res.data.access_token)
            await LoginAPI.testToken(res.data.access_token).then(res => {
                const user = res.data
                if (user.is_active) {
                    sessionStorage.removeItem("user")
                    sessionStorage.setItem("user", JSON.stringify(user))
                    navigate.push("/profile")
                } else {
                    setShowMessage(true)
                    setMessage("The user is inactive!")
                    setSeverity("info")
                }
            }).catch(error => {
                setShowMessage(true)
                setMessage("Test token was not passed")
                setSeverity("info")
            })
        }).catch(error => {
            setShowMessage(true)
            setMessage(`Sign In failed: ${error.message}`)
            setSeverity("error")
        })
    };

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
                        height: "75vh"
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {showMessage &&
                        <UniAlert severity={severity}>
                            {message}
                        </UniAlert>
                    }
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            value={username}
                            name="username"
                            onChange={event => setUsername(event.target.value)}
                            autoComplete="email"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            focused
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            value={password}
                            label="Password"
                            type="password"
                            id="password"
                            onChange={event => setPassword(event.target.value)}
                            autoComplete="current-password"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
