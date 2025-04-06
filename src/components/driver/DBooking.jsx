import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, message, Modal } from "antd";
import { useSelector } from "react-redux";
import { BookingStatus } from "../../enum";

function DBooking() {
  const [bookings, setBookings] = useState([]);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState(null);

  const role = useSelector((state) => state.auth.role);

  const renderStatus = (status, driverStatus) => {
    if (status === BookingStatus.CANCELLED) {
      return <span style={{ color: "red" }}>Cancelled</span>;
    }
    if (status === BookingStatus.CONFIRMED) {
      return <span style={{ color: "green" }}>Confirmed</span>;
    }
    if (status === BookingStatus.COMPLETED) {
      return <span style={{ color: "green" }}>Completed</span>;
    }
    if (driverStatus === "declined") {
      return <span style={{ color: "orange" }}>Driver rejected</span>;
    }
    if (driverStatus === "pending") {
      return <span style={{ color: "blue" }}>Waiting for Driver Confirmation</span>;
    }
    if (driverStatus === BookingStatus.ACCEPTED) {
      return <span style={{ color: "green" }}>Confirmed</span>;
    }
    return <span>{status}</span>;
  };





  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/v2/bookings", {
          headers: { authorization: `bearer ${localStorage.getItem("token")}` },
        });

        // Access the bookings array from the response
        const bookingsData = res.data.bookings;

        if (!Array.isArray(bookingsData)) {
          console.error("Unexpected data format:", res.data);
          return;
        }

        // Get removed booking IDs from localStorage
        const removedBookings = JSON.parse(localStorage.getItem("removedBookings")) || [];

        // Filter out removed bookings
        const filteredBookings = bookingsData.filter(booking => !removedBookings.includes(booking._id));

        setBookings(filteredBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const fetchVehicleInfo = async (vehicleId) => {
    try {
      const res = await axios.get(`http://localhost:2000/api/v2/get-vehicle-by-id/${vehicleId}`);
      setVehicleInfo(res.data.data);
      setVehicleModalVisible(true);
    } catch (error) {
      console.error("Error fetching vehicle info:", error);
      message.error("Failed to fetch vehicle details.");
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await axios.post(
        "http://localhost:2000/api/v2/cancel-booking",
        { bookingId },
        {
          headers: { authorization: `bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success(res.data.message);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled", refundedAmount: res.data.refundedAmount }
            : booking
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("Failed to cancel booking.");
    }
  };

  const handleRemoveFromView = (bookingId) => {
    console.log("Removing booking with ID:", bookingId);

    const removedBookings = JSON.parse(localStorage.getItem("removedBookings")) || [];
    removedBookings.push(bookingId);
    localStorage.setItem("removedBookings", JSON.stringify(removedBookings));

    setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
  };

  const columns = [
    { title: "Username", dataIndex: ["user", "username"], key: "username" },
    {
      title: "Vehicle",
      dataIndex: ["vehicle", "name"],
      key: "vehicle",
      render: (text, record) => (
        <a style={{ color: "blue", cursor: "pointer" }} onClick={() => fetchVehicleInfo(record.vehicle._id)}>
          {text}
        </a>
      ),
    },
    { title: "Pickup Time", dataIndex: "pickupTime", key: "pickupTime" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    {
      title: "Refunded Amount",
      dataIndex: "refundedAmount",
      key: "refundedAmount",
      render: (amount) => `₹${amount || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => renderStatus(record.status, record.driverStatus),
    },
    {
      title: "Driver Status",
      dataIndex: "driverStatus",
      key: "driverStatus",
      render: (driverStatus) => renderStatus("", driverStatus),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center", justifyItems: "center", paddingTop: "20px" }}>
          {/* Cancel Booking Button */}
          {record.status !== "Cancelled" && (
            <Button type="primary" danger onClick={() => handleCancelBooking(record._id)}>
              Cancel
            </Button>
          )}

          {/* Remove from frontend */}
          <Button type="default" onClick={() => handleRemoveFromView(record._id)} style={{ marginLeft: 10, backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
            Remove
          </Button>
        </div>
      ),

    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }} className="text-2xl">My Bookings</h2>

      <Table dataSource={bookings} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
        style={{ borderRadius: "8px", overflow: "hidden" }} />

      <Modal
        title="Vehicle Information"
        open={vehicleModalVisible}
        onCancel={() => setVehicleModalVisible(false)}
        footer={null}
      >
        {vehicleInfo ? (
          <div style={{ textAlign: "center" }}>
            {/* Display Vehicle Image if Available */}
            {vehicleInfo?.url && (
              <img
                src={vehicleInfo.url.startsWith("http") ? vehicleInfo.url : `http://localhost:2000${vehicleInfo.url}`}
                alt="Vehicle"
                style={{
                  width: "100%",
                  maxHeight: "100",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
            )}

            <p><strong>Status:</strong> {vehicleInfo.availability}</p>
            <p><strong>Vehicle Name:</strong> {vehicleInfo.name}</p>
            <p><strong>Registration Number:</strong> {vehicleInfo.registrationNumber}</p>
            <p><strong>Rent Per Day:</strong> ₹{vehicleInfo.rent}</p>
            <p><strong>Average Rating:</strong> {vehicleInfo.averageRating} ⭐</p>
            <p><strong>Gear:</strong> {vehicleInfo.gear}</p>
            <p><strong>Seats:</strong> {vehicleInfo.seat} seats</p>
            <p><strong>Pump:</strong> {vehicleInfo.pump}</p>
            <p><strong>Engine:</strong> {vehicleInfo.engine}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

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
}

export default DBooking;
