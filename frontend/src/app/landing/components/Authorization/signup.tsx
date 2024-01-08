import React, {useEffect, useState} from 'react';
import UniAlert from "@/components/alert/alert";
import {LockClosedIcon} from "@heroicons/react/20/solid";
import {tokenInput} from "@/app/landing/components/Navbar/common";
import UserAPI from "@/lib/user";
import {useFormik} from "formik";
import {signupFormSchema} from "../../../(schemes)";
import Box from "@mui/material/Box";
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import Link from "@mui/material/Link";
import TextField from "@material-ui/core/TextField";

const Signup = (props: tokenInput) => {
    const onSubmit = async () => {
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
        props.setRefreshReCaptcha(true)
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
        user = JSON.parse(sessionStorage.getItem("user") || "{}")
    }, [])

    const allowExtraEmailsChanged = () => {
        setAllowExtraEmails(!allowExtraEmails)
    }

    return (
        <div
            className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/assets/logo/logo.png"
                        alt="Post Master Hub"
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Register your account
                    </h2>
                </div>
                {isCreated || user ?
                    <Box sx={{mt: 3}} display="flex" justifyContent="center">
                        {isCreated &&
                            <UniAlert severity="success">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} display="flex"
                                          justifyContent="center">
                                        User was successfully created!
                                    </Grid>
                                </Grid>
                            </UniAlert>
                        }
                        {user &&
                            <UniAlert>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} display="flex"
                                          justifyContent="center">
                                        You are Singed In!
                                    </Grid>
                                    <Grid item xs={12} display="flex"
                                          justifyContent="center">
                                        Visit your
                                        <Link href="/profile">Profile</Link>!
                                    </Grid>
                                </Grid>
                            </UniAlert>
                        }
                    </Box>
                    :
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
                        <input type="hidden" name="remember" defaultValue="true"/>
                        <div className="-space-y-px rounded-md shadow-sm">
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
                                        error={!!(errors.first_name && touched.first_name)}
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
                                        error={!!(errors.last_name && touched.last_name)}
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
                                        error={!!(errors.email && touched.email)}
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
                                        error={!!(errors.password && touched.password)}
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
                                        error={!!(errors.password2 && touched.password2)}
                                        helperText={errors.password2 && touched.password2 ? errors.password2 : ""}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value={allowExtraEmails}
                                                           onChange={allowExtraEmailsChanged}
                                                           color="primary"
                                                           checked={allowExtraEmails}/>}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        <div>
                            {props.token && props.token.length > 0 && <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                                        <span
                                                            className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <LockClosedIcon
                                                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                                                aria-hidden="true"/>
                                                        </span>
                                Register Now
                            </button>
                            }
                        </div>
                    </form>
                }
            </div>
        </div>
    );
};

export default Signup;