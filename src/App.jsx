import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {authActions} from './store/auth';
import { Route, Routes, useLocation } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Home from './pages/Home'
import Header from './components/Header'
import Login from './components/Login'
import Signup from './components/Signup'
import Aboutus from './components/Aboutus'
import Vehicles from './components/Vehicles'
import Services from './components/Services'
import Contactus from './components/Contactus'
import Footer from './components/Footer';
import VehicleDetails from './components/vehicle/VehicleDetails';
import BookingForm from './components/vehicle/BookingForm';
import PaymentPage from './components/vehicle/PaymentPage';
import Profile from './components/Profile';
import Admin from './components/admin/Admin';
import Updatevehicle from './components/vehicle/Updatevehicle';


function App() {

  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if(
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ){
      dispatch(authActions.login(JSON.parse(localStorage.getItem("user"))));
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  },[]);


  return (
    <>
      <div>
        <Header/>
        <Routes>
          <Route>
            <Route exact path="/" element={<Home />} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/aboutus' element={<Aboutus/>} />
            <Route path='/vehicles' element={<Vehicles/>} />
            <Route path='/services' element={<Services/>} />
            <Route path='/contactus' element={<Contactus/>} />
            <Route path='/get-vehicle-by-id/:id' element={<VehicleDetails/>} />
            <Route path='/book/:vehicleId' element={<BookingForm/>} />
            <Route path='/paymentpage' element={<PaymentPage/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/adminpro' element={<Admin/>} />
            <Route path="/update-vehicle/:id" element={<Updatevehicle />} />
          </Route>
        </Routes>
       <Footer/>
        </div>
    </>
  )
}

export default App