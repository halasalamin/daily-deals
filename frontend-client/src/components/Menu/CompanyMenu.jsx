import React from "react";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Navigate, useNavigate } from "react-router-dom";
import CompanySettingsDialog from "../../pages/AccountSettings/CompanySettings";
import { useState } from "react";
const AccountMenu = ({ anchorEl, onClose, user, logout }) => {
  const open = Boolean(anchorEl);
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false);


  const handleSettings = () => {
    setSettingsOpen(true);
    onClose();
  };


  return (
    <>
        <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
        <MenuItem onClick={handleSettings}>
            <ListItemIcon>
            <Settings fontSize="small" />
            </ListItemIcon>
            Settings
        </MenuItem>
        <MenuItem onClick={logout}>
            <ListItemIcon>
            <Logout fontSize="small" />
            </ListItemIcon>
            Logout
        </MenuItem>
        </Menu>
        <CompanySettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} user={user}/>
    </>
  );
};

export default AccountMenu;
