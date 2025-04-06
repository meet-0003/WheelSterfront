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
  const [bookedDates, setBookedDates] = useState([]);
  const [completedDates, setCompletedDates] = useState([]);
  const [canceledDates, setCanceledDates] = useState([]);
  const [vehicleData, setVehicleData] = useState({});

  const [formData, setFormData] = useState({ vehicleId: vehicleId, startDate: "", endDate: "", location: "", area: "", city: "Surat", state: "Gujarat", country: "India", pincode: "", pickupTime: "", duration: "", totalAmount: 0, withDriver: false, licenseNumber: "", });

  useEffect(() => {
    if (vehicleId) {
      fetchBookedDates();
    }
  }, [vehicleId]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/api/v2/get-vehicle-by-id/${vehicleId}`);
        setVehicleData(response.data.data);
      } catch (error) {
        console.error("❌ Error fetching vehicle data:", error);
      }
    };

    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);


  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/api/v2/bookings/${vehicleId}`);
      const data = response.data;
      const bookedDatesArray = new Set();
      const completedDatesArray = new Set();
      const canceledDatesArray = new Set();

      data.bookings.forEach((booking) => {
        let start = new Date(booking.startDate);
        let end = new Date(booking.endDate);

        while (start <= end) {
          const timestamp = start.getTime();

          if (booking.status === "Completed") {
            completedDatesArray.add(timestamp);
          } else if (booking.status === "Cancelled") {
            canceledDatesArray.add(timestamp);
          } else if (booking.status === "Confirmed") {
            bookedDatesArray.add(timestamp);
          }

          start.setDate(start.getDate() + 1);
        }
      });

      setBookedDates([...bookedDatesArray]);
      setCompletedDates([...completedDatesArray]);
      setCanceledDates([...canceledDatesArray]);
    } catch (error) {
      console.error("❌ Error fetching booked dates:", error);
    }
  };




  const isDateBooked = (date) => bookedDates.includes(date.getTime());
  const isDateCompleted = (date) => completedDates.includes(date.getTime());
  const isDateCanceled = (date) => canceledDates.includes(date.getTime());



  const filterDate = (date) => {
    console.log(`Checking date: ${date.toDateString()}`);
    console.log(`Booked: ${isDateBooked(date)}, Completed: ${isDateCompleted(date)}, Canceled: ${isDateCanceled(date)}`);

    if (isDateCompleted(date) || isDateCanceled(date)) {
      return true;
    }
    return !isDateBooked(date);
  };


  const dayClassName = (date) => {
    if (isDateBooked(date)) {
      return "booked-day";
    } else if (isDateCompleted(date)) {
      return "completed-day";
    } else if (isDateCanceled(date)) {
      return "canceled-day";
    }
    return "";
  };


  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) return;

      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      const totalAmount = duration * (vehicleData.rent || 0);

      setFormData((prev) => ({
        ...prev,
        duration: duration.toString(),
        totalAmount,
      }));
    }
  }, [formData.startDate, formData.endDate, vehicleData.rent]);




  const handleStartDateChange = (date) => {
    let newEndDate = formData.endDate ? new Date(formData.endDate) : null;

    if (formData.duration) {
      newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + Number(formData.duration));
    }

    setFormData({
      ...formData,
      startDate: date,
      endDate: newEndDate || "",
    });
  };



  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleId: vehicleId,
    }));
  }, [vehicleId]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "duration" && formData.startDate) {
      const newEndDate = new Date(formData.startDate);
      newEndDate.setDate(newEndDate.getDate() + Number(value));

      updatedFormData.endDate = newEndDate;
      updatedFormData.totalAmount = Number(value) * (vehicleData.rent || 0);
    }

    setFormData(updatedFormData);
  };



  const handleDriverOption = (isWithDriver) => {
    setFormData({
      ...formData,
      withDriver: isWithDriver,
      licenseNumber: isWithDriver ? "" : formData.licenseNumber,
    });
  };

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
        localStorage.setItem("bookingId", response.data.bookingId);

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
      <div className="heading-container">
        <h1>Vehicle Booking</h1>
      </div>

      <div className="booking-wrapper">
        <div className="booking-container">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select name="country" >
                  <option>India</option>
                </select>
              </div>
              <div className="form-group">
                <label>State</label>
                <select name="state" >
                  <option>Gujarat</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <select name="city">
                  <option>Surat</option>
                  <option>Vadodara</option>
                  <option>Ahmedabad</option>
                </select>
              </div>
            </div>

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

            <div className="form-group">
              <label>Area</label>
              <textarea placeholder="Enter area details" name="area" value={formData.area} onChange={handleChange}>
              </textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  filterDate={filterDate}
                  dateFormat="yyyy-MM-dd"
                  dayClassName={dayClassName}
                />

                <label className="mt-4">End Date</label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => setFormData({ ...formData, endDate: date })}
                  minDate={formData.startDate || new Date()}
                  filterDate={filterDate}
                  dateFormat="yyyy-MM-dd"
                  dayClassName={dayClassName}
                />
              </div>
              <div className="form-group">
                <label>Pickup Time</label>
                <DatePicker
                  selected={formData.pickupTime}
                  onChange={(time) => {
                    if (formData.startDate) {
                      const selectedDate = new Date(formData.startDate);
                      selectedDate.setHours(time.getHours(), time.getMinutes());
                      setFormData({ ...formData, pickupTime: selectedDate });
                    } else {
                      alert("Please select a start date first.");
                    }
                  }} showTimeSelect showTimeSelectOnly timeIntervals={15} timeFormat="HH:mm" dateFormat="HH:mm" />
              </div>
              <div className="form-group">
                <label>Duration (in days)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Enter duration" />
              </div>
              <div className="form-group">
                <label>Total Amount:</label>
                <input type="number" name="totalAmount" value={formData.totalAmount} readOnly placeholder="Total Amount" />
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={!formData.withDriver} onChange={() => handleDriverOption(false)} />
                Without Driver
              </label>
              <label>
                <input type="checkbox" checked={formData.withDriver} onChange={() => handleDriverOption(true)} />
                With Driver
              </label>
            </div>

            {!formData.withDriver && (
              <div className="form-group">
                <label>License Number</label>
                <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="Enter license number" required />
              </div>
            )}

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
            <ToastContainer position="top-center" closeButton={false} autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
