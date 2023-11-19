"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {GoogleReCaptcha, GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import Signin from "./Signdialog";
import Register from "./Registerdialog";

const DialogsCaptcha = () => {
    const [token, setToken] = useState("");
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const onVerify = useCallback((token) => {
        console.log("Token=", token)
        setToken(token);
    }, []);

    return (
        <>
            <GoogleReCaptchaProvider reCaptchaKey="6LcRrt4oAAAAAC3guUTUGbAYmEjiW0pGYjBwinyO">
                <GoogleReCaptcha
                    onVerify={onVerify}
                    refreshReCaptcha={refreshReCaptcha}
                />
            </GoogleReCaptchaProvider>
            <Signin token={token} setRefreshReCaptcha={setRefreshReCaptcha} />
            <Register token={token} setRefreshReCaptcha={setRefreshReCaptcha}/>
        </>
    );
};

export default DialogsCaptcha;