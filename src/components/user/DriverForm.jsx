import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {authActions} from '../../store/auth';
import { message, Form, Input, DatePicker, Select, Button } from "antd";

const DriverForm = ({ onSuccess }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Add loading state

  const [form] = Form.useForm();
  console.log("Redux State:", useSelector((state) => state.auth.token));


  const handleSubmit = async (values) => {
    setLoading(true);

    try {
        const res = await axios.put("http://localhost:2000/api/v2/update-to-driver", {
            userId: user._id,  
            driverInfo: values,
        }, {
            headers: { authorization: `bearer ${localStorage.getItem("token")}` }
        });

        console.log(res.data);

        console.log("Token stored in LocalStorage:", localStorage.getItem("token"));

        if (res.data.token) { // ✅ Ensure token is received
    
          // ✅ Update Redux state with new user & token
          dispatch(authActions.updateUser(res.data.user));
          dispatch(authActions.updateToken(res.data.token));
          console.log("Updated Redux Token:", res.data.token);

    
          // ✅ Save token & user in localStorage
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);
    
          // ✅ Reload page to reflect changes
          window.location.reload();
          
        } else {
          throw new Error("Token not received in response.");
        }
        console.log("🔹 LocalStorage Token After Refresh:", localStorage.getItem("token"));
    } catch (error) {
        message.error("Error updating driver profile.");
        console.error(error);
    } finally {
        setLoading(false);
    }
};


  

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Become a Driver</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        variant="underlined"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="address" label="Address" rules={[{ required: true }]} className="col-span-2">
            <Input placeholder="Enter your address" />
          </Form.Item>

          <Form.Item name="licenseNumber" label="License Number" rules={[{ required: true }]}>
            <Input placeholder="Enter your license number" />
          </Form.Item>

          <Form.Item name="licenseExpiry" label="License Expiry Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="experience" label="Experience (years)" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter experience in years" />
          </Form.Item>

          <Form.Item name="ability" label="Ability" rules={[{ required: true }]}>
            <Input placeholder="Describe your driving ability" />
          </Form.Item>

          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter your age" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select your gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
          {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DriverForm;
