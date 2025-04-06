import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Input, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const Approoval = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [status, setStatus] = useState("Approved");
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    message.config({
      top: 80,
      duration: 10,
    });

    fetchPendingVehicles();
  }, []);


  const fetchPendingVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Unauthorized: Please log in again.");
        return;
      }

      const res = await axios.get("http://localhost:2000/api/v2/pending-vehicles", {
        headers: { authorization: `Bearer ${token}` },
      });

      setVehicles(res.data.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      message.error("Failed to fetch pending vehicles. Please check your authentication.");
    }
  };


  const handleApproveReject = async () => {
    if (status === "Rejected" && !reason.trim()) {
      return message.error("Please provide a reason for rejection.");
    }

    try {
      await axios.put(
        `http://localhost:2000/api/v2/approve-vehicle/${selectedVehicle._id}`,
        { status, reason },
        { headers: { authorization: `bearer ${localStorage.getItem("token")}` } }
      );

      message.success(`Vehicle ${status} successfully!`);
      fetchPendingVehicles();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update vehicle status.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-4">Vehicle Approval</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle._id}
            title={vehicle.name}
            variant={true}
            className="shadow-md rounded-xl"
          >
            <p><b>Added By:</b> {vehicle.addedBy.username} ({vehicle.addedBy.email})</p>
            <p><b>Type:</b> {vehicle.vehicleType}</p>
            <p><b>Model:</b> {vehicle.name}</p>
            <p><b>Rent Price:</b>₹ {vehicle.rent}/day</p>
            <p><b>Registration Number:</b>{vehicle.registrationNumber}</p>
            <p><b>Gear:</b>{vehicle.gear}</p>
            <p><b>Seat:</b>{vehicle.seat}</p>
            <p><b>Engine:</b>{vehicle.engine}</p>
            <Button
              type="primary"
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => { setSelectedVehicle(vehicle); setIsModalOpen(true); }}
            >
              Review & Approve
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        title="Approve or Reject Vehicle"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <p><b>Vehicle:</b> {selectedVehicle?.name}</p>
        <p><b>Owner:</b> {selectedVehicle?.addedBy.name} ({selectedVehicle?.addedBy.email})</p>

        <Select className="w-full mt-2" value={status} onChange={setStatus}>
          <Option value="Approved">Approve</Option>
          <Option value="Rejected">Reject</Option>
        </Select>

        {status === "Rejected" && (
          <Input.TextArea
            className="mt-3"
            placeholder="Provide rejection reason..."
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <Button
          type="primary"
          className="mt-4 w-full bg-green-500 hover:bg-green-600"
          onClick={handleApproveReject}
        >
          Submit
        </Button>
      </Modal>
    </div>
  );
};

export default Approoval;