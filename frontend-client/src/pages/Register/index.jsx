import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import {  IconButton, Tooltip } from "@mui/material";
import ButtonComponent from "../../widgets/ButtonComponent";
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
import Checkbox from '../../widgets/Checkbox';

import { signInWithGoogle, signInWithFacebook, signInWithMicrosoft } from "../../utils/auth";
import { validationSchema } from "../../utils/validationSchema";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import { toast } from "react-toastify";
import * as Yup from "yup";

import styles from "./register.module.css";
import "react-toastify/dist/ReactToastify.css";

const Register = ({setUserData}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      if (!acceptedTerms) {
        setErrors({ terms: "You must accept the terms of service." });
        setLoading(false);
        return;
      }

      setErrors({});
      const response = await axios.post("http://localhost:4000/api/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUserData(user, token);

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formErrors = {};
        error.inner.forEach((err) => {
          if (err.path) formErrors[err.path] = err.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Registration failed:", error);
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
    <div className={styles.logoContainer} style={{marginTop: "-10px"}}>
      <img src={appLogo} alt="logo" className={styles.logo}/>
      <img src={shoppingBackground} alt="shopping background" className={styles.welcomelogo}/>
    </div>
    <div className={`${styles.formContainer} ${styles.loginForm}`}>
      <p className={styles.title}>Sign up</p>

      <div>
        <TextField
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          startIcon={<PersonOutlineOutlinedIcon style={{color: '#0000008a'}}/>}
        />
        <TextField
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          startIcon={<MailOutlineIcon style={{color: '#0000008a'}}/>}
        />
        <TextField
          placeholder="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          startIcon={<LockOutlinedIcon style={{color: '#0000008a'}}/>}
          endIcon={
            <IconButton className={styles.icon} sx={{
              marginRight: '-6px',
              borderRadius: 0,
              background: 'rgb(22 127 129 / 10%)',
              color: '#167f81',
              height: 40
            }}
            onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </IconButton>
          }
        />

        <TextField
          placeholder="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          startIcon={<LockOutlinedIcon style={{color: '#0000008a'}}/>}
          endIcon={
            <IconButton className={styles.icon} sx={{
              marginRight: '-6px',
              borderRadius: 0,
              background: 'rgb(22 127 129 / 10%)',
              color: '#167f81',
              height: 40
            }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </IconButton>
          }
        />
      </div>

      <div className={styles.terms}>
      <Checkbox
        checked={acceptedTerms}
        onChange={() => setAcceptedTerms(!acceptedTerms)}
        label={<>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a></>}
      />
      {errors.terms && <p className={styles.error}>{errors.terms}</p>}
      </div>

      <ButtonComponent
        text={"Sign up"}
        onClick={handleRegister}
        disabled={loading}
        sx={{ width:"370px"}}
      />



      {<div className={styles.thirdPartyLoginContainer} style={{justifyContent: 'center'}}>
        <Tooltip title="Sign in with Google">
        <IconButton onClick={() => signInWithGoogle(navigate)}>
        <img alt="Sign in with Google" src={googleImage} className={styles.icon} style={{height: 28}}/>
        </IconButton>
        </Tooltip>

        <Tooltip title="Sign in with Facebook">
        <IconButton onClick={() => signInWithFacebook(navigate)}>
        <img alt="Sign in with Facebook" src={facebookImage} className={styles.icon}/>
        </IconButton>
        </Tooltip>
        <Tooltip title="Sign in with Microsoft">
        <IconButton onClick={() => signInWithMicrosoft(navigate)}>
        <img alt="Sign in with Microsoft" src={microsoftImage} className={styles.icon} style={{height: 30}}/>
        </IconButton>
        </Tooltip>
      </div>}
      <div className={styles.thirdPartyLoginContainer} style={{width: 277}}>
        <p>Already have an account?</p>
        <ButtonComponent
          text={'Login'}
          variant='outlined'
          capitalize
          onClick={() => navigate('/login')}
          className={styles.signUpButton}
        />
      </div>
    </div>
    </motion.div>
  );
};

export default Register;
