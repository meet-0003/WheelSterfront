import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, message, Select, Modal, Badge } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

function AllBooking() {
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const role = useSelector((state) => state.auth.role);


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

  const fetchUserInfo = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:2000/api/v2/users/${userId}`, {
        headers: { authorization: `bearer ${localStorage.getItem("token")}` },
      });
      setSelectedUser(res.data.user);
      setUserInfo(res.data.user);
      setUserModalVisible(true);
    } catch (error) {
      console.error("Error fetching user info:", error);
      message.error("Failed to fetch user details.");
    }
  };

  const fetchDriverInfo = async (driverId) => {
    try {
      const res = await axios.get(`http://localhost:2000/api/v2/driver-info/${driverId}`, {
        headers: { authorization: `bearer ${localStorage.getItem("token")}` },
      });
      setSelectedUser(res.data.driverInfo);
      setDriverInfo(res.data.driverInfo);
      setDriverModalVisible(true);
    } catch (error) {
      console.error("Error fetching user info:", error);
      message.error("Failed to fetch user details.");
    }
  };

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


  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await axios.put(
        "http://localhost:2000/api/v2/bookings-status",
        { id: bookingId, status: newStatus },
        {
          headers: { authorization: `bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success(res.data.message);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Failed to update status.");
    }
  };


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



  const renderStatus = (status, driverStatus) => {
    if (status === "Cancelled") return <span style={{ color: "red" }}>Cancelled</span>;
    if (status === "Confirmed") return <span style={{ color: "green" }}>Confirmed</span>;
    if (status === "Completed") return <span style={{ color: "green" }}>Completed</span>;
    if (driverStatus === "rejected") return <span style={{ color: "orange" }}>Driver rejected</span>;
    if (driverStatus === "pending") return <span style={{ color: "blue" }}>Waiting for Driver Confirmation</span>;
    if (driverStatus === "accepted") return <span style={{ color: "green" }}>Confirmed</span>;
    return <span>{status}</span>;
  };

  const columns = [
    {
      title: "Username",
      dataIndex: ["user", "username"],
      key: "username",
      render: (text, record) => (
        <a style={{ color: "blue", cursor: "pointer" }} onClick={() => fetchUserInfo(record.user._id)}>
          {text}
        </a>
      ),
    },
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
    {
      title: "Driver",
      dataIndex: ["driver", "username"],
      key: "driver",
      render: (text, record) => {
        return (
          <a style={{ color: "blue", cursor: "pointer" }} onClick={() => fetchDriverInfo(record.driver._id)}>
            {text}
          </a>
        );
      },
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <div>
            {/* Admin can change status */}
            {role === "admin" && (
              <Select
                defaultValue={record.status}
                className="custom-select"
                style={{ width: 178, marginRight: 10 }}
                dropdownStyle={{ backgroundColor: "#f0f0f0" }} // Light gray background for dropdown
                onChange={(value) => handleStatusChange(record._id, value)}
              >

                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            )}
          </div>

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
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }} className="text-2xl">
        {role === "admin" ? "All Bookings (Admin View)" : "My Bookings"}
      </h2>

      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
        style={{ borderRadius: "8px", overflow: "hidden" }}
      />

      <Modal
        title={
          <div className="flex items-center gap-3">
            <span>User Details</span>
            <Badge
              count={selectedUser?.role}
              style={{
                backgroundColor: selectedUser?.role === "driver" ? "#52c41a" : "#1890ff",
                fontSize: "12px",
              }}
            />
          </div>
        }
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div className="flex items-center gap-6">
            {/* Avatar Section */}
            <div className="w-[120px] h-[100px] flex-shrink-0">
              {selectedUser?.avatar && (
                <img
                  src={`http://localhost:2000${selectedUser.avatar}`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border border-gray-300 shadow-sm"
                />
              )}
            </div>

            {/* User Info Section */}
            <div className="flex flex-col">
              <h2><strong>Username:</strong> {selectedUser?.username}</h2>
              <p><strong>Email:</strong> {selectedUser?.email}</p>
              <p><strong>Phone Number:</strong> {selectedUser?.phnumber}</p>
              <p><strong>Address:</strong> {selectedUser?.address}</p>
            </div>
          </div>

        )}
      </Modal>

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

      <Modal
        title={
          <div className="flex items-center gap-3">
            <span>Driver Details</span>
          </div>
        }
        open={driverModalVisible}
        onCancel={() => setDriverModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div className="flex items-center gap-6">
            {/* Avatar Section */}
            <div className="w-[120px] h-[100px] flex-shrink-0">
              {selectedUser?.avatar && (
                <img
                  src={`http://localhost:2000${selectedUser.avatar}`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border border-gray-300 shadow-sm"
                />
              )}
            </div>

            {/* User Info Section */}
            <div className="flex flex-col">
              <h2><strong>Username:</strong> {selectedUser?.username}</h2>
              <p><strong>Email:</strong> {selectedUser?.email}</p>
              <p><strong>Phone Number:</strong> {selectedUser?.phnumber}</p>
              <p><strong>Address:</strong> {selectedUser?.address}</p>
              <p><strong>License Number:</strong> {selectedUser?.licenseNumber}</p>
              <p><strong>License Expiry:</strong> {selectedUser?.licenseExpiry}</p>
              <p><strong>Experience:</strong> {selectedUser?.experience}</p>
              <p><strong>Ability:</strong> {selectedUser?.ability}</p>
              <p><strong>Age:</strong> {selectedUser?.age}</p>
              <p><strong>Gender:</strong> {selectedUser?.gender}</p>
              <p><strong>Date of Birth:</strong> {selectedUser?.dob}</p>
            </div>
          </div>

        )}
      </Modal>


      {/* CSS Styling */}
      <style>
        {`
          .table-row-light, .table-row-dark { text-align: center; }
          .ant-table-tbody > tr > td { text-align: center !important; }
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

export default AllBooking;
