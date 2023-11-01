import React from 'react';
import {Card, CardContent, CardHeader} from "@mui/material";
import UserAvatar from "../avatar/user_avatar";
import moment from "moment/moment";

const CardAvatar = ({caption, children}) => {
    return (
        <Card sx={{width: 400, height: "50vh"}}>
            <CardHeader
                avatar={
                    <UserAvatar />
                }
                title={caption}
                subheader={moment().format("YYYY-MM-DD")}
            />
            <CardContent sx={{width: 400}}>
                {children}
            </CardContent>
        </Card>
    );
};

export default CardAvatar;