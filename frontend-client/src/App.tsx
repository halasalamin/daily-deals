import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import AnimatedRoutes from './AnimatedRoutes';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
      <ToastContainer />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
