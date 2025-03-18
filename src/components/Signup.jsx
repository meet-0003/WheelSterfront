import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import axios from 'axios';
import Login from './Login';

function Signup() {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const openLogin = () => setLoginOpen(true);
    const navigate = useNavigate();

    const [Values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        phnumber: "",
        avatar: ""
    });

    const change = (e) => {
        const { name, value } = e.target;
        setValues({ ...Values, [name]: value });
    }

    const handleFileChange = (e) => {
        setValues({ ...Values, avatar: e.target.files[0] });
    };

    const submit = async (e) => {
        e.preventDefault();
    
        // Destructure values
        const { username, email, password, phnumber, avatar } = Values;
    
        // Frontend Validations
        if (!username.trim() || !email.trim() || !password.trim() || !phnumber.trim()) {
            toast.warn("All fields are required.", { closeButton: false });
            return;
        }
    
        if (username.length < 4) {
            toast.warn("Username should be greater than 3 characters", { closeButton: false });
            return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warn("Invalid email format.", { closeButton: false });
            return;
        }
    
        if (password.length < 6) {
            toast.warn("Password should be greater than 5 characters", { closeButton: false });
            return;
        }
    
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phnumber)) {
            toast.warn("Invalid phone number format.", {closeButton: false });
            return;
        }
    
        try {
         
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phnumber", phnumber);
            if (avatar) {
                formData.append("avatar", avatar);
            }
    
            const response = await axios.post("http://localhost:2000/api/v2/sign-up", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            toast.success("Signup successful!", {closeButton: false });
          openLogin()
    
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message, {closeButton: false });
            } else {
                toast.error("Something went wrong. Please try again!", { closeButton: false });
            }
        }
    };
    

    return (
        <>
            <div className='signup-container'>
                <span className="close-btn"><Link to='/'>✖</Link></span>
                <h1>Sign Up</h1>
                <form onSubmit={submit}>
                    <div>
                        <label htmlFor='avatar'>Profile Photo</label>
                        <input
                            type='file'
                            name='avatar'
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='username'>Name</label>
                        <input
                            type='text'
                            name='username'
                            placeholder='Enter your name...'
                            value={Values.username}
                            onChange={change}
                            autoComplete='username'
                        />
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={Values.email}
                            onChange={change}
                            autoComplete='email'
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={Values.password}
                            onChange={change}
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <label htmlFor='phnumber'>Phone</label>
                        <input
                            type='text'
                            name='phnumber'
                            placeholder='Enter your phone number...'
                            value={Values.phnumber}
                            onChange={change}
                        />
                    </div>
                    <button type='submit'>Signup</button>
                    <span>Already have an account?
                        <Link onClick={openLogin}> Login</Link>
                    </span>
                    <ToastContainer position="top-center"
                        closeButton={false}
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark" />
                </form>
            </div>
            <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
        </>
    );
}

export default Signup;
