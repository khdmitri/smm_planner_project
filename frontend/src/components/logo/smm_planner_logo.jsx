import React from 'react';
import {Typography} from "@mui/material";
import Link from "@mui/material/Link";
import ForwardIcon from '@mui/icons-material/Forward';

const SmmPlannerLogo = ({layout=null}) => {
    return (
        <Typography component="h1" variant="h5">
            <Link href="/" variant="h4" sx={{textShadow: 'grey 1px 2px', textDecoration: 'none'}} color="primary.contrastText">SMM Planner</Link>
            {layout &&
                <>
                    <ForwardIcon sx={{marginX: 2}} />
                    {layout}
                </>
            }
        </Typography>
    );
};

export default SmmPlannerLogo;