import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const Updatevehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = useSelector((state) => state.auth.role);

    const [vehicle, setVehicle] = useState({
        name: "",
        rent: "",
        registrationNumber: "",
        availability: false,
        rating: "",
        desc: "",
        gear: "",
        seat: "",
        pump: "",
        engine: "",
        tire: "",
        ac: "",
        bodytype: "",
        safetyfeatures: [],
        helmetIncluded: false,
        payload: "",
        trucktype: "",
        bustype: "",
        seatingarrangement: "",
        amenities: [],
    });

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await axios.get(`http://localhost:2000/api/v2/get-vehicle-by-id/${id}`);
                setVehicle(res.data.data);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
                toast.error("Failed to load vehicle data.");
            }
        };
        fetchVehicle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVehicle((prev) => ({
            ...prev,
            [name]: name === "availability" ? value === "true" : type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:2000/api/v2/update-vehicle`,
                vehicle,
                {
                    headers: {
                        authorization: `bearer ${token}`,
                        vehicleid: id,
                    },
                }
            );
            toast.success(res.data.message);
            navigate("/vehicles"); // Redirect after successful update
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update vehicle");
            console.error("Error updating vehicle:", error);
        }
    };

    return (
        <Container>
            <Row>
                <Col lg="8" className="mx-auto">
                    <h2 className="text-center">Update Vehicle</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input type="text" name="name" value={vehicle.name} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label>Rent (Rs.)</Label>
                            <Input type="number" name="rent" value={vehicle.rent} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label>Registration Number</Label>
                            <Input type="text" name="registrationNumber" value={vehicle.registrationNumber} disabled />
                        </FormGroup>

                        <FormGroup>
                            <Label>Description</Label>
                            <Input type="textarea" name="desc" value={vehicle.desc} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Availability</Label>
                            <Input type="select" name="availability" value={vehicle.availability.toString()} onChange={handleChange}>
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </Input>
                        </FormGroup>


                        <FormGroup>
                            <Label>Gear</Label>
                            <Input type="text" name="gear" value={vehicle.gear} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Seats</Label>
                            <Input type="number" name="seat" value={vehicle.seat} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Fuel Type</Label>
                            <Input type="text" name="pump" value={vehicle.pump} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Engine</Label>
                            <Input type="text" name="engine" value={vehicle.engine} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label>Tire</Label>
                            <Input type="text" name="tire" value={vehicle.tire} onChange={handleChange} />
                        </FormGroup>

                        {vehicle.vehicleType === "Car" && (
                            <>
                                <FormGroup>
                                    <Label>AC</Label>
                                    <Input type="select" name="ac" value={vehicle.ac} onChange={handleChange}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Safety Features</Label>
                                    <Input type="text" name="safetyfeatures" value={vehicle.safetyfeatures.join(", ")} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Body Type</Label>
                                    <Input type="text" name="bodytype" value={vehicle.bodytype} onChange={handleChange} />
                                </FormGroup>
                            </>
                        )}

                        {vehicle.vehicleType === "Bike" && (
                            <FormGroup>
                                <Label>Helmet Included</Label>
                                <Input type="checkbox" name="helmetIncluded" checked={vehicle.helmetIncluded} onChange={handleChange} />
                            </FormGroup>
                        )}

                        {vehicle.vehicleType === "Truck" && (
                            <>
                                <FormGroup>
                                    <Label>Payload</Label>
                                    <Input type="text" name="payload" value={vehicle.payload} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Truck Type</Label>
                                    <Input type="text" name="trucktype" value={vehicle.trucktype} onChange={handleChange} />
                                </FormGroup>
                            </>
                        )}

                        {vehicle.vehicleType === "Bus" && (
                            <>
                                <FormGroup>
                                    <Label>Bus Type</Label>
                                    <Input type="text" name="bustype" value={vehicle.bustype} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Seating Arrangement</Label>
                                    <Input type="text" name="seatingarrangement" value={vehicle.seatingarrangement} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Amenities</Label>
                                    <Input type="text" name="amenities" value={vehicle.amenities.join(", ")} onChange={handleChange} />
                                </FormGroup>
                            </>
                        )}

                        <Button color="primary" type="submit" disabled={!(role === "admin" || role === "driver")}>
                            Update Vehicle
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Updatevehicle;
