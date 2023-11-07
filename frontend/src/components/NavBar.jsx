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
import AdbIcon from '@mui/icons-material/Adb';

import { useNavigate } from 'react-router-dom';
import MessageAlert from './MessageAlert';
import { DEFAULT_USER_PROFILE_IMG, BACKEND_URL } from '../helper/getLinks';
import fetchObject from '../helper/fetchObject';
import ErrorModal from './ErrorModal';

// Nav bar as header
export default function ResponsiveAppBar (props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showMsgAlert, setShowMsgAlert] = React.useState(false);
  const [msgObject, setMsgObject] = React.useState(null);
  const [userProfileImg, setUserProfileImg] = React.useState('./styles/defaultImg.jpg');
  const [errorModalShow, setErrorModalShow] = React.useState(false);
  const [errorModalMsg, setErrorModalMsg] = React.useState('');
  const [settings, setSettings] = React.useState([]);
  const [pages, setPages] = React.useState([]);

  const navigate = useNavigate();

  // Handle responsive nav close/open button
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Handle user menu close/open button
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // navigate to responding pages in nav bar
  const handleNavMenuElements = (page) => {
    switch (page) {
      case 'All Listings':
        navigate('/');
        break;
      case 'My Hosted Listings':
        navigate('/myHostedListings');
    }
    handleCloseNavMenu();
  };

  const logout = async () => {
    const logoutResponse = await fetch(`${BACKEND_URL}/user/auth/logout`, fetchObject(
      'POST', {}, true
    ));
    const data = await logoutResponse.json();
    if (data.error) {
      setErrorModalMsg(data.error);
      setErrorModalShow(true);
    } else {
      localStorage.removeItem('token');
      props.setToken(null);
      setMsgObject({
        msgType: 'success',
        msgContent: 'You have successfully logout out!'
      });
      setShowMsgAlert(true);
      setUserProfileImg(DEFAULT_USER_PROFILE_IMG);
    }
  }

  // navigate to responding pages in user menu
  const handleUserMenuElements = (setting) => {
    switch (setting) {
      case 'Register':
        navigate('/register');
        break;
      case 'Logout':
        logout();
        break;
    }

    handleCloseUserMenu();
  }

  React.useEffect(() => {
    console.log(props.token);
    if (props.token !== null && props.token !== '') {
      setSettings(['Profile', 'Account', 'Dashboard', 'Logout']);
      setPages(['All Listings', 'My Hosted Listings']);
    } else {
      setSettings(['Login', 'Register']);
      setPages(['All Listings']);
    }
  }, [props.token])

  return (
    <AppBar position="static" sx={{ margin: '0' }}>
      {showMsgAlert && <MessageAlert msgType={msgObject.msgType} msgContent={msgObject.msgContent} />}
      <ErrorModal
        show={errorModalShow}
        onHide={() => setErrorModalShow(false)}
        msg={errorModalMsg}
      />
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={() => navigate('/')}
          >
            LOGO
          </Typography>

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
            {/* Nav Menu */}
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
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavMenuElements(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={userProfileImg} />
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
                <MenuItem key={setting} onClick={() => handleUserMenuElements(setting)}>
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
