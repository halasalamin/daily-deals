import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Search from "../Search/Search";
import i18n from "../../i18n";
import ButtonComponent from "../../widgets/ButtonComponent";
import styles from "./Navbar.module.css";
import backgroundImage from "../../assets/appLogo.png";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const Navbar = ({ user, logout }) => {

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [filters, setFilters] = useState({
    category: "All Products",
    brand: "",
    priceSort: "",
    priceRange: [0, 10000],
  });

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setAnchorEl(null);
  };

  const categories = ["Category", "Brand", "Price", "Sales"];

  return (
      <header className={styles.appHeader}>
        {/* Logo */}
          <Link to="/" style={{maxHeight: '65px'}}>
            <img src={backgroundImage} alt="Logo" className={styles.logo} />
          </Link>
        {/* Search Center */}
        <Search />

        {/* Account & Cart */}
        <div className={styles.leftContainer} style={{alignItems: 'center', paddingRight: '20px'}}>
          {<IconButton onClick={(e) => setAccountMenuAnchor(e.currentTarget)} sx={{color: '#fff'}}>
            {user ? (
              user.photo ? (
                <img
                  src={`http://localhost:4000/${user.photo}`}
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                  alt="User"
                  className={styles.avatar}
                />
              ) : (
                <Box className={styles.avatarContainer}>{user.username?.charAt(0).toUpperCase()}</Box>
              )
            ) : (
              <AccountCircleIcon />
            )}
            {/*<PersonIcon fontSize="large"/>*/}
          </IconButton>}

          {<Menu
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={() => setAccountMenuAnchor(null)}
            className={styles.accountMenu}
            PaperProps={{
              sx: {
                minWidth: 150,
              },
            }}
          >
            {user ? (
              <>
                <MenuItem
                  component={Link}
                  to="/account-page"
                  onClick={() => setAccountMenuAnchor(null)}
                  className={styles.menuItem}
                >
                  <AccountCircleIcon />
                  My Account
                </MenuItem>
                <MenuItem onClick={logout} sx={{ justifyContent: 'center' }}>Logout</MenuItem>
              </>
            ) : (
              <Box className={styles.menuAuthContainer}>
                {!user &&
                  <>
                    <MenuItem onClick={() => {
                      navigate('/login');
                      setAccountMenuAnchor(null);
                    }} sx={{ justifyContent: 'center' }}>Login</MenuItem>
                    <MenuItem onClick={() => {
                      navigate('/register');
                      setAccountMenuAnchor(null);
                    }} sx={{ justifyContent: 'center' }}>Sign up</MenuItem>
                  </>
                }
              </Box>
            )}
          </Menu>}

          <IconButton component={Link} to="/cart-Page" sx={{color: 'white'}}>
            <ShoppingCartOutlinedIcon />
          </IconButton>

          {/* language icon + menu */}
          {false && <>
            <IconButton onClick={handleLanguageClick} color="inherit">
            <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              className={styles.languageMenu}
            >
            <MenuItem onClick={() => handleLanguageChange("en")}>🇬🇧 English</MenuItem>
            <MenuItem onClick={() => handleLanguageChange("ar")}>🇸🇦 العربية</MenuItem>
            </Menu>
          </>}
        </div>

      </header>
  );
};

export default Navbar;
