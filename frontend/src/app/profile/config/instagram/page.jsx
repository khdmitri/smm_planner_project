"use client"

import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import ConfigList from "./(components)/config_list"
import ConfigAPI from "../../../../lib/config";
import UniAlert from "../../../../components/alert/alert";
import {useRouter} from "next/navigation";
import AddIcon from '@mui/icons-material/Add';
import {Instagram} from "@mui/icons-material";

const InstagramConfig = () => {
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("info")
    const [data, setData] = useState([])
    const router = useRouter()

    const configList = async () => {
        await ConfigAPI.getInstagramConfigList(sessionStorage.getItem("access-token")).then(res => {
            setData(res.data)
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const deleteFunc = async (config_id) => {
        await ConfigAPI.deleteInstagramConfig(config_id, sessionStorage.getItem("access-token")).then(async (res) => {
            setShowMessage(true)
            setMessage(res.data.msg)
            setSeverity("success")
            await configList()
        }).catch(error => {
            setShowMessage(true)
            setMessage(error.data && error.data.detail ? error.data.detail : error.message)
            setSeverity("error")
        })
    }

    const editFunc = (config_id) => {
        router.push(`/profile/config/instagram/edit/${config_id}`)
    }

    useEffect(() => {
        sessionStorage.setItem("profile_menu_active", "Instagram")
        configList()
    }, [])

    return (
        <Box>
            {showMessage &&
                <UniAlert severity={severity}>
                    {message}
                </UniAlert>
            }
            <Divider/>
            <Card>
                <Box sx={{padding: 2}} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography component="h1" variant="h4">
                        Instagram Group List
                    </Typography>
                    <Instagram fontSize="large" color="info" m={2} p={2} />
                </Box>
                <CardContent>
                    <ConfigList data={data} deleteFunc={deleteFunc} editFunc={editFunc}/>
                    <Button sx={{marginTop: 2}} variant="contained" startIcon={<AddIcon/>} onClick={() => editFunc(-1)}>
                        Add New
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default InstagramConfig;