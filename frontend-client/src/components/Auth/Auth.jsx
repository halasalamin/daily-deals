import { useState } from "react";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import styles from "./Auth.module.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {isLogin ? <Login /> : <Register />}
        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className={styles.toggleButton} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
