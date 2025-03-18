import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Statistic, Table } from "antd";
import { DollarOutlined, UserOutlined, CarOutlined } from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Companydata = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:2000/api/v2/company-data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Ensure token is passed
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use revenue data directly from API (including adminProfit)
  const revenueData = data?.revenueByVehicleType || [];

  const columns = [
    { title: "Vehicle Type", dataIndex: "_id", key: "_id" },
    { title: "Total Revenue ($)", dataIndex: "totalRevenue", key: "totalRevenue" },
    { title: "Admin Profit ($)", dataIndex: "adminProfit", key: "adminProfit" },
  ];

  return (
    <div className="p-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Stats Cards */}
      <Card className="shadow-lg">
        <Statistic title="Total Revenue" value={data?.totalRevenue || 0} prefix={<DollarOutlined />} loading={loading} />
      </Card>
      <Card className="shadow-lg">
        <Statistic title="Registered Users" value={data?.registeredUsers || 0} prefix={<UserOutlined />} loading={loading} />
      </Card>
      <Card className="shadow-lg">
        <Statistic
          title="Total Vehicles"
          value={(data?.vehicleCounts?.cars || 0) + (data?.vehicleCounts?.bikes || 0) + (data?.vehicleCounts?.trucks || 0) + (data?.vehicleCounts?.buses || 0)}
          prefix={<CarOutlined />}
          loading={loading}
        />
      </Card>

      {/* Comparison Bar Chart - Admin Profit vs Total Revenue */}
      <div className="col-span-3">
        <Card title="Admin Profit vs Total Revenue by Vehicle Type">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#8884d8" name="Total Revenue" />
              <Bar dataKey="adminProfit" fill="#82ca9d" name="Admin Profit (30%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Table */}
      <div className="col-span-3">
        <Card title="Company Financials">
          <Table dataSource={revenueData} columns={columns} loading={loading} pagination={{ pageSize: 5 }} rowKey="_id" />
        </Card>
      </div>
    </div>
  );
};

export default Companydata;
