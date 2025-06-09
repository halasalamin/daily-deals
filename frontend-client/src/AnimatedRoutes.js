import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Auth from './components/Auth/Auth';
import Layout from "./components/Layout";

import HomePage from './pages/HomePage/homePage';
import AccountPage from './pages/AccountPage/accountPage';
import CartPage from './pages/CartPage/CartPage';
import LoginPage from './pages/Login';
import CompanyAccount from './pages/CompanyAccount/CompanyAccountPage';
import RegisterPage from './pages/Register';
import ProductDetail from './pages/ProductDetails/ProductDetails';
import TermsPage from './pages/Term/TermsPage';
import { useCart } from './context/CartContext';
import FavoritesPage from './pages/FavoritePage/FavoritesPage';
import ShippingCheckoutPage from './pages/CheckoutPage/Checkout';
import CompanyInfo from './pages/Term/JoinUs';
import LoadingScreen from './pages/Loading';
import { Navigate } from 'react-router-dom';
import { useFavorites } from "./context/FavoritesContext";

 // this file for routing && save the information of user using local storage
 // framer-motion: Library
 // use effect: run the code when page is open or based on dependencies
function AnimatedRoutes() {

  const navigate = useNavigate();
  const location = useLocation(); // gets the current location

  const [user, setUser] = useState(null); // Stores the logged-in user information: Create and manage a local variable (state)
  const [isInitialized, setInitialized] = useState(false); // To check if data loading is complete
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const { getUserCart, clearCartStorage } = useCart();
  const { clearFavoriteStorage } = useFavorites();


  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceSort: "", // "asc" or "desc"
    priceRange: [0, Number.MAX_SAFE_INTEGER],
  });

// When the page first loads: It checks if there is a token in local storage.
// If token expired, it removes it.
// Otherwise, it fetches:
// user data (/api/user/me)
// cart data (/api/cart) using axios.

  useEffect(() => {  //  runs side-effects: Run code at specific times (like on page load or when a variable changes)
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setInitialized(true);

      return;
    }

    const fetchUserAndCart = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const response= await axios.get("http://localhost:4000/api/user/me", { headers });
        const userData = response.data.data;

        await getUserCart();
        setUser(userData);
        setIsLoggedIn(true);
        setToken(token);
      } catch (error) {
        console.error("Error fetching user data:", error?.response || error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
      } finally {
        setInitialized(true);
      }
    };

    fetchUserAndCart();
  }, []);

  const setUserData = (userData, token, cartData = []) => {
    if (!userData) return;

    setUser(userData);
    setToken(token);
    setIsLoggedIn(true);

    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');

    setIsLoggedIn(false);
    navigate("/login");
    setUser(null);
    setToken(null);
    clearFavoriteStorage();
    clearCartStorage();
  };

  if (!isInitialized) return <LoadingScreen />;

  const isCompanyUser = user?.role === 'company';
  const isCustomerUser = user?.role !== 'company';

  return (
      <AnimatePresence mode="wait">
        {/* User Routes */}
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout user={user} logout={logout} />}>
            <Route
              path="/"
              element={
                isCompanyUser ? <Navigate to="/company-dashboard" /> :
                <HomePage user={user}/>
              }
            />
            <Route
              path="/category/:categoryName"
              element={
                isCompanyUser ? <Navigate to="/company-dashboard" /> :
                <HomePage user={user}/>
              }
            />
            <Route
              path="/cart-page"
              element={
                isCompanyUser ? <Navigate to="/company-dashboard" /> :
                <CartPage user={user} />
              }
            />
            <Route
              path="/favorites"
              element={
                isCompanyUser ? <Navigate to="/company-dashboard" /> :
                <FavoritesPage user={user}/>
              }
            />
            <Route
              path="/product/:id"
              element={
                isCompanyUser ? <Navigate to="/company-dashboard" /> :
                <ProductDetail user={user} />
              }
            />
          </Route>
          <Route
            path="/checkout"
            element={
              isCompanyUser ? <Navigate to="/company-dashboard" /> :
              <ShippingCheckoutPage token={token} user={user} />
            }
          />

          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage setUserData={setUserData} />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage setUserData={setUserData} />}
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route path='/support' element={<CompanyInfo />} />
          {!isLoggedIn && <Route path="/auth" element={<Auth />} />}
          <Route path="/account-page" element={isLoggedIn && isCustomerUser ? <AccountPage user={user} logout={logout}/> : <Navigate to="/" />} />

          {/* company routes */}
          <Route
            path="/company-dashboard"
            element={isCompanyUser ? <CompanyAccount user={user} logout={logout}/> : <Navigate to="/" />}
          />
          <Route path="*" element={isCompanyUser ? <Navigate to="/company-dashboard" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
  );
}

export default AnimatedRoutes;
