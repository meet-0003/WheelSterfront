import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const VehicleForm = () => {
  const [form] = Form.useForm();
  const [vehicleType, setVehicleType] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    if (!vehicleType) {
      message.error("Please select a vehicle type!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("Form Data:", values); // Debugging
      console.log("Vehicle Type:", vehicleType); // Debugging

      const response = await axios.post(
        `http://localhost:2000/api/v2/add-vehicle/${vehicleType}`, // Removed vehicleType from body
        values,
        { headers: { authorization: `bearer ${token}` } }
      );

      message.success(response.data.message);
      form.resetFields();
      setVehicleType(null);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  // Hidden Fields Mapping
  const hiddenFields = {
    car: ["helmetIncluded", "payload", "trucktype", "bustype", "seatingarrangement", "amenities"],
    bike: ["ac", "safetyfeatures", "payload", "trucktype", "bustype", "seatingarrangement", "amenities"],
    truck: ["ac", "safetyfeatures", "helmetIncluded", "bustype", "seatingarrangement", "amenities"],
    bus: ["bodytype", "helmetIncluded", "safetyfeatures", "payload", "trucktype"],
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      style={{ maxWidth: 600, margin: "auto" }}
    >
      {/* Removed name="vehicleType" from Select */}
      <Form.Item label="Select Vehicle Type" rules={[{ required: true, message: "Please select vehicle type!" }]}>
        <Select onChange={(value) => setVehicleType(value)}>
          <Option value="car">Car</Option>
          <Option value="bike">Bike</Option>
          <Option value="truck">Truck</Option>
          <Option value="bus">Bus</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Image URL" name="url" rules={[{ required: true, message: "Please enter the image URL!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the name!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Rent Price" name="rent" rules={[{ required: true, message: "Please enter rent price!" }]}>
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Registration Number" name="registrationNumber" rules={[{ required: true, message: "Please enter registration number!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Rating" name="rating" rules={[{ required: true, message: "Please enter rating!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="desc" rules={[{ required: true, message: "Please enter description!" }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Gear Type" name="gear" rules={[{ required: true, message: "Please enter gear type!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Seats" name="seat" rules={[{ required: true, message: "Please enter number of seats!" }]}>
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Fuel Pump" name="pump" rules={[{ required: true, message: "Please enter fuel pump details!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Engine Type" name="engine" rules={[{ required: true, message: "Please enter engine type!" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Tire Type" name="tire" rules={[{ required: true, message: "Please enter tire type!" }]}>
        <Input />
      </Form.Item>

      {/* Conditional Fields Based on Vehicle Type */}
      {!hiddenFields[vehicleType]?.includes("ac") && (
        <Form.Item label="AC" name="ac">
          <Input />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("safetyfeatures") && (
        <Form.Item label="Safety Features" name="safetyfeatures">
          <Input.TextArea placeholder="Comma separated values" />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("bodytype") && (
        <Form.Item label="Body Type" name="bodytype">
          <Input />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("helmetIncluded") && (
        <Form.Item label="Helmet Included" name="helmetIncluded">
          <Select>
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("payload") && (
        <Form.Item label="Payload Capacity" name="payload">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("trucktype") && (
        <Form.Item label="Truck Type" name="trucktype">
          <Input />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("bustype") && (
        <Form.Item label="Bus Type" name="bustype">
          <Input />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("seatingarrangement") && (
        <Form.Item label="Seating Arrangement" name="seatingarrangement">
          <Input />
        </Form.Item>
      )}
      {!hiddenFields[vehicleType]?.includes("amenities") && (
        <Form.Item label="Amenities" name="amenities">
          <Input.TextArea placeholder="Comma separated values" />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VehicleForm;
