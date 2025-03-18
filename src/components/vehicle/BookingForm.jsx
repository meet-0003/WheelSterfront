import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker} from "react-leaflet";
import "../../styles/booking-form.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";


const BookingForm = ({ data }) => {

  const { vehicleId } = useParams(); 
  const [formData, setFormData] = useState({
    vehicleId: vehicleId, 
    startDate: "",
    endDate: "",
    location: "",
    area: "",
    city: "Surat",
    state: "Gujarat",
    country: "India",
    pincode: "",
    pickupTime: "",
    duration: "",
    totalAmount: 0, 
    withDriver: false,
    licenseNumber: "",
  });

  const [mapCenter, setMapCenter] = useState([21.1702, 72.8311]); // Default Surat location
  const [markerPosition, setMarkerPosition] = useState([21.1702, 72.8311]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleId: vehicleId, 
    }));
  }, [vehicleId]);

  const navigate = useNavigate();


  // Handle form change & update map immediately
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(newFormData);

    // Construct address & fetch location
    if (["location", "area", "city", "state", "country", "pincode"].includes(name)) {
      const fullAddress = `${newFormData.area}, ${newFormData.location}, ${newFormData.city}, ${newFormData.state}, ${newFormData.country}, ${newFormData.pincode}`;
      fetchLocation(fullAddress);
    }
  };

  
  

  // Function to fetch location coordinates
  const fetchLocation = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Error fetching map location:", error);
    }
  };




  // Handle checkbox change properly
  const handleDriverOption = (isWithDriver) => {
    setFormData({
      ...formData,
      withDriver: isWithDriver,
      licenseNumber: isWithDriver ? "" : formData.licenseNumber, 
    });
  };

  
  // Auto-update map on formData change
  useEffect(() => {
    const fullAddress = `${formData.area}, ${formData.location}, ${formData.city}, ${formData.state}, ${formData.country}, ${formData.pincode}`;
    fetchLocation(fullAddress);
  }, [formData.city, formData.state, formData.country, formData.location, formData.area, formData.pincode]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(
        "http://localhost:2000/api/v2/create-booking", 
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );

      if (response.data.bookingId) {
        // Store bookingId in localStorage or pass it via state
        localStorage.setItem("bookingId", response.data.bookingId);  
        
        // Redirect to payment page with bookingId
        navigate(`/paymentpage?bookingId=${response.data.bookingId}`);
      } else {
        alert("Booking created, but no Booking ID returned!");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.response?.data?.message || "Booking failed!");
    }
  };





  return (
    <div className="main-container">
      {/* Top Container with Heading */}
      <div className="heading-container">
        <h1>Vehicle Booking</h1>
      </div>

      <div className="booking-wrapper">
        {/* Left Side: Booking Form */}
        <div className="booking-container">
          <form className="booking-form" onSubmit={handleSubmit}>
            {/* Address Fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option>India</option>
                </select>
              </div>
              <div className="form-group">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange}>
                  <option>Gujarat</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option>Surat</option>
                  <option>Vadodara</option>
                  <option>Ahmedabad</option>
                </select>
              </div>
            </div>

            {/* Location & Pincode */}
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter pincode" />
              </div>
            </div>

            {/* Area */}
            <div className="form-group">
              <label>Area</label>
              <textarea placeholder="Enter area details" name="area" value={formData.area} onChange={handleChange}></textarea>
            </div>

            {/* Pickup Time & Duration & Total Amount */}
            <div className="form-row">
              <div className="form-group">
                <label>Pickup Time</label>
                <input type="datetime-local" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Duration (in days)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Enter duration" />
              </div>
              <div className="form-group">
                <label>Total Amount:</label>
                <input type="number" readOnly value={formData.totalAmount} placeholder="Total Amount" />
              </div>
            </div>

            {/* Driver Options */}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={!formData.withDriver}
                  onChange={() => handleDriverOption(false)}
                />
                Without Driver
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.withDriver}
                  onChange={() => handleDriverOption(true)}
                />
                With Driver
              </label>
            </div>

            {/* License Number (Only if 'Without Driver' is selected) */}
            {!formData.withDriver && (
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  required
                />
              </div>
            )}

            {/* Buttons */}
            <div className="form-buttons">
              <button type="button" className="continue-btn"><Link className="clink" to="/vehicles">Continue</Link></button>
              <button type="button" className="back-btn"><Link className="clink" to="/vehicles">Back</Link></button>
              <button type="submit" className="pay-btn">Proceed to Pay</button>
            </div>
          </form>
        </div>

        {/* Right Side: Map Container */}
        <div className="map-container">
        <h5>Pickup Location</h5>
        <MapContainer center={mapCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={markerPosition} icon={L.icon({ iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png", iconSize: [25, 41], iconAnchor: [12, 41] })} />
        </MapContainer>
      </div>
      </div>
    </div>
  );
};

export default BookingForm;