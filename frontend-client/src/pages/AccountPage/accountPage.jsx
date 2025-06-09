import React, { useState, useRef, useEffect } from "react";
import styles from "./accountPage.module.css";
import { IconButton, CircularProgress, AppBar, Toolbar } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import InfoDialog from "../../components/Dialog/AccountInfo";
import OrderPage from "../CustomerOrders/OrderPage";
import axios from "axios";
import { useSnackbar } from 'notistack';
import backgroundImage from "../../assets/appLogo.png";

const AccountPage = ({ user, logout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const [dialogType, setDialogType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const token = localStorage.getItem('token');

  // New state for selected section in main content
  const [selectedSection, setSelectedSection] = useState("dashboard");

  useEffect(() => {
  const fetchUserProfile = async () => {
    if (!token) return navigate("/login");

    try {
      const res = await axios.get("http://localhost:4000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data;
      if (data?.profilePhoto) {
        setUserProfilePic(data.profilePhoto);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  fetchUserProfile();
}, []);




const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setUserProfilePic(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("profilePhoto", file);

  try {
    await axios.post("http://localhost:4000/api/user/upload-photo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("User photo uploaded successfully!");
  } catch (error) {
    console.error("Error uploading user profile picture:", error);
  }
};


  const handleEditClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#167f81", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img
            src={backgroundImage}
            alt="logo"
            style={{ height: 115, width: 120, marginTop: -30, marginBottom: -30, cursor: "pointer" }}
            onClick={() => navigate('/')}
          />
        </Toolbar>
      </AppBar>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav>
            <h2 className={styles.sectionTitle}>My Account</h2>
            <ul className={styles.menuList}>
              <li
                className={selectedSection === "dashboard" ? styles.active : ""}
                onClick={() => setSelectedSection("dashboard")}
                style={{ cursor: "pointer" }}
              >
                Dashboard
              </li>
              <li
                className={selectedSection === "orders" ? styles.active : ""}
                onClick={() => setSelectedSection("orders")}
                style={{ cursor: "pointer" }}
              >
                Orders
              </li>
              <li onClick={() => navigate('/favorites')} style={{ cursor: "pointer" }}>
                My List
              </li>
              <li onClick={() => setDialogType("account")} style={{ cursor: "pointer" }}>
                Account Information
              </li>
              <li onClick={() => setDialogType("payment")} style={{ cursor: "pointer" }}>
                Payment Methods
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>Settings</h2>
            <ul className={styles.menuList}>
              <li>Privacy</li>
              <li>Communications</li>
            </ul>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {selectedSection === "dashboard" && (
            <>
              <div className={styles.profileCard}>
                <div className={styles.profileInfo}>
                  <div className={styles.avatar} onClick={handleEditClick}>
                    {userProfilePic ? (
                      <img
                        src={userProfilePic || "/default-avatar.jpg"}
                        alt="Profile"
                        className={styles.avatarImage}
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.jpg';
                        }}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}></div>
                    )}
                    <div className={styles.uploadOverlay}>
                      {isUploading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <EditIcon fontSize="small" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <p>Hey, <span style={{ fontWeight: 600 }}>{user?.username || "Guest"}!</span></p>
                </div>
                <div className={styles.profileIcons}>
                  <IconButton onClick={logout}>
                    <LogoutIcon />
                  </IconButton>
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className={styles.gridContainer}>
                {[
                  {
                    title: "Orders",
                    desc: "Track your order progress, request returns, reorder, or write reviews.",
                    onClick: () => setSelectedSection("orders"),
                  },
                  {
                    title: "My Lists",
                    desc: "Add your favorite items to keep track of availability and purchase later!",
                    onClick: () => navigate('/favorites'),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={styles.card}
                    onClick={item.onClick}
                    style={item.onClick ? { cursor: "pointer" } : {}}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSection === "orders" && (
            <div>
              <OrderPage isOpen={true} onClose={() => setSelectedSection("dashboard")} />
            </div>
          )}
        </main>

        {/* Dialogs */}
        {dialogType && (
          <InfoDialog
            isOpen={Boolean(dialogType)}
            onClose={() => setDialogType(null)}
            type={dialogType}
          />
        )}
      </div>
    </>
  );
};

export default AccountPage;
