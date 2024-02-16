"use client"

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PractiseAPI from "../../lib/yoga/practise";
import Grid from "@mui/material/Grid";
import {Card, CardActions, CardContent, CardMedia, Chip, Stack} from "@mui/material";
import SellIcon from '@mui/icons-material/Sell';
import YoutubeEmbed from "../landing/components/sub_components/embed_youtube";
import Button from "@material-ui/core/Button";
import {useEffect, useState} from "react";

function PractiseLists() {
    // Wait for the practise list
    const [practiseList, setPractiseList] = useState(null)

    const getPractiseList = async () => {
        await PractiseAPI.get_practises().then(
            result => setPractiseList(result)
        ).catch(error => console.log(error))
    }

    useEffect(() => {
        getPractiseList()
    }, [])

    return (
        <Grid container spacing={2} display="flex" justifyContent="center">
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
                {practiseList && Array.isArray(practiseList.data) && practiseList.data.map((practise) => (
                    <Card sx={{maxWidth: 420}} key={practise.id}>
                        <YoutubeEmbed embedId={practise.file_resource_link}/>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {practise.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {practise.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={2} display="flex" justifyContent="space-between">
                                <Grid item xs={12} display="flex" justifyContent="space-between">
                                    <Button variant="contained" size="medium">
                                        КУПИТЬ ЗА 1999 руб.
                                    </Button>
                                    <Chip icon={<SellIcon />} label="20%" color="error" />
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
        </Grid>
    )
}

const LandingPage = () => {
    return (
        <Box>
            <Typography variant="h3" sx={{color: "blue"}} display="flex" justifyContent="center">
                Курсы по йоге
            </Typography>
            <PractiseLists/>
        </Box>
    );
};

export default LandingPage;