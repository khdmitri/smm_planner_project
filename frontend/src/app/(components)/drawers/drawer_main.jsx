import {Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";


const DrawerMain = ({navItems, toggleClicked, toggleSetter}) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const handleDrawerToggle = () => {
        toggleSetter(!mobileOpen);
        setMobileOpen(!mobileOpen);
    }
    const drawerWidth = 240
    console.log("toggleClicked=", toggleClicked)

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                MUI
            </Typography>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{textAlign: 'center'}}>
                            <ListItemText primary={item}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    useEffect(() => {
        setMobileOpen(toggleClicked)
    }, [toggleClicked])

    useMemo(() => {
        console.log("MobileOpen=", mobileOpen)
    }, [mobileOpen])

    return (
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: {xs: 'block', sm: 'none'},
                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
            }}
        >
            {drawer}
        </Drawer>
    )
}

export default DrawerMain