import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/auth";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "antd/dist/reset.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Aboutus from "./components/Aboutus";
import Vehicles from "./components/Vehicles";
import Services from "./components/Services";
import Contactus from "./components/Contactus";
import Footer from "./components/Footer";
import VehicleDetails from "./components/vehicle/VehicleDetails";
import BookingForm from "./components/vehicle/BookingForm";
import PaymentPage from "./components/vehicle/PaymentPage";
import Profile from "./components/Profile";
import Admin from "./components/admin/Admin";
import Updatevehicle from "./components/vehicle/Updatevehicle";
import StripeProvider from "./components/payment/StripeProvider";
import PaymentSuccess from "./components/vehicle/PaymentSuccess";

function App() {
  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.token = storedToken;
        dispatch(authActions.login(parsedUser)); // ✅ Update user
        dispatch(authActions.changeRole(parsedUser.role)); // ✅ Update role
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user"); // Reset corrupted data
      }
    }
  }, []);

  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/get-vehicle-by-id/:id" element={<VehicleDetails />} />
            <Route path="/book/:vehicleId" element={<BookingForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route
              path="/paymentpage"
              element={
                <StripeProvider>
                  <PaymentPage />
                </StripeProvider>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/adminpro" element={<Admin />} />
            <Route path="/update-vehicle/:id" element={<Updatevehicle />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
