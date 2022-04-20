import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
  IconButton
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import Setup from './components/Setup';
import { makeStyles } from '@mui/styles';
import Web3 from 'web3';

const useStyles = makeStyles(() => ({
  containerMargin: {
    marginTop: '30px'
  }
}));

function App() {
  let classes = useStyles();
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [web3pack, setWeb3pack] = useState(null);

  const changeNetwork = async () => {
    return await web3pack.web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }]
    });
  }

  const getWeb3 = async () => {
    let newWeb3 = new Web3(Web3.givenProvider || "https://rinkeby-light.eth.linkpool.io");
    await newWeb3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }]
    });
    
    return {
      web3: newWeb3,
      verifyNetwork: async () => await newWeb3.eth.net.getId() === 4,
      retryNetwork: changeNetwork
    }
  }

  useEffect(() => {
    const setWeb3Wrapper = async () => setWeb3pack(await getWeb3());
    setWeb3Wrapper();
  }, [])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenuClick = (route) => {
    setAnchorElNav(null);
    navigate(`/${route}`, { replace: true });
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              My traceability app
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
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem key="home" onClick={handleMenuClick.bind(this, '')}>
                  <Typography textAlign="center">Home</Typography>
                </MenuItem>
                <MenuItem key="setup" onClick={handleMenuClick.bind(this, 'setup')}>
                  <Typography textAlign="center">Setup</Typography>
                </MenuItem>
                <MenuItem key="app" disabled onClick={handleMenuClick.bind(this, 'app')}>
                  <Typography textAlign="center">App</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              My traceability app
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key="home"
                onClick={handleMenuClick.bind(this, '')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>
              <Button
                key="setup"
                onClick={handleMenuClick.bind(this, 'setup')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Setup
              </Button>
              <Button
                key="app"
                onClick={handleMenuClick.bind(this, 'app')}
                sx={{ my: 2, color: 'white', display: 'block' }}
                disabled
              >
                App
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container className={classes.containerMargin}>
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route path="/app" element={<span>Yo</span>} />
          <Route path="/" element={<h1>Work in progress!</h1>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
