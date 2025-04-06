import React, { useEffect, useState } from 'react'
import { Table, message, Spin, Popconfirm, Button, Badge, Modal } from 'antd';
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";



function Allusers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const token = localStorage.getItem("token");

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:2000/api/v2/users", {
                    headers: { authorization: `bearer ${token}` }, // Pass token for authentication
                });
                const filteredUsers = response.data.users.filter(user => user.role !== "admin");

                setUsers(filteredUsers);
            } catch (error) {
                message.error("Failed to fetch users");
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    // Fetch a single user's details when clicked
    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:2000/api/v2/users/${userId}`, {
                headers: { authorization: `bearer ${token}` },
            });
            setSelectedUser(response.data.user);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Failed to fetch user details");
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle delete (Not implemented API yet)
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:2000/api/v2/delete-user/${userId}`, {
                headers: { authorization: `bearer ${token}` },
            });
            message.success("User deleted successfully");
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            message.error("Failed to delete user");
            console.error("Error deleting user:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            render: (text, record) => (
                <a onClick={() => fetchUserDetails(record._id)}>{text}</a>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phnumber",
            key: "phnumber",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },

        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure to delete this?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        }
    ];

    return (
        <>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }} className="text-2xl">My Vehicle Bookings</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={users.map((user) => ({ ...user, key: user._id }))}
                    rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
                    style={{ borderRadius: "8px", overflow: "hidden" }}
                    rowKey="_id"
                />
            )}
            {/* User Details Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3">
                        <span>User Details</span>
                        <Badge
                            count={selectedUser?.role}
                            style={{
                                backgroundColor: selectedUser?.role === "driver" ? "#52c41a" : "#1890ff",
                                fontSize: "12px",
                            }}
                        />
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedUser && (
                    <div className="flex items-center gap-6">
                        {/* Avatar Section */}
                        <div className="w-[120px] h-[100px] flex-shrink-0">
                            {selectedUser?.avatar && (
                                <img
                                    src={`http://localhost:2000${selectedUser.avatar}`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border border-gray-300 shadow-sm"
                                />
                            )}
                        </div>

                        {/* User Info Section */}
                        <div className="flex flex-col">
                            <h2><strong>Username:</strong> {selectedUser?.username}</h2>
                            <p><strong>Email:</strong> {selectedUser?.email}</p>
                            <p><strong>Phone Number:</strong> {selectedUser?.phnumber}</p>
                            <p><strong>Address:</strong> {selectedUser?.address}</p>
                        </div>
                    </div>

                )}
            </Modal>
            <style>
                {`
  .table-row-light {
    background-color: #ffffff;
  }
  .table-row-dark {
    background-color: #f2f2f2;
  }
  .ant-table-thead > tr > th {
    background-color: #001529 !important;
    color: white !important;
    font-size: 16px;
    text-align: center !important;
  }
  .ant-table-tbody > tr > td {
    text-align: center !important;
  }
`}

            </style>
        </>
    )
}

export default Allusers