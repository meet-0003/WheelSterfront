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
    
  ];

  return (
    <div>
      <Table dataSource={bookings} columns={columns} rowKey="_id" />
    </div>
  );
}

export default Bookings;
