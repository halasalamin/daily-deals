import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Tooltip,
  Collapse,
  ListItemIcon,
  Divider,
  Button,
  TextField
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGrid } from '@mui/x-data-grid';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Storefront,
  ShoppingCart,
  Timeline,
  Campaign,
  AddBox,
  ListAlt,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import Profile from '@mui/icons-material/ManageAccounts';
import { SupportIcon } from '../../icons'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InputAdornment from '@mui/material/InputAdornment';

import ManageAdDialog from "../../components/Dialog/ManageAdsDialog";
import AdStatusDialog from "../../components/Dialog/AdStatusDialog";
import ExistingProducts from "./ProductTablePage.jsx";
import { DarkModeProvider, useDarkMode } from "../../context/DarkModeContext";
import GenerateReport from "../GenerateReport/GenerateReport.jsx";
import ContactDialog from "../../components/Dialog/ContactDialog";
import axios from "axios";
import backgroundImage from "../../assets/appLogo.png";
import OrdersPage from "./OrderTablePage";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountMenu from "../../components/Menu/CompanyMenu";

const CompanyAccountContent = ({ user, logout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [ownerProfilePic, setOwnerProfilePic] = useState(null);
  const [company, setCompany] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("Company Products");

  const [showAdStatusSnackbar, setShowAdStatusSnackbar] = useState(false);
  const [adStatusMessage, setAdStatusMessage] = useState("");

  const [openAdDialog, setOpenAdDialog] = useState(false);
  const [openAdStatusDialog, setOpenAdStatusDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openAds, setOpenAds] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggleMenu = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  const token = localStorage.getItem('token')

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/order/set-ready",
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    if (response.data.success) {
      setRecentOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } else {
      console.error("Failed to update order status:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};


// show status of ads if it changed when company login
useEffect(() => {
  const fetchUserProfile = async () => {
    if (!token) return navigate("/login");

    try {
      const res = await axios.get("http://localhost:4000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setCompany(data.data);
      if (data.data.profilePhoto) {
        setOwnerProfilePic(data.data.profilePhoto);
      }

      if (data?.adStatusUpdated) {
        setAdStatusMessage("The status of your advertisements has been updated.");
        setShowAdStatusSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
    }
  };

  fetchUserProfile();
}, [navigate, token]);


useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/order/companyorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      if (data) {
        setRecentOrders(data.data);
      } else {
        console.error("Error fetching company orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching company orders:", error);
    }
  };

  if (selectedMenu === "Orders") {
    fetchOrders();
  }
}, [selectedMenu, token]);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setOwnerProfilePic(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      await axios.post(
        "http://localhost:4000/api/user/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };


  const renderMainContent = () => {
    switch (selectedMenu) {
      case "Profile":
        return ;
      case "Company Products":
        return <ExistingProducts company={company} />;
      case "Orders":
        return <OrdersPage recentOrders={recentOrders} updateOrderStatus={updateOrderStatus} />;
      case "Sales Prediction":
      return <GenerateReport company={company} />;
      default:
        return ;
    }
  };


  const [showInput, setShowInput] = useState(false);

  const handleClick = () => {
    setShowInput((prev) => !prev);
  }

  return (
    <DarkModeProvider>
      <AppBar position="static" sx={{ backgroundColor: "#167f81", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img
            src={backgroundImage}
            alt="logo"
            style={{ height: 115, width: 120, marginTop: -30, marginBottom: -30 }}
          />

          <div style={{display: 'flex', position: 'relative'}}>
          <p style={{color: '#fff', marginRight: '12px', fontWeight: 500}}>{company?.username || "Owner"}</p>
            <Avatar src={ownerProfilePic || "/default-profile.jpg"}
            sx={{
              '& img': {
                width: 'unset',
                height: 'unset',
                objectFit: 'none',
                transform: 'scale(0.12)',
              },
            }}
            />
            <div style={{ boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)'
             , backgroundColor: 'rgb(204 204 204 / 80%)', borderRadius: '50%', position: 'absolute', right: '0px', top: '25px', height: '18px', width: '18px'}} >
            <KeyboardArrowDownIcon sx={{marginLeft: '-3px !important', marginTop: '-2px !important', fontSize: '25px'}} onClick={handleToggleMenu}/>
            <AccountMenu anchorEl={anchorEl} onClose={handleCloseMenu} logout={logout} user={user}/>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    <Box display="flex">
      {/* Sidebar */}
      <Box sx={{ minWidth: 250, padding: "0 12px", borderRight: "1px solid #ccc", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <List>
     {[
       { text: "Profile", icon: <Profile /> },
       { text: "Company Products", icon: <Storefront /> },
       { text: "Orders", icon: <ShoppingCart /> },
       { text: "Sales Prediction", icon: <Timeline /> },
     ].map(({ text, icon }) => (
       <ListItem key={text} disablePadding>
         <ListItemButton
           selected={selectedMenu === text}
           onClick={() => setSelectedMenu(text)}
           sx={{
            borderRadius: 1,
            padding: '4px 10px',
            marginBottom: '6px',
            backgroundColor: selectedMenu === text ? '#efeff2 !important' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(22, 127, 129, 0.15) !important',
            },
          }}
         >
           <ListItemIcon sx={{minWidth: '40px'}}>{icon}</ListItemIcon>
           <ListItemText
             primary={<Typography fontWeight={selectedMenu === text ? "bold" : "normal"}>{text}</Typography>}
           />
         </ListItemButton>
       </ListItem>
     ))}

     <Divider sx={{ my: 1 }} />

     {/* Advertisement Management */}
     <ListItem disablePadding>
       <ListItemButton onClick={() => setOpenAds(!openAds)} sx={{ borderRadius: 1, padding: '4px 10px', }}>
         <ListItemIcon sx={{minWidth: '40px'}}><Campaign /></ListItemIcon>
         <ListItemText primary="Advertisements" />
         {openAds ? <ExpandLess /> : <ExpandMore />}
       </ListItemButton>
     </ListItem>
     <Collapse in={openAds} timeout="auto" unmountOnExit>
       <List component="div" disablePadding>
         <ListItemButton sx={{ borderRadius: 1, pl: 4, paddingRight: '10px' }} onClick={() => setOpenAdDialog(true)}>
           <ListItemIcon sx={{minWidth: '40px'}}><AddBox /></ListItemIcon>
           <ListItemText primary="Create New Ad" />
         </ListItemButton>
         <ListItemButton sx={{ borderRadius: 1, pl: 4, paddingRight: '10px' }} onClick={() => setOpenAdStatusDialog(true)}>
           <ListItemIcon sx={{minWidth: '40px'}}><ListAlt /></ListItemIcon>
           <ListItemText primary="Active Ads" />
         </ListItemButton>
       </List>
     </Collapse>

     <Divider sx={{ my: 1 }} />

     {/* Contact */}
     <ListItem disablePadding>
       <ListItemButton onClick={() => setOpenContactDialog(true)} sx={{ borderRadius: 1, padding: '4px 10px', }}>
         <ListItemIcon sx={{minWidth: '40px'}}><SupportIcon /></ListItemIcon>
         <ListItemText primary="Contact" />
       </ListItemButton>
     </ListItem>
   </List>

        {/* Dialogs */}
        {openAdDialog && <ManageAdDialog open={openAdDialog} onClose={() => setOpenAdDialog(false)} />}
        {openAdStatusDialog && <AdStatusDialog open={openAdStatusDialog} onClose={() => setOpenAdStatusDialog(false)} />}
        {openContactDialog && <ContactDialog open={openContactDialog} onClose={() => setOpenContactDialog(false)}/>}
      </Box>

      {/* Main Content */}
  <div style={{backgroundColor: selectedMenu === "Home" ? "white" : "#efeff2", padding: '0 20px 20px 20px',
    display: 'flex',
      flex: 1,
      height: 'calc(100vh - 64px)',
      flexFlow: 'column nowrap',
      maxHeight: 'calc(100vh - 85px)'
    }}>


    {/* Dynamic Content */}
    {renderMainContent()}
          {openMenu && (
        <div style={{ position: "absolute", right: 0, top: "45px" }}>
          <AccountMenu />
        </div>
      )}
    {/* </div> */}
    </div>
      {/* Snackbar */}
      <Snackbar
        open={showAdStatusSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowAdStatusSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClick={() => {
            setOpenAdDialog(true);
            setShowAdStatusSnackbar(false);
          }}
          severity="info"
          sx={{ cursor: "pointer" }}
        >
          {adStatusMessage}
        </MuiAlert>
      </Snackbar>
        <div style={{ position: "absolute", right: 0, top: "45px" }}>
          <AccountMenu  user={user} />
        </div>
    </Box>
  </DarkModeProvider>
  );
};

// const CompanyAccount = () => {
//   return (
//     <DarkModeProvider>
//       <AppBar position="static" sx={{ backgroundColor: "#167f81", boxShadow: "none" }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <img
//             src={backgroundImage}
//             alt="logo"
//             style={{ height: 115, width: 120, marginTop: -30, marginBottom: -30 }}
//           />
//         </Toolbar>
//       </AppBar>
//
//       <CompanyAccountContent />
//     </DarkModeProvider>
//   );
// };

export default CompanyAccountContent;
