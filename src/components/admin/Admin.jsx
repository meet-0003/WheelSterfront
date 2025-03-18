import React, { useEffect, useState } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";

const Admin = () => {
  const user = useSelector((state) => state.auth.user);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:2000/api/v2/get-user-information", {
          headers: { authorization: `bearer ${token}` },
        });
        setAdmin(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(formData));
        if (formData.avatar) {
          formDataToSend.append("avatar", formData.avatar);
      }
      await axios.put("http://localhost:2000/api/v2/update-profile", formDataToSend, {
        headers: { authorization: `bearer ${token}` },
      });
      setAdmin({ ...admin, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post("http://localhost:2000/api/v2/forgot-password", { email: admin.email });
      toast.info("OTP sent to email");
      setIsChangingPassword(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:2000/api/v2/reset-password", { email: admin.email, otp, newPassword });
      toast.success("Password reset successful");
      setIsChangingPassword(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative -left-4 flex flex-col items-center">
          <img
            src={admin?.avatar ? `http://localhost:2000${admin.avatar}` : "https://via.placeholder.com/150"}
            alt="Admin Avatar"
            className="rounded-full w-[180px] h-[130px] object-cover border-4 border-blue-500 shadow-lg"
          />
        </div>

        <div className="hidden md:block w-[2px] bg-gray-300 h-40"></div>

        <div className="flex flex-col space-y-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 md:text-left">{isEditing ? "Edit Admin Profile" : admin?.username}</h2>

          {isEditing ? (
            <>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" />
              <input type="text" name="phnumber" value={formData.phnumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" />
            </>
          ) : (
            <>
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-600"><span className="font-semibold">Email:</span> {admin?.email}</p>
              </div>
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-600"><span className="font-semibold">Phone:</span> {admin?.phnumber}</p>
              </div>
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-600"><span className="font-semibold">Address:</span> {admin?.address}</p>
              </div>
            </>
          )}

          <div className="flex flex-col space-y-4">
            {isEditing ? (
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">
                Save Changes
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                Edit Profile
              </button>
            )}

            {!isChangingPassword ? (
              <button onClick={handlePasswordChange} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
                Change Password
              </button>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="px-4 py-2 border rounded-lg shadow-md" />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="px-4 py-2 border rounded-lg shadow-md" />
                <button onClick={handleResetPassword} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">
                  Confirm Change
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
