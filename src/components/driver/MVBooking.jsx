import React, { useEffect, useState } from "react";
import { Table, Spin, message, Tag, Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { DriverStatus } from "../../enum";

const MVBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(fetchBookings, 100000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

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

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await axios.put(
        `http://localhost:2000/api/v2/bookings/${bookingId}`,
        { action },
        { headers: { authorization: `bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 200) {
        message.success(`Booking ${action} successfully!`);

        fetchBookings();
      } else {
        message.error(`Failed to ${action} booking.`);
      }
    } catch (error) {
      message.error(`Failed to ${action} booking.`);
    }
  };

  const columns = [
    { title: "User", dataIndex: "username", key: "username", align: "center" },
    { title: "Vehicle", dataIndex: "vehicleName", key: "vehicleName", align: "center" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Pickup Time",
      dataIndex: "pickupTime",
      key: "pickupTime",
      align: "center",
      render: (time) =>
        time
          ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
          : "N/A",
    },
    { title: "Address", dataIndex: "address", key: "address", align: "center" },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <Tag color={status === "Confirmed" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (status) => <Tag color={status === "Paid" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) =>
        record.withDriver && record.driverStatus === DriverStatus.PENDING ? (
          <Select
            value={record.driverStatus}
            style={{ width: 120 }}
            onChange={(value) => handleBookingAction(record._id, value)}
          >
            <Select.Option value={DriverStatus.ACCEPTED}>Accept</Select.Option>
            <Select.Option value={DriverStatus.REJECTED}>Reject</Select.Option>
          </Select>
        ) : (
          <Tag color={record.driverStatus === DriverStatus.ACCEPTED ? "green" : "red"}>
            {record.driverStatus.charAt(0).toUpperCase() + record.driverStatus.slice(1)}
          </Tag>
        ),
    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }} className="text-2xl">My Vehicle Bookings</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      )}

      {/* CSS for alternating row colors */}
      <style>
        {`
              .table-row-light,
              .table-row-dark {
                text-align: center; 
              }

              .ant-table-tbody > tr > td {
                text-align: center !important; 
              }

              .ant-table-thead > tr > th {
                background-color: #001529 !important;
                color: white !important;
                font-size: 16px;
                text-align: center !important;
                vertical-align: middle !important;
              }
        `}
      </style>
    </div>
  );
};

export default MVBooking;
