import UniAlert from "@/components/alert/alert";
import {LockClosedIcon} from "@heroicons/react/20/solid";
import * as React from "react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import LoginAPI from "@/lib/login";
import {tokenInput} from "@/app/landing/components/Navbar/common";


const Login = (props: tokenInput) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const navigate = useRouter()

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
        props.setRefreshReCaptcha(true)
    };

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
                        <div className="text-sm">
                            <a href="@/app/landing/components/Navbar/Signdialog#"
                               className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        {props.token && props.token.length > 0 && <button
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
    )
}

export default Login;