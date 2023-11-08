"use client"

import {Dialog, Transition} from '@headlessui/react'
import {Fragment, useCallback, useState} from 'react'
import {LockClosedIcon} from '@heroicons/react/20/solid'
import LoginAPI from "../../../../lib/login"
import {useRouter} from "next/navigation";
import UniAlert from "@/components/alert/alert";
import * as React from "react";
import {GoogleReCaptcha, GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

const Signin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const [token, setToken] = useState(null);
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const navigate = useRouter()

    let [isOpen, setIsOpen] = useState(false)

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    const onVerify = useCallback((token: any) => {
        setToken(token);
    }, []);

    const handleSubmit = async (event: any) => {
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
        setRefreshReCaptcha(r => !r)
    };

    return (
        <>
            <GoogleReCaptchaProvider reCaptchaKey="6LcRrt4oAAAAAC3guUTUGbAYmEjiW0pGYjBwinyO">
                <GoogleReCaptcha
                    onVerify={onVerify}
                    refreshReCaptcha={refreshReCaptcha}
                />
            </GoogleReCaptchaProvider>
            <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0">
                <div className='hidden lg:block'>
                    <button type="button" className='text-lg text-Blueviolet font-medium' onClick={openModal}>
                        Log In
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
                                                    Sign in to your account
                                                </h2>
                                            </div>
                                            {showMessage &&
                                                <UniAlert severity={severity}>
                                                    {message}
                                                </UniAlert>
                                            }
                                            <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
                                                <input type="hidden" name="remember" defaultValue="true"/>
                                                <div className="-space-y-px rounded-md shadow-sm">
                                                    <div className="mb-2">
                                                        <label htmlFor="email-address" className="sr-only">
                                                            Email address
                                                        </label>
                                                        <input
                                                            id="email-address"
                                                            name="username"
                                                            value={username}
                                                            onChange={event => setUsername(event.target.value)}
                                                            type="email"
                                                            autoComplete="email"
                                                            required
                                                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                            placeholder="Email address"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="password" className="sr-only">
                                                            Password
                                                        </label>
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            value={password}
                                                            onChange={event => setPassword(event.target.value)}
                                                            autoComplete="current-password"
                                                            required
                                                            className="relative block w-full appearance-none rounded-none rounded-b-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                            placeholder="Password"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {/*<div className="flex items-center">*/}
                                                    {/*    <input*/}
                                                    {/*        id="remember-me"*/}
                                                    {/*        name="remember-me"*/}
                                                    {/*        type="checkbox"*/}
                                                    {/*        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"*/}
                                                    {/*    />*/}
                                                    {/*    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">*/}
                                                    {/*        Remember me*/}
                                                    {/*    </label>*/}
                                                    {/*</div>*/}

                                                    <div className="text-sm">
                                                        <a href="@/app/landing/components/Navbar/Signdialog#"
                                                           className="font-medium text-indigo-600 hover:text-indigo-500">
                                                            Forgot your password?
                                                        </a>
                                                    </div>
                                                </div>

                                                <div>
                                                    {token && <button
                                                        type="submit"
                                                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        <span
                                                            className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <LockClosedIcon
                                                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                                                aria-hidden="true"/>
                                                        </span>
                                                        Sign in
                                                    </button>
                                                    }
                                                </div>
                                            </form>
                                        </div>
                                    </div>


                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

export default Signin;
