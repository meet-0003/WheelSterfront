import React, { useEffect, useState } from "react";
import { Table, Spin, message, Tag, Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchBookings();
  }, [user]); // Fetch only when the user changes

  // ✅ Fetch bookings from the API
  const fetchBookings = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:2000/api/v2/driver/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept or Reject Booking
  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await axios.put(
        `http://localhost:2000/api/v2/bookings/${bookingId}`,
        { action },
        { headers: { authorization: `bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 200) {
        message.success(`Booking ${action} successfully!`);

        // ✅ Update local state instead of refetching everything
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, driverStatus: action } : b))
        );
      } else {
        message.error(`Failed to ${action} booking.`);
      }
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
      message.error(`Failed to ${action} booking.`);
    }
  };

  const columns = [
    { title: "User", dataIndex: "username", key: "username" },
    { title: "Vehicle", dataIndex: "vehicleName", key: "vehicleName" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Pickup Time",
      dataIndex: "pickupTime",
      key: "pickupTime",
      render: (time) =>
        time
          ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
          : "N/A",
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Confirmed" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => <Tag color={status === "Paid" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.withDriver && record.driverStatus === "pending" ? (
          <Select
          value={record.driverStatus}
            style={{ width: 120 }}
            onChange={(value) => handleBookingAction(record._id, value === "accepted" ? "accept" : "reject")}
            >
            <Select.Option value="accepted">Accept</Select.Option>
            <Select.Option value="rejected">Reject</Select.Option>
          </Select>
        ) : (
          <Tag color={record.driverStatus === "accepted" ? "green" : "red"}>
            {record.driverStatus.charAt(0).toUpperCase() + record.driverStatus.slice(1)}
          </Tag>
        ),
    },
  ];

  return (
    <div>
      <h2>My Vehicle Bookings</h2>
      {loading ? <Spin size="large" /> : <Table dataSource={bookings} columns={columns} rowKey="_id" />}
    </div>
  );
};

export default Booking;
