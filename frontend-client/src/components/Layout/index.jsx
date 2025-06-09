import React, { useState } from 'react';
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import TuneIcon from '@mui/icons-material/Tune';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { useNavigate } from 'react-router-dom';
import ReportDialog from '../Dialog/ReportDialog';
import NavBar from '../Navbar/Navbar';
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import LanguageIcon from "@mui/icons-material/Language";
import SidebarMenu from '../SidebarMenu/SidebarMenu';

import styles from './layout.module.css';

const drawerWidthOpen = 200;

const pages = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Favorites', icon: <FavoriteIcon />, path: '/favorites' },
  { label: 'Filter', icon: <TuneIcon /> },
];

const bottomOptions = [
  { label: 'Language', icon: <LanguageIcon /> },
  { label: 'Report', icon: <ReportGmailerrorredIcon /> },
]

function MiniDrawer({ children, user = {}, logout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    priceSort: '',
  });

  const [focusedSection, setFocusedSection] = useState(null);



  const handlePageClick = (page, index) => {
    if (page.label === 'Filter') {
      setSidebarOpen(true);
    } else if (page.label === 'Report') {
        setReportDialogOpen(true);
    } else if (page.label === 'Language') {
        // setReportDialogOpen(true);
        // language
    }
    else {
      navigate(page.path);
      setSelectedIndex(index);
    }
  };


  const categories = ["Category", "Brand", "Price"];

    const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Tooltip title={item.label} placement="right" disableHoverListener={open}>
        <ListItem button onClick={() => handlePageClick(item)} selected={isActive} sx={{ height: 48 }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          {open && <Typography>{item.label}</Typography>}
        </ListItem>
      </Tooltip>
    );
  };

  return (
    <>
      <div className={styles.layoutContainer} >
        <NavBar user={user} logout={logout} />
        <div className={styles.mainContainer} >
          {/* column 1 */}
          <div
            style={open ? { width: drawerWidthOpen } : {}}
            className={styles.sideMenuContainer}
          >
            <div className={styles.menu}>
              <ListItem button onClick={() => setOpen(!open)} selected={false} sx={{ height: 48 }}>
                <ListItemIcon><MenuIcon /></ListItemIcon>
                {open && <Typography></Typography>}
              </ListItem>
              {pages.map((page, index) => (<MenuItem item={page} />))}
            </div>
            {bottomOptions.map((option, index) => (<MenuItem item={option} />))}
          </div>
          {/* column 2 */}
          <div className={styles.pageContainer} >
            <div className={styles.categoryBar} >
                {categories.map((cat) => (
                  <Box
                    key={cat}
                    onClick={() => {
                      setFocusedSection(cat.toLowerCase()); 
                      setSidebarOpen(true);
                    }}
                  >
                    <Typography variant="body1" className={styles.categoryItem}>
                      {cat}
                    </Typography>
                  </Box>
                ))}
            </div>
            <div className={styles.contentContainer}>
            <Outlet context={{ filters }} />
            </div>
          </div>
        </div>
        </div>
        <SidebarMenu 
          open={sidebarOpen}  
          onClose={() => {
            setSidebarOpen(false);
            setFocusedSection(null); // reset
          }} 
          filters={filters} 
          setFilters={setFilters} 
          focusedSection={focusedSection}
        />
        <ReportDialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} onSubmit={(text) => {
          console.log("Report submitted:", text);
          setReportDialogOpen(false);
        }} />
      {/* <HomePage filters={filters}/> */}
    </>
  );
}

export default MiniDrawer;
