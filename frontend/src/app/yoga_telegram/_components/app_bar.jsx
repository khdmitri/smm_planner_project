"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TelegramIcon from '@mui/icons-material/Telegram';
import Image from "next/image";

const pages = ['Курсы', 'Online-занятия', 'Написать мне'];
const settings = ['Закрыть приложение'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const LOGO_WIDTH = 200
  const LOGO_HEIGHT = Math.round(LOGO_WIDTH*0.2575)

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/*<TelegramIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, transform: "scale(1.5)" }} />*/}
          {/*<Typography*/}
          {/*  variant="h6"*/}
          {/*  noWrap*/}
          {/*  component="a"*/}
          {/*  href="#app-bar-with-responsive-menu"*/}
          {/*  sx={{*/}
          {/*    mr: 2,*/}
          {/*    display: { xs: 'none', md: 'flex' },*/}
          {/*    fontFamily: 'monospace',*/}
          {/*    fontWeight: 700,*/}
          {/*    letterSpacing: '.3rem',*/}
          {/*    color: 'inherit',*/}
          {/*    textDecoration: 'none',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  LOGO*/}
          {/*</Typography>*/}
          <Image src="/images/yoga/logo_flat.png" width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="YogaMindMaster Logo" />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/*<TelegramIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, transform: "scale(1.5)" }} />*/}
          {/*<Typography*/}
          {/*  variant="h5"*/}
          {/*  noWrap*/}
          {/*  component="a"*/}
          {/*  href="#app-bar-with-responsive-menu"*/}
          {/*  sx={{*/}
          {/*    mr: 2,*/}
          {/*    display: { xs: 'flex', md: 'none' },*/}
          {/*    flexGrow: 1,*/}
          {/*    fontFamily: 'monospace',*/}
          {/*    fontWeight: 700,*/}
          {/*    letterSpacing: '.3rem',*/}
          {/*    color: 'inherit',*/}
          {/*    textDecoration: 'none',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  LOGO*/}
          {/*</Typography>*/}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/images/yoga/yoga_avatar.png" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;