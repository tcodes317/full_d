import { useState } from 'react';
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
// import GoogleLoginButton from "./components/GoogleLogin.jsx";
import ForgotPassword from "./components/forgotpassword.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { Toaster } from "react-hot-toast";
import PrivateRoute from './components/PrivateRoute.jsx';
import CodeVerification from "./components/CodeVerification.jsx";
import VerifyEmail from "./components/verifyEmail.jsx";
import Slider from "./components/Slider.jsx";
import Carousel from "./components/Carousel.jsx";
import Card from "./components/Card.jsx";
import CardII from "./components/CardII.jsx";
import CardIII from "./components/CardIII.jsx";
import CardIv from "./components/CardIv.jsx";
import NotFound from "./components/NotFound.jsx";

// ADMIN INFO
import AdminLogin from './components/Admin/AdminLogin.jsx';
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminPrivateRoute from "./components/Admin/PrivateRoute.jsx";
import AdminRegister from "./components/Admin/AdminRegister.jsx";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = ()=>{
    setIsAuthenticated(true);
  }

  const handleLogout = ()=>{
    setIsAuthenticated(false)
  }

  return (
    <>
      <BrowserRouter>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
            }
          />
          {/* <Route path="/google-auth" element={<GoogleLoginButton />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-code" element={<CodeVerification />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/slider" element={<Slider />} />
          <Route path="/carousel" element={<Carousel />} />
          <Route path="/card" element={<Card />} />
          <Route path="/cardii" element={<CardII />} />
          <Route path="/cardiii" element={<CardIII />} />
          <Route path="/cardiv" element={<CardIv />} />
          <Route path="*" element={<NotFound />} />

          {/** Admin information */}
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/** Protect the Admin Dashboard route */}
          <Route path="/admin/dashboard" element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App