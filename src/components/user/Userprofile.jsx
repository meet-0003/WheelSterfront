import React, { useEffect, useState } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { toast,ToastContainer } from 'react-toastify';

const Userprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", phnumber: "", address: "" });
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:2000/api/v2/get-user-information", {
          headers: { authorization: `bearer ${token}` },
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const validate = () => {
    let errors = {};
    let firstErrorMessage = ""; // Store first error for toast
    
    if (!formData.username || formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
      if (!firstErrorMessage) firstErrorMessage = errors.username;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
      if (!firstErrorMessage) firstErrorMessage = errors.email;
    }
    if (!formData.phnumber || !/^\d{10}$/.test(formData.phnumber)) {
      errors.phnumber = "Phone number must be 10 digits";
      if (!firstErrorMessage) firstErrorMessage = errors.phnumber;
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      if (!firstErrorMessage) firstErrorMessage = errors.address;
    }
  
    setErrors(errors);
  
    if (firstErrorMessage) {
      toast.warn(firstErrorMessage); // Show only first error
      return false; // Stop further execution
    }
  
    return true; // Passes validation
  };
  
  

  
  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("data", JSON.stringify(formData));

      // Append avatar file if user selected a new one
      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      }

      await axios.put("http://localhost:2000/api/v2/update-profile", formDataToSend, {
        headers: {
          authorization: `bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser({ ...user, ...formData });
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
      await axios.post("http://localhost:2000/api/v2/forgot-password", { email: user.email });
      alert("OTP sent to email");
      setIsChangingPassword(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:2000/api/v2/reset-password", { email: user.email, otp, newPassword });
      alert("Password reset successful");
      setIsChangingPassword(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <ToastContainer/>
        <div className="relative -left-4 flex flex-col items-center">
          <img
            src={user?.avatar ? `http://localhost:2000${user.avatar}` : "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="rounded-full w-[170px] h-[130px] object-cover border-4 border-blue-500 shadow-lg"
          />

          {/* Input field for selecting new avatar */}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-sm"
              onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })}
            />
          )}
        </div>


        <div className="hidden md:block w-[2px] bg-gray-300 h-40"></div>

        <div className="flex flex-col space-y-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 md:text-left">{isEditing ? "Edit Profile" : user?.username}</h2>

          {isEditing ? (
            <>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" /> {errors.username}
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" /> {errors.email} 
              <input type="text" name="phnumber" value={formData.phnumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" /> {errors.phnumber} 
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg shadow-md" /> {errors.address} 
            </>
          ) : (
            <>
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-600"><span className="font-semibold">Email:</span> {user?.email}</p>
              </div>
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-600"><span className="font-semibold">Phone:</span> {user?.phnumber}</p>
              </div>
              <div className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p className="text-gray-600"><span className="font-semibold">Address:</span> {user?.address || "Not provided"}</p>
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

export default Userprofile;
