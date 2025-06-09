import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GrantAdAccessPage from './pages/advertisements/advertisement';
import Signin from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminOrdersPage from './pages/UserOrder/UserOrder';
import './App.css';
import Company from './pages/Company';
import './colors.css';

import AppContainer  from "./components/AppContainer";

import SalesPredictionFlowchart from './components/Report/SalesPredictionFlowchart';
import FakeSalesPredictionFlowchart from './components/FakeReport/SalesPredictionFlowchart';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const navigate = useNavigate();


  useEffect(() =>{
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setIsInitialized(true);

      return;
    }
    const fetchAdmin = async () => {
    try{
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get('http://localhost:4000/api/admin/me', {headers} )

      setUser(response.data.data);
      setIsLoggedIn(true);
      setToken(response.token);

    } catch(error){
      console.error("Error fetching admin data:", error?.response || error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/signin');
    } finally{
      setIsInitialized(true);
    };

  }
  fetchAdmin();

}, [])


  const setUserData = (userData, token) => {
    if (!userData) return;

    setUser(userData);
    setToken(token);
    setIsLoggedIn(true);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if (!isInitialized) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<Signin setUserData={setUserData} />} />
      <Route element={<AppContainer />}>
        <Route path="/" element={<Company />} />
        <Route path="/company" element={<Company />} />
        <Route path="/advertisement" element={<GrantAdAccessPage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/prediction" element={<SalesPredictionFlowchart />}/>
        <Route path="/fake-prediction" element={<FakeSalesPredictionFlowchart />}/>
      </Route>
    </Routes>
  );
}

export default App;
