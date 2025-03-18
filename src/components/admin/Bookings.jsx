import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Select, Button, message } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const role = useSelector((state) => state.auth.role);

  // Fetch bookings based on role
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/v2/bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Handle status update
  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(
        "http://localhost:2000/api/v2/bookings-status",
        { id, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      message.success("Booking status updated successfully");
      
      // Update state after status change
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Failed to update booking status");
    }
  };

  const columns = [
    { title: "Username", dataIndex: ["user", "username"], key: "username" },
    { title: "Vehicle", dataIndex: ["vehicle", "name"], key: "vehicle" },
    { title: "Pickup Time", dataIndex: "pickupTime", key: "pickupTime" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        role === "admin" || role === "driver" ? (
          <Select
            defaultValue={status}
            onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
            style={{ width: 120 }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        ) : (
          <span>{status}</span>
        ),
    },
  ];

  return (
    <div>
      <Table dataSource={bookings} columns={columns} rowKey="_id" />
    </div>
  );
}

export default Bookings;
