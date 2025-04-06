import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import Card from "./Card";
import { FaSearch } from "react-icons/fa";


const { Search } = Input;

function VehicleGallery() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [fuelFilter, setFuelFilter] = useState({
    petrol: false, electric: false, diesel: false, gas: false,
  });
  const [ratingFilter, setRatingFilter] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

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
      filtered = filtered.filter((item) => item.averageRating >= ratingFilter);
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
      <div className="border w-full h-auto p-4 flex flex-wrap md:flex-nowrap justify-between items-center bg-gray-300 rounded-lg gap-4">
        {/* Filter Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsFilterDropdownOpen(true)}
          onMouseLeave={() => setIsFilterDropdownOpen(false)}>
          <button
            className="border px-4 py-1 border-black text-sm"
          >
            Filters ▼
          </button>
          {isFilterDropdownOpen && (
            <ul className="absolute left-0 w-52 bg-white shadow-md rounded-md z-10 p-2">
              {/* Vehicle Type */}
              {vehicleTypes.map((type) => (
                <li
                  key={type}
                  onClick={() => setSelectedType((prev) => prev === type ? "All" : type)}
                  className={`cursor-pointer px-4 py-2 ${selectedType === type ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"
                    }`}
                >
                  {type}
                </li>
              ))}

              {/* Fuel Type */}
              {["Petrol", "Electric", "Diesel", "Gas"].map((fuel) => (
                <li
                  key={fuel}
                  className={`cursor-pointer px-4 py-2 flex items-center ${fuelFilter[fuel.toLowerCase()] ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"
                    }`}
                  onClick={() =>
                    setFuelFilter((prev) => ({
                      ...prev,
                      [fuel.toLowerCase()]: !prev[fuel.toLowerCase()],
                    }))
                  }
                >
                  <input
                    type="checkbox"
                    checked={fuelFilter[fuel.toLowerCase()]}
                    readOnly
                    className="mr-2"
                  />
                  {fuel}
                </li>
              ))}

              {/* Sort Option */}
              {["lowToHigh", "highToLow"].map((option) => (
                <li
                  key={option}
                  onClick={() =>
                    setSortOption((prev) => (prev === option ? "" : option))
                  }
                  className={`cursor-pointer px-4 py-2 ${sortOption === option ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"
                    }`}
                >
                  {option === "lowToHigh" ? "Low to High" : "High to Low"}
                </li>
              ))}

              {/* Rating Filter */}
              {[5, 4, 3, 2, 1].map((rating) => (
                <li
                  key={rating}
                  onClick={() =>
                    setRatingFilter((prev) => (prev === rating ? "" : rating))
                  }
                  className={`cursor-pointer px-4 py-2 ${ratingFilter === rating ? "bg-[#f9a826] text-white" : "hover:bg-gray-200"
                    }`}
                >
                  {rating} ⭐ & Up
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info & Image */}
        <div className="flex items-center gap-2 md:gap-4 text-center md:text-left">
          <p className="text-[#001021] dark:text-gray-300 max-w-lg">
            Browse through various vehicles and choose the best one for your journey.
          </p>
          <img src="/img/look-down.png" alt="" className="h-[50px] w-[55px] hidden md:block" />
        </div>

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
      </div>

      <div className="my-10 flex justify-center mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {filteredData.length > 0 ? filteredData.map((item, i) => <Card key={i} data={item} />) : <p>No vehicles available.</p>}
        </div>
      </div>
    </div>
  );
}

export default VehicleGallery;




