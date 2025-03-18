import React, { useEffect, useState } from "react";
import "../../styles/vehicle-details.css";
import { toast } from "react-toastify";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../../components/Helmet/Helmet";
import { useParams } from "react-router-dom";
import { PiEngineBold } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { GiCarSeat } from "react-icons/gi";
import { FaGasPump } from "react-icons/fa6";
import { GiFlatTire } from "react-icons/gi";
import { TbSnowflake } from "react-icons/tb";
import { TbSnowflakeOff } from "react-icons/tb";
import { Rating } from 'react-simple-star-rating';


const VehicleDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    useSelector((state) => state.auth.isLoggedIn);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);
    const navigate = useNavigate();
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`http://localhost:2000/api/v2/get-vehicle-by-id/${id}`);
                setData(res.data.data);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        };
        fetch();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const res = await axios.delete(`http://localhost:2000/api/v2/delete-vehicle/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            toast.success(res.data.message);
            navigate("/vehicles"); // Redirect to the vehicles list after deletion
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete vehicle");
            console.error("Error deleting vehicle:", error);
        }
    };
    

    return (
        <Helmet title={data?.name}>
            <section>
                <Container>
                    <Row>
                        <Col lg="6">
                            <img src={data?.url} alt="" className="w-100 vehicle-image" />
                        </Col>

                        <Col lg="6">
                            <div className="car__info">
                                <p className="badge">{data?.availability}</p>

                                <h2 className="section__title">{data?.name}</h2>

                                <div className="align-items-center gap-5 mb-4 mt-3">
                                    <h6 className="rent__price fw-bold fs-4">
                                        Rs.{data?.rent}.00 / Day
                                    </h6>

                                    <span className="mt-2 align-items-center  gap-2">
                                        <Rating size={25} initialValue={Number(data?.rating)} readonly allowFraction SVGstyle={{ display: "inline" }} />
                                        ({data?.rating} ratings)
                                    </span>
                                </div>

                                <p><strong>Registration Number:</strong> {data?.registrationNumber}</p>


                                {data?.vehicleType === "Truck" && (
                                    <>
                                        <p><strong>PayLoad :</strong> {data?.payload}</p>
                                        <p><strong>Body Type:</strong> {data?.bodytype}</p>
                                        <p><strong>Truck Type:</strong> {data?.trucktype}</p>
                                    </>
                                )}

                                {data?.vehicleType === "Car" && (
                                    <>
                                        <p><strong>Safety Features:</strong> {data?.safetyfeatures?.join(", ")}</p>
                                        <p><strong>Body Type:</strong> {data?.bodytype}</p>
                                    </>
                                )}

                                {data?.vehicleType === "Bus" && (
                                    <>
                                        <p><strong>Bus Type:</strong> {data?.bustype}</p>
                                        <p><strong>Seating Arrangement :</strong> {data?.seatingarrangement}</p>
                                        <p><strong>Amenities:</strong> {data?.amenities?.join(", ")}</p>
                                    </>
                                )}

                                {data?.vehicleType === "Bike" && (
                                    <>
                                        <p><strong>Body Type:</strong> {data?.bodytype}</p>
                                        <p><strong>Helmet Included:</strong> {data?.helmetIncluded ? "Yes" : "No"}</p>
                                    </>
                                )}




                                <p className="section__description">
                                    {data?.desc}
                                </p>

                                <div
                                    className=" d-flex align-items-center mt-3"
                                    style={{ columnGap: "4rem" }}
                                >
                                    <span className=" d-flex align-items-center gap-1 section__description">
                                        <div >
                                            <div className="icon-textt"><GiGearStickPattern /></div>

                                            <span >{data?.gear}</span>
                                        </div>
                                    </span>

                                    <span className=" d-flex align-items-center gap-1 section__description">
                                        <div>
                                            <div className="icon-textt"><GiCarSeat /></div>
                                            <span >{data?.seat}</span>
                                        </div>

                                    </span>

                                    <span className=" d-flex align-items-center gap-1 section__description">
                                        <div>
                                            <div className="icon-textt"><FaGasPump /></div>
                                            <span >{data?.pump}</span>
                                        </div>
                                    </span>
                                </div>

                                <div
                                    className=" d-flex align-items-center mt-3"
                                    style={{ columnGap: "4.5rem" }}
                                >
                                    <span className=" d-flex align-items-center gap-1 section__description">
                                        <div>
                                            <div className="icon-textt"><PiEngineBold /></div>
                                            <span >{data?.engine}</span>
                                        </div>
                                    </span>

                                    <span className=" d-flex align-items-center gap-1 section__description">
                                        <div>
                                            <div className="icon-textt"><GiFlatTire /></div>
                                            <span >{data?.tire}</span>
                                        </div>
                                    </span>

                                    <span className=" d-flex align-items-center gap-1 section__description">
                                        <div>
                                            <span >{data?.ac ? (<>
                                                <div>
                                                    <div className="icon-textt"><TbSnowflake /></div>
                                                    <span>AC</span>
                                                </div>
                                            </>) : (<>
                                                <div>
                                                    <div className="icon-textt"><TbSnowflakeOff /></div>
                                                    <span>Non-AC</span>
                                                </div>
                                            </>)}</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xl mt-6">
                                <button className="border py-2 px-2 bg-[#f9a826]" ><Link to="/vehicles">Back</Link></button>

                                <button
                                    className={`border px-2 ${isLoggedIn ? "bg-[#f9a826]" : "bg-gray-400 cursor-not-allowed"}`}
                                    disabled={!isLoggedIn}
                                    title={!isLoggedIn ? "You must be logged in to book a vehicle" : ""}
                                >
                                    {isLoggedIn ? (
                                        <Link to={`/book/${id}`} state={{ rent: data?.rent }}>Book Now</Link>
                                    ) : (
                                        <span>Book Now</span>
                                    )}
                                </button>
                                {isLoggedIn && role === "admin" &&
                                <button className=' border py-2 px-2 bg-[#f9a826]' onClick={handleDelete}> 
                                    <span>Delete</span>
                                </button>
                                }
                                {isLoggedIn && role === "admin" &&
                                <button className=' border py-2 px-2 bg-[#f9a826]'> 
                                    <Link to={`/update-vehicle/${id}`}>Update</Link>
                                </button>
                                }
                                {isLoggedIn && role === "driver" &&
                                <button className=' border py-2 px-2 bg-[#f9a826]'> 
                                    <Link to={`/update-vehicle/${id}`}>Update</Link>
                                </button>
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default VehicleDetails;