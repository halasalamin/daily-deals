import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import {  IconButton } from "@mui/material";
import ButtonComponent from "../../widgets/ButtonComponent";
import { signInWithGoogle, signInWithFacebook, loginWithEmail, signInWithMicrosoft } from "../../utils/auth";
import styles from "./login.module.css";
import { motion } from "framer-motion";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from "axios";
import appLogo from "../../assets/appLogo.png";
import shoppingBackground from "../../assets/shoppingBackground.png";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { googleImage, microsoftImage, facebookImage } from '../../constants';
import TextField from '../../widgets/TextField';
import UserTypeSelector from '../../widgets/UserTypeSelector';



const Login = ({ setUserData }) => {
  const [userType, setUserType] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");


  const navigate = useNavigate();

  const handleLogin = async () => {
  let hasError = false;

    if (!email) {
    setEmailError("Email is required");
    hasError = true;
  } else {
    setEmailError("");
  }

  if (!password) {
    setPasswordError("Password is required");
    hasError = true;
  } else {
    setPasswordError("");
  }
  setLoginError("");
  if (hasError) return;
  setLoading(true);

    try {
      const { token, user } = await loginWithEmail(email, password, userType);

      localStorage.setItem("token", token);

      const cartResponse = await axios.get(`http://localhost:4000/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
      const cartItems = cartResponse.data.data;
      setUserData(user, token, cartItems);

      if (user.role === 'company') {
        navigate('/company-dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      setLoginError("Email or password is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.logoContainer} style={{marginTop: "-70px"}}>
        <img src={appLogo} alt="logo" className={styles.logo}/>
        <div>
          <img src={shoppingBackground} alt="shopping background" className={styles.welcomelogo}/>
        </div>
      </div>
      <div className={`${styles.formContainer} ${styles.loginForm}`}>
        <p className={styles.title}>Log in to your account</p>

        <div>
          <TextField
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startIcon={<MailOutlineIcon style={{color: '#0000008a'}}/>}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          <TextField
            placeholder="Password"
            name="password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<LockOutlinedIcon style={{color: '#0000008a'}}/>}
            error={Boolean(passwordError)}
            helperText={passwordError}
            endIcon={
              <IconButton className={styles.icon} sx={{
                marginRight: '-6px',
                borderRadius: 0,
                background: 'rgb(22 127 129 / 10%)',
                color: '#167f81',
                height: 40
              }} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
              </IconButton>
            }
          />
        </div>

        <ButtonComponent
          text={"Login"}
          onClick={handleLogin}
          disabled={loading}
          sx={{ width:"370px"}}
        />
        {loginError && (
          <p style={{ color: '#b00020', fontSize:"15px", marginTop: '15px', marginBottom:"-10px" }}>{loginError}</p>
        )}
        {userType === "customer" &&
          <div className={styles.thirdPartyLoginContainer}>
            <ButtonComponent
              icon={<img alt="Sign in with Google" src={googleImage}/>}
              text={'Google'}
              variant='outlined'
              capitalize
              onClick={() => signInWithGoogle(navigate)}
              className={styles.googleButton}
            />
            <ButtonComponent
              icon={<img alt="Sign in with Facebook" src={facebookImage} className={styles.facebookImage}/>}
              text={'Facebook'}
              variant='outlined'
              capitalize
              onClick={() => signInWithFacebook(navigate)}
              className={styles.facebookButton}
            />
            <ButtonComponent
              icon={<img alt="Sign in with Microsoft" src={microsoftImage} />}
              text={'Microsoft'}
              variant='outlined'
              capitalize
              onClick={() => signInWithMicrosoft(navigate)}
              className={styles.facebookButton}
            />
          </div>
        }
        <div className={styles.thirdPartyLoginContainer} style={{width: 260, marginTop: "20px"}}>
          <p>Don't have an account?</p>
          <ButtonComponent
            text={'Sign up'}
            variant='outlined'
            capitalize
            onClick={() => userType === 'seller' ? navigate('/support') : navigate('/register')}
            className={styles.signUpButton}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <UserTypeSelector value={userType} onChange={setUserType} />
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
