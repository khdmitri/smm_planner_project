import React from 'react';
import {Box, Card, CardActionArea, CardHeader, CardMedia} from "@mui/material";
import Grid from "@mui/material/Grid";

const PreviewCard = (props) => {
    const {fileObject} = props
    const {type} = fileObject.file
    console.log("Type=", type)
    return (
        <Box>
            <Card raised={true} display="flex" justifyContent="center">
                <CardHeader
                    title={fileObject.file.name}
                />
                <CardActionArea display="flex" justifyContent="center">
                    {type.startsWith("video/") &&
                        <CardMedia
                            component='video'
                            image={fileObject.data}
                            autoPlay
                            controls
                            sx={{height: 200, padding: 1}}
                        />
                    }
                    {type.startsWith("image/") &&
                        <Grid container display="flex" justifyContent="center">
                            <Grid item xs={12} padding={2}>
                                <img src={fileObject.data} width="100%" />
                            </Grid>
                        </Grid>
                    }
                </CardActionArea>
            </Card>
        </Box>
    );
};

export default PreviewCard;