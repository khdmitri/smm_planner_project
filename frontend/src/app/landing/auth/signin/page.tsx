"use client"

import React from 'react';
import {GoogleReCaptcha, GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {useCallback, useState} from "react";
import Login from "@/app/landing/components/Authorization/signin";

const SignInPage = () => {
    const [token, setToken] = useState("");
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const onVerify = useCallback((token) => {
        console.log("Token=", token)
        setToken(token);
    }, []);

    return (
        <div>
            {/*<GoogleReCaptchaProvider reCaptchaKey="6LcRrt4oAAAAAC3guUTUGbAYmEjiW0pGYjBwinyO">*/}
            {/*    <GoogleReCaptcha*/}
            {/*        onVerify={onVerify}*/}
            {/*        refreshReCaptcha={refreshReCaptcha}*/}
            {/*    />*/}
            {/*</GoogleReCaptchaProvider>*/}
            <Login token="mobile" setRefreshReCaptcha={setRefreshReCaptcha} />
        </div>
    );
};

export default SignInPage;