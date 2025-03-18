import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import Card from "./Card";

const { Search } = Input;

function VehicleGallery() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [fuelFilter, setFuelFilter] = useState({
    petrol: false, electric: false, diesel: false, gas: false, });
  const [ratingFilter, setRatingFilter] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/v2/get-all-vehicle");
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

  useEffect(() => {
    let filtered = data;

    if (selectedType !== "All") {
      filtered = filtered.filter((item) => item.vehicleType === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (fuelFilter.petrol || fuelFilter.electric || fuelFilter.diesel || fuelFilter.gas) {
      filtered = filtered.filter(
        (item) =>
          (fuelFilter.petrol && item.pump === "Petrol") ||
          (fuelFilter.electric && item.pump === "Electric") ||
          (fuelFilter.diesel && item.pump === "Diesel") ||
          (fuelFilter.gas && item.pump === "Gas")
      );
    }

    if (sortOption === "lowToHigh") {
      filtered = [...filtered].sort((a, b) => a.rent - b.rent);
    } else if (sortOption === "highToLow") {
      filtered = [...filtered].sort((a, b) => b.rent - a.rent);
    }

    if (ratingFilter) {
      filtered = filtered.filter((item) => item.rating >= ratingFilter);
    }

    setFilteredData(filtered);
  }, [selectedType, searchQuery, sortOption, fuelFilter, ratingFilter, data]);

  return (
    <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 dark:bg-black bg-white">
      <div className="mt-2 py-6 text-center">
        <h1 className="text-4xl text-[#001021] dark:text-white font-semibold">
          Find Your Perfect Ride <span className="text-3xl text-[#f9a826]">Here!</span>
        </h1>
      </div>

      {/* Filters Section */}
      <div className="border w-full h-auto p-4 flex flex-col md:flex-row justify-between items-center bg-gray-300 rounded-lg gap-4">
        {/* Filter Dropdown */}
        <div className="relative">
          <button className="border px-4 py-1 border-black text-sm" onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}>
            Filters ▼
          </button>
          {isFilterDropdownOpen && (
            <ul className="absolute left-0 mt-2 w-52 bg-white shadow-md rounded-md z-10 p-2">
              {/* Vehicle Type */}
              {vehicleTypes.map((type) => (
                <li
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`cursor-pointer px-4 py-2 ${selectedType === type ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"}`}
                >
                  {type}
                </li>
              ))}

              {/* Fuel Type */}
              {["Petrol", "Electric", "Diesel", "Gas"].map((fuel) => (
                <li
                  key={fuel}
                  className={`cursor-pointer px-4 py-2 flex items-center ${fuelFilter[fuel.toLowerCase()] ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"}`}
                  onClick={() => setFuelFilter((prev) => ({ ...prev, [fuel.toLowerCase()]: !prev[fuel.toLowerCase()] }))}
                >
                  <input type="checkbox" checked={fuelFilter[fuel.toLowerCase()]} readOnly className="mr-2" /> {fuel}
                </li>
              ))}

              {/* Sort */}
              {["lowToHigh", "highToLow"].map((option) => (
                <li
                  key={option}
                  onClick={() => setSortOption(option)}
                  className={`cursor-pointer px-4 py-2 ${sortOption === option ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"}`}
                >
                  {option === "lowToHigh" ? "Low to High" : "High to Low"}
                </li>
              ))}

              {/* Rating */}
              {[5, 4, 3, 2, 1].map((rating) => (
                <li
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={`cursor-pointer px-4 py-2 ${ratingFilter === rating ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"}`}
                >
                  {rating} ⭐ & Up
                </li>
              ))}

              {/* Clear Filters */}
              <li
                onClick={() => {
                  setSelectedType("All");
                  setFuelFilter({ petrol: false, electric: false, diesel: false, gas: false });
                  setSortOption("");
                  setRatingFilter("");
                }}
                className="cursor-pointer px-4 py-2 bg-red-500 text-white text-center mt-2 rounded"
              >
                Clear Filters
              </li>
            </ul>
          )}
        </div>
        <div className="flex mt-2 gap-2">
        <p className=" text-[#001021] mt-2 dark:text-gray-300 max-w-2xl ">
          Browse through various vehicles and choose the best one for your journey.
        </p>
         <img src="/img/look-down.png" alt="" className="h-[40px] w-[55px] mb-2"/>
        </div>
        {/* Search Box */}
        <Search
          placeholder="Search vehicle..."
          allowClear
          enterButton={<Button style={{ backgroundColor: "#f9a826", borderColor: "#f9a826", color: "white" }}>Search</Button>}
          size="large"
          className="w-full md:w-80 rounded-full text-white border-none  px-4 py-2"
          onSearch={(value) => setSearchQuery(value)}
        />
      </div>
      <div className="my-10 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.length > 0 ? filteredData.map((item, i) => <Card key={i} data={item} />) : <p>No vehicles available.</p>}
        </div>
      </div>
    </div>
  );
}

export default VehicleGallery;




