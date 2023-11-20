"use client"
import Image from "next/image";
import React, {Component} from "react";
import Slider from "react-slick";
import {Box, Grid, Typography} from "@mui/material";

// IMAGES DATA FOR CAROUSEL
interface Data {
    imgSrc: string,
    label: string
}

const data: Data[] = [
    {
        imgSrc: "/assets/carousel/facebook.svg",
        label: "FACEBOOK"
    },
    {
        imgSrc: "/assets/carousel/youtube.svg",
        label: "YOUTUBE"
    },
    {
        imgSrc: "/assets/carousel/instagram.svg",
        label: "INSTAGRAM"
    },
    {
        imgSrc: "/assets/carousel/telegram.svg",
        label: "TELEGRAM"
    },
    {
        imgSrc: "/assets/carousel/vk-circled.svg",
        label: "VK-Circled"
    }
]


// CAROUSEL SETTINGS
export default class MultipleItems extends Component {
    render() {
        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 2000,
            cssEase: "linear",
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 700,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };

        return (

            <div className='text-center my-20'>
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-midnightblue text-2xl font-semibold">Social Networks supported</h2>
                    <div className="py-14">
                        <Slider {...settings}>
                            {data.map((item, i): any =>
                                <Grid container spacing={1} key={i}>
                                    <Grid item xs={6} display="flex" justifyContent="center">
                                        <Box>
                                            <Image src={item.imgSrc} alt={item.imgSrc} width={96} height={36}/>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" component="h2">{item.label}</Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </Slider>
                    </div>
                    <hr/>
                </div>
            </div>

        )
    }
}
