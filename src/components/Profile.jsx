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
import { Button, Layout, Menu, theme } from "antd";

import Card from "./vehicle/Card";
import Allusers from "./admin/Allusers";
import Bookings from "./admin/Bookings";
import DriverForm from "./user/Driverform";
import VehicleForm from "./admin/VehicleForm";
import { Link, useNavigate } from "react-router-dom";
import Admin from "./admin/Admin";
import Approoval from "./admin/Approoval";
import Companydata from "./admin/Companydata";
import Booking from "./driver/Booking";
import Driverprofile from "./driver/Driverprofile";
import Userprofile from "./user/Userprofile";

const { Content, Sider } = Layout;

function Profile() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [Data, setData] = useState([]);
  const [Mydata, setMydata] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [role, setRole] = useState(user?.role);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch({ type: "UPDATE_USER", payload: storedUser });
    }
  }, [dispatch]);

  // Fetch all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/v2/get-all-vehicle");
        setData(res.data.data);
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

  const handleLogout = () => {
    dispatch(authActions.logout());

    dispatch(authActions.changeRole("user"));

    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate('/');
    window.location.reload();

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
        },      ];
    } else if (role === "driver") {
      return [
        { key: "1", icon: <UserOutlined />, label: "User" },
        { key: "B", icon: <GiNotebook />, label: "Bookings" },
        { key: "C", icon: <CarFilled />, label: "My Vehicles" },
        { key: "D", icon: <PlusOutlined />, label: "Add Vehicle" },
        {
          key: "4",
          icon: <LogoutOutlined />,
          label: <Button type="link" onClick={handleLogout} style={{ color: "red" }}>Logout</Button>,
        },      ];
    } else if (role === "admin") {
      return [
        { key: "1", icon: <UserOutlined />, label: "Admin" },
        { key: "b", icon: <UserOutlined />, label: "All Users" },
        { key: "g", icon: <MdApproval />, label: "Application" },
        { key: "c", icon: <GiNotebook />, label: "Bookings" },
        { key: "d", icon: <CarFilled />, label: "Vehicles" },
        { key: "e", icon: <PlusOutlined />, label: "Add Vehicle" },
        { key: "f", icon: <BiBuilding />, label: "Company Data" },
        {
          key: "4",
          icon: <LogoutOutlined />,
          label: <Button type="link" onClick={handleLogout} style={{ color: "red" }}>Logout</Button>,
        },      ];
    }
    return [];
  };



  return (
    <Layout>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={getMenuItems(role)} // Pass updated role dynamically
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
              <Userprofile/>
            </div>
          )}
          {selectedKey === "2" && role === "user" && <Bookings />}
          {selectedKey === "3" && role === "user" && <DriverForm onSuccess={() => { setRole("driver"); setSelectedKey("A"); }} />}
          {selectedKey === "4" && role === "user" && <Link onClick={handleLogout}>Logging out...</Link>}




          {/* Driver Section */}
          {selectedKey === "1" && role === "driver" && (<Driverprofile userId={loggedInUser?.id}/>)}
          {selectedKey === "B" && role === "driver" && <Booking/>}
          {selectedKey === "C" && role === "driver" && (
            <div className="my-10 flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Mydata.length > 0 ? (
                  Mydata.map((vehicle, i) => <Card key={i} data={vehicle} />)
                ) : (
                  <p>No vehicles added yet.</p>
                )}
              </div>
            </div>
          )}          {selectedKey === "D" && role === "driver" && <VehicleForm />}




          {/* Admin Section */}
          {selectedKey === "1" && role === "admin" && (<Admin/>)}
          {selectedKey === "b" && role === "admin" && <Allusers />}
          {selectedKey === "c" && role === "admin" && <Bookings />}
          {selectedKey === "d" && role === "admin" &&
            <div className="my-10 flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Data.map((vehicle, i) => <Card key={i} data={vehicle} />)}
              </div>
            </div>}
          {selectedKey === "e" && role === "admin" && <VehicleForm />}
          {selectedKey === "f" && role === "admin" && <Companydata/>}
          {selectedKey === "g" && role === "admin" && <Approoval/>}




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
