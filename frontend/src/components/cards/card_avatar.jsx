import React from 'react';
import {Card, CardContent, CardHeader} from "@mui/material";
import UserAvatar from "../avatar/user_avatar";
import moment from "moment/moment";

const CardAvatar = ({caption, children}) => {
    return (
        <Card sx={{width: 400}}>
            <CardHeader
                avatar={
                    <UserAvatar />
                }
                title={caption}
                subheader={moment().format("YYYY-MM-DD")}
            />
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default CardAvatar;