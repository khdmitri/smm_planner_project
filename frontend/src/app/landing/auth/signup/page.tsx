"use client"

import React, {useCallback, useState} from 'react';
import {GoogleReCaptcha, GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import Signup from "@/app/landing/components/Authorization/signup";

const SignUpPage = () => {
    const [token, setToken] = useState("");
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    return (
        <div>
            {/*<GoogleReCaptchaProvider reCaptchaKey="6LcRrt4oAAAAAC3guUTUGbAYmEjiW0pGYjBwinyO">*/}
            {/*    <GoogleReCaptcha*/}
            {/*        onVerify={onVerify}*/}
            {/*        refreshReCaptcha={refreshReCaptcha}*/}
            {/*    />*/}
            {/*</GoogleReCaptchaProvider>*/}
            <Signup token="mobile" setRefreshReCaptcha={setRefreshReCaptcha} />
        </div>
    );
};

export default SignUpPage;