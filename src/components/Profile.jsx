import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { authActions } from '../store/auth';
import { MenuFoldOutlined, MenuUnfoldOutlined, CarFilled, UserOutlined, LogoutOutlined, } from "@ant-design/icons";
import { MdApproval } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineForm } from "react-icons/ai";
import { BiBuilding } from "react-icons/bi";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input } from "antd";
import { FaSearch } from "react-icons/fa";
import Card from "./vehicle/Card";
import Allusers from "./admin/Allusers";
import DriverForm from "./user/DriverForm";
import VehicleForm from "./admin/VehicleForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Admin from "./admin/Admin";
import Approoval from "./admin/Approoval";
import Companydata from "./admin/Companydata";
import Driverprofile from "./driver/Driverprofile";
import Userprofile from "./user/Userprofile";
import AllBooking from "./admin/AllBooking";
import UBooking from "./user/UBooking";
import MVBooking from "./driver/MVBooking";
import DBooking from "./driver/DBooking";

const { Content, Sider } = Layout;
const { Search } = Input;


function Profile() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const [data, setData] = useState([]);
  const [Mydata, setMydata] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [role, setRole] = useState(user?.role);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch({ type: "UPDATE_USER", payload: storedUser });
      setRole(storedUser.role); // Ensure role is set after reload
    }
  }, [dispatch]);

  // Fetch all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 make sure you stored token on login

        const res = await axios.get("http://localhost:2000/api/v2/get-all-vehicle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data.data);
        setFilteredData(res.data.data);

        const uniqueTypes = ["All", ...new Set(res.data.data.map((item) => item.vehicleType))];
        setVehicleTypes(uniqueTypes);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch my vehicle vehicles
  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (role === "driver") {
        try {
          const res = await axios.get("http://localhost:2000/api/v2/get-user-vehicles", {
            headers: { authorization: `bearer ${localStorage.getItem("token")}` },
          });
          setMydata(res.data.data);
        } catch (error) {
          console.error("Error fetching user vehicles:", error);
        }
      }
    };

    fetchUserVehicles();
  }, [role]);

  useEffect(() => {
    let filtered = role === "driver" ? Mydata : data; // Use Mydata for drivers, data for others

    if (location.state?.selectedKey) {
      setSelectedKey(location.state.selectedKey);
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [location, searchQuery, data, Mydata, role]); // Include Mydata in dependencies


  const handleLogout = () => {
    dispatch(authActions.logout());

    dispatch(authActions.changeRole("user"));

    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate('/');
    window.location.reload();

  };

  const handleRoleUpdate = (newRole) => {
    setRole(newRole);
    dispatch(authActions.changeRole(newRole)); // Update Redux state
    const storedUser = JSON.parse(localStorage.getItem("user"));
    storedUser.role = newRole;
    localStorage.setItem("user", JSON.stringify(storedUser)); // Persist role update
  };



  // Function to get menu items based on role
  const getMenuItems = (role) => {
    if (role === "user") {
      return [
        { key: "1", icon: <UserOutlined />, label: "User" },
        { key: "2", icon: <GiNotebook />, label: "Bookings" },
        { key: "3", icon: <AiOutlineForm />, label: "Driver Form" },
        {
          key: "4",
          icon: <LogoutOutlined />,
          label: <Button type="link" onClick={handleLogout} style={{ color: "red" }}>Logout</Button>,
        },];
    } else if (role === "driver") {
      return [
        { key: "1", icon: <UserOutlined />, label: "User" },
        { key: "E", icon: <GiNotebook />, label: "Bookings" },
        { key: "B", icon: <GiNotebook />, label: "My Vehicle Bookings" },
        { key: "C", icon: <CarFilled />, label: "My Vehicles" },
        { key: "D", icon: <PlusOutlined />, label: "Add Vehicle" },
        {
          key: "4",
          icon: <LogoutOutlined />,
          label: <Button type="link" onClick={handleLogout} style={{ color: "red" }}>Logout</Button>,
        },];
    } else if (role === "admin") {
      return [
        { key: "1", icon: <UserOutlined />, label: "Admin" },
        { key: "b", icon: <UserOutlined />, label: "All Users" },
        { key: "g", icon: <MdApproval />, label: "Application" },
        { key: "c", icon: <GiNotebook />, label: "Bookings" },
        { key: "d", icon: <CarFilled />, label: "Vehicles" },
        { key: "f", icon: <BiBuilding />, label: "Company Data" },
        {
          key: "4",
          icon: <LogoutOutlined />,
          label: <Button type="link" onClick={handleLogout} style={{ color: "red" }}>Logout</Button>,
        },];
    }
    return [];
  };



  return (
    <Layout>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: "#000" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={getMenuItems(role)} // Pass updated role dynamically
          className="custom-sidebar-menu"
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "16px", width: 64, height: 64 }}
        />
        <Content
          style={{
            margin: "20px 16px",
            padding: 24,
            minHeight: "calc(100vh - 64px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
          }}
        >


          {/* User Section */}
          {selectedKey === "1" && role === "user" && (
            <div>
              <Userprofile />
            </div>
          )}
          {selectedKey === "2" && role === "user" && <UBooking />}
          {selectedKey === "3" && role === "user" && <DriverForm onSuccess={() => handleRoleUpdate("driver")} />}
          {selectedKey === "4" && role === "user" && <Link onClick={handleLogout}>Logging out...</Link>}




          {/* Driver Section */}
          {selectedKey === "1" && role === "driver" && (<Driverprofile userId={loggedInUser?.id} />)}
          {selectedKey === "E" && role === "driver" && <DBooking />}
          {selectedKey === "B" && role === "driver" && <MVBooking />}
          {selectedKey === "C" && role === "driver" && (
            <>
              <div className="relative w-full md:w-80">
                {/* Search Input */}
                <Input
                  placeholder="Search vehicle..."
                  allowClear
                  size="large"
                  className="w-full rounded-full bg-black text-white border border-gray-400 px-4 py-2 pr-12 focus:ring-2 focus:ring-[#f9a826] focus:border-[#f9a826]"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Search Icon Inside Input (Right End) */}
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#f9a826] text-xl z-10 pointer-events-none" />
              </div>
              <div className="my-10 flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredData.length > 0 ? (
                    filteredData.map((vehicle, i) => <Card key={i} data={vehicle} />)
                  ) : (
                    <p>No vehicles added yet.</p>
                  )}
                </div>
              </div>
            </>
          )}          {selectedKey === "D" && role === "driver" && <VehicleForm />}




          {/* Admin Section */}
          {selectedKey === "1" && role === "admin" && (<Admin />)}
          {selectedKey === "b" && role === "admin" && <Allusers />}
          {selectedKey === "c" && role === "admin" && <AllBooking />}
          {selectedKey === "d" && role === "admin" && (
            <>
              <div className="relative w-full md:w-80">
                {/* Search Input */}
                <Input
                  placeholder="Search vehicle..."
                  allowClear
                  size="large"
                  className="w-full rounded-full bg-black text-white border border-gray-400 px-4 py-2 pr-12 focus:ring-2 focus:ring-[#f9a826] focus:border-[#f9a826]"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Search Icon Inside Input (Right End) */}
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#f9a826] text-xl z-10 pointer-events-none" />
              </div>
              <div className="my-10 flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredData.length > 0 ? (
                    filteredData.map((vehicle, i) => <Card key={i} data={vehicle} />)
                  ) : (
                    <p>No vehicles added yet.</p>
                  )}              </div>
              </div>
            </>)}
          {selectedKey === "f" && role === "admin" && <Companydata />}
          {selectedKey === "g" && role === "admin" && <Approoval />}




          <div
            style={{
              position: "sticky",
              bottom: 0,
              background: colorBgContainer,
              padding: "10px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Profile;
