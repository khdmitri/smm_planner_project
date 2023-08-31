"use client"

import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import {useEffect, useState} from "react";
import {CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import DrawerMain from "../drawers/drawer_main";
import {useRouter} from "next/navigation";
import SmmPlannerLogo from "../../../components/logo/smm_planner_logo";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function PrimaryAppBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const navItems = ['Home', 'About', 'Contact'];
    let user = null
    const router = useRouter()

    useEffect(() => {
        user = JSON.parse(sessionStorage.getItem("user"))
    }, [])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/*<MenuItem>*/}
            {/*  <IconButton size="large" aria-label="show 4 new mails" color="inherit">*/}
            {/*    <Badge badgeContent={4} color="error">*/}
            {/*      <MailIcon />*/}
            {/*    </Badge>*/}
            {/*  </IconButton>*/}
            {/*  <p>Messages</p>*/}
            {/*</MenuItem>*/}
            {/*<MenuItem>*/}
            {/*  <IconButton*/}
            {/*    size="large"*/}
            {/*    aria-label="show 17 new notifications"*/}
            {/*    color="inherit"*/}
            {/*  >*/}
            {/*    <Badge badgeContent={17} color="error">*/}
            {/*      <NotificationsIcon />*/}
            {/*    </Badge>*/}
            {/*  </IconButton>*/}
            {/*  <p>Notifications</p>*/}
            {/*</MenuItem>*/}
            {user ?
                <MenuItem onClick={handleProfileMenuOpen}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                    <p>Profile</p>
                </MenuItem> :
                <div>
                    <MenuItem>
                        <IconButton
                            size="small"
                            aria-label="account sign up"
                            color="inherit"
                            onClick={() => router.push('/authentication/signup')}
                        >
                            Sign Up
                        </IconButton>
                    </MenuItem>
                    <MenuItem>
                        <IconButton
                            size="small"
                            aria-label="account sign up"
                            color="inherit"
                            onClick={() => router.push('/authentication/signin')}
                        >
                            Sign In
                        </IconButton>
                    </MenuItem>
                </div>
            }
        </Menu>
    );

    const [mobileOpen, setMobileOpen] = useState(false)
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }
    const drawerWidth = 240

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <SmmPlannerLogo />
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

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {/*<Typography*/}
                    {/*    variant="h6"*/}
                    {/*    noWrap*/}
                    {/*    component="div"*/}
                    {/*    sx={{display: {xs: 'none', sm: 'block'}}}*/}
                    {/*>*/}
                    {/*    SMM Planner*/}
                    {/*</Typography>*/}
                    <SmmPlannerLogo />
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        {/*<IconButton size="large" aria-label="show 4 new mails" color="inherit">*/}
                        {/*  <Badge badgeContent={4} color="error">*/}
                        {/*    <MailIcon />*/}
                        {/*  </Badge>*/}
                        {/*</IconButton>*/}
                        {/*<IconButton*/}
                        {/*  size="large"*/}
                        {/*  aria-label="show 17 new notifications"*/}
                        {/*  color="inherit"*/}
                        {/*>*/}
                        {/*  <Badge badgeContent={17} color="error">*/}
                        {/*    <NotificationsIcon />*/}
                        {/*  </Badge>*/}
                        {/*</IconButton>*/}
                        {user ? <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton> :
                            <>
                                <IconButton
                                    size="small"
                                    edge="end"
                                    aria-label="account sign up"
                                    onClick={() => router.push('/authentication/signup')}
                                    color="inherit"
                                >
                                    Sign Up
                                </IconButton>
                                &nbsp;|&nbsp;
                                <IconButton
                                    size="small"
                                    edge="end"
                                    aria-label="account sign in"
                                    onClick={() => router.push('/authentication/signin')}
                                    color="inherit"
                                >
                                    Sign In
                                </IconButton>
                            </>
                        }
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Box component="nav">
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
            </Box>
        </Box>
    );
}