import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Driverprofile = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    Phone: "",
    address: "",
    licenseNumber: "",
    experience: "",
    Ability: "",
    age: "",
    gender: "",
    DateofBirth: "",
    licenseExpiry: "",
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:2000/api/v2/get-user-information", {
          headers: { authorization: `Bearer ${token}` },
        });

        setDriver(response.data);
        setFormData({
          Name: response.data.username || "",
          email: response.data.email || "",
          Phone: response.data.phnumber || "",
          address: response.data.driverInfo?.address || "",
          licenseNumber: response.data.driverInfo?.licenseNumber || "",
          experience: response.data.driverInfo?.experience || "",
          Ability: response.data.driverInfo?.ability || "",
          age: response.data.driverInfo?.age || "",
          gender: response.data.driverInfo?.gender || "",
          DateofBirth: response.data.driverInfo?.dob || "",
          licenseExpiry: response.data.driverInfo?.licenseExpiry || "",
        });
      } catch (error) {
        console.error("Error fetching driver info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(formData));
      if (avatar) formDataToSend.append("avatar", avatar);

      await axios.put("http://localhost:2000/api/v2/update-profile", formDataToSend, {
        headers: { authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg">
      <ToastContainer />
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative -left-4 flex flex-col items-center">
          <img
            src={driver?.avatar ? `http://localhost:2000${driver.avatar}` : "https://via.placeholder.com/150"}
            alt="Driver Avatar"
            className="rounded-full w-[160px] h-[130px] object-cover border-4 border-blue-500 shadow-lg"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-sm"
              onChange={handleAvatarChange}
            />
          )}
        </div>

        <div className="hidden md:block w-[2px] bg-gray-300 h-40"></div>

        <div className="flex flex-col space-y-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 md:text-left">{editMode ? "Edit Profile" : driver?.username}</h2>
          {Object.keys(formData).map((key) => (
            <div key={key} className="p-4 border rounded-lg shadow-md bg-gray-50">
              <label className="block font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
              {editMode ? (
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-600">{formData[key] || "Not provided"}</p>
              )}
            </div>
          ))}
          <div className="flex flex-col space-y-4">
            {editMode ? (
              <button onClick={handleUpdateProfile} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">
                Save Changes
              </button>
            ) : (
              <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Driverprofile;
