import {Dialog, Transition} from '@headlessui/react'
import {Fragment, useCallback, useEffect, useState} from 'react'
import {LockClosedIcon} from '@heroicons/react/20/solid'
import {useFormik} from "formik";
import {signupFormSchema} from "../../../(schemes)";
import UserAPI from "../../../../lib/user";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import UniAlert from "@/components/alert/alert";
import Link from "@mui/material/Link";
import * as React from "react";
import {GoogleReCaptcha, GoogleReCaptchaProvider} from "react-google-recaptcha-v3";


const Register = () => {
    const [token, setToken] = useState("");
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const onVerify = useCallback((token: any) => {
        setToken(token);
    }, []);

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
        setRefreshReCaptcha(r => !r)
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
    let [isOpen, setIsOpen] = useState(false)
    let user = null

    useEffect(() => {
        user = JSON.parse(sessionStorage.getItem("user") || "")
    }, [])

    const allowExtraEmailsChanged = () => {
        setAllowExtraEmails(!allowExtraEmails)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    return (
        <>
            <GoogleReCaptchaProvider reCaptchaKey="6LcRrt4oAAAAAC3guUTUGbAYmEjiW0pGYjBwinyO">
                <GoogleReCaptcha
                    onVerify={onVerify}
                    refreshReCaptcha={refreshReCaptcha}
                />
            </GoogleReCaptchaProvider>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto  sm:pr-0">
                <div className='hidden lg:block'>
                    <button
                        className="text-Blueviolet text-lg font-medium ml-9 py-5 px-16 transition duration-150 ease-in-out rounded-full bg-semiblueviolet hover:text-white hover:bg-Blueviolet"
                        onClick={openModal}>
                        Sign up
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

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
                                                        {token && <button
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


                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 "
                                            onClick={closeModal}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Register;
