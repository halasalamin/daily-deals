import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import styles from './appContainer.module.css';
import { Outlet } from "react-router-dom";
import { useDashboardLogic } from '../../hooks/useDashboardLogic';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 200;

const pages = [
  { name: 'Home', path: '/' },
  // { name: 'About', path: '/about' },
  // { name: 'Contact', path: '/contact' },
  { name: 'Company', path: '/company' },
  { name: 'Advertisement', path: '/advertisement', name: 'Advertising Requests'},
  { name: 'Sales Prediction', path: '/prediction'},
  // { name: 'Fake Sales Prediction', path: '/fake-prediction'},

  { name: 'Orders', path: '/orders', title: 'Track & Manage Orders'}
];

const titles = {
  '/orders': 'Track & Manage Orders',
  '/advertisement': 'Advertising Requests',
  '/company': 'Partner Companies'
}


const AppContainer = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    handleLogout
  } = useDashboardLogic();

  return (
    <>

      {/* Navbar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className={styles.navBar}>
        <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h6" noWrap>
            Daily Deals Console
          </Typography>
          <div>
          <p style={{fontWeight: 600, fontSize: '18px', lineHeight: '16px'}}>{titles[location.pathname] ?? ''}</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <p style={{fontWeight: 500}}>Hello, Admin</p>
            <ChevronRightIcon />
          </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            // backgroundColor: '#33b7c0',
            color: 'black',
          },
        }}
        // className={styles.appContainer}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {pages.map((page) => (
              <ListItem key={page.name} disablePadding>
                <ListItemButton
                  selected={location.pathname === page.path}
                  onClick={() => navigate(page.path)}
                >
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
            color='error'
            className="button"
            sx={{
              bottom: '16px',
              position: 'absolute',
              left: '10px',
              width: '90%'
            }}
          >
            {`Logout`}
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <div className={styles.appContainer}>
        <Toolbar />
        <div style={{height: '100%', maxHeight: '100%', flex: 1, overflow: 'hidden', display: 'flex', flexFlow: 'column nowrap'}}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppContainer;
