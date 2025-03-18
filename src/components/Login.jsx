import React, { useEffect, useState } from "react";
import "../styles/login.css";
import { authActions } from '../store/auth';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [Values, setValues] = useState({ username: "", password: "" })

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);


  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  }

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (!Values.username.trim() || !Values.password.trim()) {
        alert("All fields are required.");
        return;
      }
      const response = await axios.post("http://localhost:2000/api/v2/sign-in", Values);
      console.log("Server Response:", response);

      dispatch(authActions.login(response.data));  
      dispatch(authActions.changeRole(response.data.role));
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("user", JSON.stringify(response.data));  
      onClose();
      navigate('/')
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("http://localhost:2000/api/v2/forgot-password", { email: forgotEmail });
      toast.success(response.data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }
    setStep(3); 
  };

  // Handle OTP Verification & Password Reset
  const handleResetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:2000/api/v2/reset-password", {
        email: forgotEmail,
        otp,
        newPassword
      });
      toast.success(response.data.message);
      setShowForgotPassword(false);
      setStep(1);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  return (
    <>
      {/* Blurred Background Overlay */}
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      {/* Sliding Login Panel */}
      <form action="">
        <div className={`login-panel ${isOpen ? "active" : ""}`}>
          <div className="login-container">
            <span className="close-btn" onClick={onClose}>✖</span>
            <h2>Personal account login</h2>

            <label className="label">
              Username
            </label>
            <input type="text" name='username' placeholder='Enter your username...' className="input-box" autoComplete='username' value={Values.username}
              onChange={change} required />

            <label className="label">Password</label>
            <div className="password-container">
              <input
                type="password"
                name="password"
                placeholder="Enter your password..."
                className="input-box"
                autoComplete="current-password"
                value={Values.password}
                onChange={change}
                required
              />
            </div>

            <Link className="forgot-password" onClick={() => setShowForgotPassword(true)}>Forgot your password?</Link>
            {showForgotPassword && (
              <div className="forgot-password-modal">
                <div className="modal-content">
                  <span className="close-btn" onClick={() => setShowForgotPassword(false)}>✖</span>
                  <h2>Reset Password</h2>

                  {step === 1 && (
                    <>
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="input-box"
                        placeholder="Enter your email"
                      />
                      <button onClick={(e) => { e.preventDefault(); handleForgotPassword(); }} className="login-button">
                        Send OTP
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value); console.log("OTP Entered:", e.target.value); }}
                        className="input-box"
                        placeholder="Enter OTP"
                      />
                      <button onClick={(e) => { e.preventDefault(); handleVerifyOTP(); }} className="login-button">
                        Verify OTP
                      </button>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <label>New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-box"
                        placeholder="Enter new password"
                      />
                      <button onClick={(e) => { e.preventDefault(); handleResetPassword(); }} className="login-button">
                        Reset Password
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}


            <button onClick={submit} className="login-button"> Log in</button>
            <a href="/Signup" className="business-account">
              Sign Up! If you don't have an account.<span className="arrow">↗</span>
            </a>
          </div>

        </div>
      </form>

    </>
  );
};

export default Login;