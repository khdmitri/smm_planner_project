import AppMenu from "./(components)/app_menu"
import React from "react";
import {Box, Container, CssBaseline} from "@mui/material";

export default function ProfileLayout(props) {
    const {children} = props;
    return (
        <AppMenu>
            <Box sx={{height: '100vh', paddingTop: 9, paddingLeft: 2    }} display="flex" justifyContent="left">
                <CssBaseline/>
                <Box display="flex" justifyContent="start">
                    {children}
                </Box>
            </Box>
        </AppMenu>
    )
}