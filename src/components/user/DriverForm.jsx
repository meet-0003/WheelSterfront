import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../../store/auth";
import { message, Form, Input, DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";

const DriverForm = ({ onSuccess }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const res = await axios.put(
        "http://localhost:2000/api/v2/update-to-driver",
        {
          userId: user._id,
          driverInfo: values,
        },
        {
          headers: { authorization: `bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.token) {
        dispatch(authActions.updateUser(res.data.user));
        dispatch(authActions.updateToken(res.data.token));

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        message.success("Driver profile updated successfully!");
        window.location.reload();
      } else {
        throw new Error("Token not received in response.");
      }
    } catch (error) {
      message.error("Error updating driver profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-[#f9a826] mb-6">
        Become a Driver
      </h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="underlined-form">
        <div className="grid grid-cols-2 gap-4">
          {/* Address */}
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required" }]} className="col-span-2">
            <Input placeholder="Enter your address" className="custom-input" />
          </Form.Item>

          {/* License Number */}
          <Form.Item
            name="licenseNumber"
            label="License Number"
            rules={[
              { required: true, message: "License number is required" },
              { pattern: /^[A-Za-z]{2}\d{2}\s\d{11}$/, message: "Invalid license format (e.g., AB12CDEF)" },
            ]}
          >
            <Input placeholder="Enter your license number (e.g., AB12CDEF)" className="custom-input" />
          </Form.Item>

          {/* License Expiry */}
          <Form.Item name="licenseExpiry" label="License Expiry Date" rules={[{ required: true, message: "License expiry date is required" }]}>
            <DatePicker className="w-full custom-input" disabledDate={(current) => current && current < dayjs().endOf("day")} />
          </Form.Item>

          {/* Experience */}
          <Form.Item
            name="experience"
            label="Experience (years)"
            rules={[
              { required: true, message: "Experience is required" },
              { validator: (_, value) => (value >= 5 ? Promise.resolve() : Promise.reject("Minimum 5 years required")) },
            ]}
          >
            <Input type="number" placeholder="Enter experience in years" className="custom-input" />
          </Form.Item>

          {/* Ability */}
          <Form.Item name="ability" label="Ability" rules={[{ required: true, message: "Ability is required" }]}>
            <Input placeholder="Describe your driving ability" className="custom-input" />
          </Form.Item>

          {/* Age */}
          <Form.Item
            name="age"
            label="Age"
            rules={[
              { required: true, message: "Age is required" },
              { validator: (_, value) => (value >= 20 && value <= 45 ? Promise.resolve() : Promise.reject("Age must be between 20 and 45")) },
            ]}
          >
            <Input type="number" placeholder="Enter your age" className="custom-input" />
          </Form.Item>

          {/* Gender */}
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
            <Select placeholder="Select your gender" className="custom-input">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>

          {/* Date of Birth */}
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[
              { required: true, message: "Date of Birth is required" },
              { validator: (_, value) => (value && dayjs().diff(value, "years") >= 20 ? Promise.resolve() : Promise.reject("Must be at least 20 years old")) },
            ]}
          >
            <DatePicker className="w-full custom-input" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-[#f9a826]">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DriverForm;
