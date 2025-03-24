import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const { user } = useSelector((state) => state.auth); // Get logged-in driver info

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user._id) {
        console.warn("User not found, skipping API call.");
        setLoading(false); // Stop loading if user is missing
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:2000/api/v2/driver/${user._id}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        message.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const columns = [
    {
      title: "User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Vehicle",
      dataIndex: "vehicleName",
      key: "vehicleName",
    },
    {
      title: "Booking Details",
      dataIndex: "bookingDetails",
      key: "bookingDetails",
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>My Vehicle Bookings</h2>
      <Table dataSource={bookings} columns={columns} rowKey="_id" />
    </div>
  );
};

export default Booking;
