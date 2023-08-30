import React from 'react';
import {Alert} from "@mui/material";

const UniAlert = ({variant="outlined", severity="info", children}) => {
    return (
        <Alert variant={variant} severity={severity}>
            {children}
        </Alert>
    );
};

export default UniAlert;