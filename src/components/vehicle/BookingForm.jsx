import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/booking-form.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ data }) => {
  const { vehicleId } = useParams();
  const [bookedDates, setBookedDates] = useState([]); // Store booked dates
  const [vehicleData, setVehicleData] = useState({}); // Store booked dates

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
    totalAmount: null,
    withDriver: false,
    licenseNumber: "",
  });

  useEffect(() => {
    if (vehicleId) {
      fetchBookedDates();
    }
  }, [vehicleId]);

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/v2/bookings/${vehicleId}`
      );
  
      const data = response.data;
  
      const bookedDatesArray = [];
  
      data.bookings.forEach((booking) => {
        let start = new Date(booking.startDate);
        let end = new Date(booking.endDate);
  
        // Store all dates from start to end
        while (start <= end) {
          bookedDatesArray.push(new Date(start)); // Push a new Date object
          start.setDate(start.getDate() + 1); // Increment day
        }
      });
  
      setVehicleData(data.vehicle);
      setBookedDates(bookedDatesArray);
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
  };
  

  useEffect(() => {
    if (formData.startDate && formData.duration && !formData.endDate) {
      // Case 1: Start Date + Duration → Calculate End Date
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(formData.duration));

      const totalAmount = Number(formData.duration) * (vehicleData.rent || 0);

      setFormData((prev) => ({
        ...prev,
        endDate: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        totalAmount,
      }));
    } else if (formData.startDate && formData.endDate && !formData.duration) {
      // Case 2: Start Date + End Date → Calculate Duration & Amount
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate > startDate) {
        const duration = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        ); // Calculate days difference

        const totalAmount = duration * (vehicleData.rent || 0);

        setFormData((prev) => ({
          ...prev,
          duration: duration.toString(),
          totalAmount,
        }));
      }
    }
  }, [formData.startDate, formData.duration, formData.endDate, vehicleData]);

  const isDateBooked = (date) => {
    return bookedDates.some((bookedDate) => {
      return bookedDate.toDateString() === date.toDateString();
    });
  };

  // Handle start date change
  const handleStartDateChange = (date) => {
    setFormData({ ...formData, startDate: date });
  };


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
    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
  
    // Construct full address dynamically
    updatedFormData.address = `${updatedFormData.area || ""}, ${updatedFormData.location || ""}, ${updatedFormData.city}, ${updatedFormData.state}, ${updatedFormData.country}, ${updatedFormData.pincode || ""}`.replace(/ ,/g, "").trim();
  
    setFormData(updatedFormData);
  };
  

  // Handle checkbox change properly
  const handleDriverOption = (isWithDriver) => {
    setFormData({
      ...formData,
      withDriver: isWithDriver,
      licenseNumber: isWithDriver ? "" : formData.licenseNumber,
    });
  };

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
        toast.success("Booking is created")
      } else {
        toast.warn("Booking created, but no Booking ID returned!");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(error.response?.data?.message || "Booking failed!");
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
                <select
                  name="country"

                >
                  <option>India</option>
                </select>
              </div>
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"

                >
                  <option>Gujarat</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <select
                  name="city"

                >
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
                <input
                  type="text"
                  name="location"
                  value={formData.location} // Add value
                  onChange={handleChange} 
                  placeholder="Enter location"
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode} // Add value
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>

            {/* Area */}
            <div className="form-group">
              <label>Area</label>
              <textarea
                placeholder="Enter area details"
                name="area"
                value={formData.area} // Add value
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Pickup Time & Duration & Total Amount */}
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData({ ...formData, startDate: date })}
                  minDate={new Date()} // Disable past dates
                  filterDate={(date) => !isDateBooked(date)} // Disable booked dates
                  dateFormat="yyyy-MM-dd"
                  dayClassName={(date) => (isDateBooked(date) ? "booked-day" : "")}
                />

                <label className="mt-4">End Date</label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => setFormData({ ...formData, endDate: date })}
                  minDate={formData.startDate || new Date()} // Ensure end date is after start date
                  filterDate={(date) => !isDateBooked(date)}
                  dateFormat="yyyy-MM-dd"
                  dayClassName={(date) => (isDateBooked(date) ? "booked-day" : "")}
                />
              </div>
              <div className="form-group">
                <label>Pickup Time</label>
                <DatePicker
                  selected={formData.pickupTime}
                  onChange={(time) => {
                    // Ensure pickupTime uses the same date as startDate
                    if (formData.startDate) {
                      const selectedDate = new Date(formData.startDate);
                      selectedDate.setHours(time.getHours(), time.getMinutes()); // Merge time into startDate
                      setFormData({ ...formData, pickupTime: selectedDate });
                    } else {
                      alert("Please select a start date first.");
                    }
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                />
              </div>
              <div className="form-group">
                <label>Duration (in days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration"
                />
              </div>
              <div className="form-group">
                <label>Total Amount:</label>
                <input
                  type="number"
                  name="totalAmount"
                  // onChange={handleChange}
                  value={formData.totalAmount}
                  readOnly
                  placeholder="Total Amount"
                />
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
              <button type="button" className="back-btn">
                <Link className="clink" to="/vehicles">
                  Back
                </Link>
              </button>
              <button type="submit" className="pay-btn bg-[#f9a826]">
                Proceed to Pay
              </button>
            </div>
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
      </div>
    </div>
  );
};

export default BookingForm;
