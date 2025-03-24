import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Select, Button, message } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const role = useSelector((state) => state.auth.role);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/v2/bookings", {
          headers: { authorization: `bearer ${localStorage.getItem("token")}` },
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Fetch available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/v2/drivers", {
          headers: { authorization: `bearer ${localStorage.getItem("token")}` },
        });
        setDrivers(res.data.drivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  // Handle driver reassignment
  const handleReassignDriver = async (bookingId, newDriverId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:2000/api/v2/bookings/${bookingId}/reassign-driver`,
        { newDriverId },
        { headers: { authorization: `bearer ${token}` } }
      );

      message.success(response.data.message);

      // Update the booking list
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, driver: newDriverId, status: "Pending" }
            : booking
        )
      );
    } catch (error) {
      console.error("Failed to reassign driver:", error);
      message.error("Error: Could not reassign driver");
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
        role === "admin" ? (
          <span>{status}</span>
        ) : (
          <span>{status}</span>
        ),
    },
    {
      title: "Reassign Driver",
      key: "reassignDriver",
      render: (_, record) =>
        role === "admin" && record.status === "Driver Rejected" ? (
          <Select
            placeholder="Select Driver"
            onChange={(newDriverId) =>
              handleReassignDriver(record._id, newDriverId)
            }
            style={{ width: 150 }}
          >
            {drivers.map((driver) => (
              <Option key={driver._id} value={driver._id}>
                {driver.username}
              </Option>
            ))}
          </Select>
        ) : (
          <span>-</span>
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
