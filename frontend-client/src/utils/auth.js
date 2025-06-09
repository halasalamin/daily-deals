import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebaseConfig";
import { toast } from "react-toastify";
import axios from "axios";


const API_URL = 'http://localhost:4000/api/user';

// Login with Email
export const loginWithEmail = async (
  email,
  password,
  userType
) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
      userType
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Google Sign-In
// auth.ts (Social logins)
export const signInWithGoogle = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken(true);

    console.log("Token stored:", token);


    // Get role from backend after social login
    const roleResponse = await axios.post(
      `${API_URL}/auth/social`,
      {
        email: user.email,
        name: user.displayName,
        provider: "google",
        providerId: user.uid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.setItem("token", token); // Consistent key
    localStorage.setItem("userType", roleResponse.data.userType);

    console.log("Token stored:", token);

    navigate("/");
  } catch (error) {
    console.error("Error signing in with Google:", error);
    toast.error("Google sign-in failed.");
  }
};

// Facebook Sign-In
export const signInWithFacebook = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    const token = await user.getIdToken();


    console.log("Facebook user:", user);
    console.log("Firebase ID token:", token)


    const postData = {
      email: user.email || `${user.uid}@facebook.user`,
      name: user.displayName,
      provider: "facebook",
      providerId: user.uid
    };

    console.log("Sending to backend:", postData);

    const roleResponse = await axios.post(
      `${API_URL}/auth/social`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userType", roleResponse.data.userType);

    toast.success("Signed in with Facebook!");
    navigate("/");
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    toast.error("Facebook sign-in failed.");
  }
};

export const signInWithMicrosoft = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken(true);

    console.log("Token stored:", token);


    // Get role from backend after social login
    const roleResponse = await axios.post(
      `${API_URL}/auth/social`,
      {
        email: user.email,
        name: user.displayName,
        provider: "google",
        providerId: user.uid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.setItem("token", token); // Consistent key
    localStorage.setItem("userType", roleResponse.data.userType);

    console.log("Token stored:", token);

    navigate("/");
  } catch (error) {
    console.error("Error signing in with Google:", error);
    toast.error("Google sign-in failed.");
  }
};
