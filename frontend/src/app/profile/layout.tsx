import AppMenu from "./(components)/app_menu"
import React from "react";
import {Box, Container, CssBaseline} from "@mui/material";

export default function ProfileLayout(props) {
    const {children} = props;
    return (
        <AppMenu>
            <Container sx={{height: '100vh', paddingTop: 7}}>
                <CssBaseline/>
                <Box display="flex" justifyContent="center">
                    {children}
                </Box>
            </Container>
        </AppMenu>
    )
}