import React, { useEffect, useState } from "react";
import { Button, Table, message, Modal } from "antd";
import axios from "axios";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null); // Store user details
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  // Fetch bookings from backend API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get("http://localhost:2000/api/v2/driver-bookings", {
          headers: { authorization: `bearer ${token}` },
        });

        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        message.error("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Fetch user details when clicking on the username
  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:2000/api/v2/users/${userId}`, {
        headers: { authorization: `bearer ${token}` },
      });

      setUserInfo(response.data.user);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      message.error("Failed to fetch user details");
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `http://localhost:2000/api/v2/bookings/${bookingId}/accept`, 
            {}, 
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        message.success(response.data.message);
        
        // Update UI after successful acceptance
        setBookings((prev) =>
            prev.map((booking) =>
                booking._id === bookingId ? { ...booking, status: "Accepted" } : booking
            )
        );
    } catch (error) {
        console.error("Error accepting booking:", error);
        message.error(error.response?.data?.message || "Failed to accept booking");
    }
};



  const columns = [
    {
      title: "User",
      dataIndex: ["user", "username"],
      key: "user",
      render: (text, record) => (
        <Button type="link" onClick={() => fetchUserDetails(record.user.id)}>
          {text}
        </Button>
      ),
    },
    { title: "Vehicle", dataIndex: ["vehicle", "name"], key: "vehicle" },
    { title: "Pickup Time", dataIndex: "pickupTime", key: "pickupTime" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <span style={{ fontWeight: "bold" }}>{status}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "Pending" ? (
          <Button type="primary" onClick={() => acceptBooking(record._id)}>Accept</Button>
        ) : (
          <span>Accepted</span>
        ),
    },
  ];

  return (
    <div>
      <h2>Driver's Bookings</h2>
      <Table dataSource={bookings} columns={columns} rowKey="_id" loading={loading} />

      {/* User Info Modal */}
      <Modal
        title="User Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {userInfo ? (
          <div>
            <p><strong>Name:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Phone:</strong> {userInfo.phnumber || "N/A"}</p>
            <p><strong>Address:</strong> {userInfo.address}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
