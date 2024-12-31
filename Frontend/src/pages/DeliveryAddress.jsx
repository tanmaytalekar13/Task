import React, { useState, useContext } from "react";
import { FaHome, FaSuitcase, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { LocationDataContext } from "../context/LocationContext";
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const DeliveryAddress = () => {
  const { address, updateAddress } = useContext(LocationDataContext);
  const [userAddress, setUserAddress] = useState({
    house: address.house || "",
    apartment: address.apartment || "",
    category: address.category || "Home", // Default to "Home"
    fullAddress: address.fullAddress || "", // This will store the full address from the map
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserAddress({ ...userAddress, [name]: value });
  };

  const handleCategoryChange = (category) => {
    setUserAddress({ ...userAddress, category });
  };

  const handleSubmit = async () => {
    // Update the address in context
    updateAddress(userAddress);
    alert(`Address saved as ${userAddress.category}`);
    console.log("Address details:", userAddress);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to save an address');
      return;
    }

    try {
      // Make the API request to save the address
      const response = await axios.post(
        'http://localhost:8000/api/users/address',
        {
          address: userAddress, // Send the address data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Address saved:', response.data);
    } catch (error) {
      // Improved error handling
      if (error.response) {
        console.error('Error saving address:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Failed to save address'}`);
      } else {
        console.error('Error saving address:', error.message);
        alert('Error: Unable to connect to the server');
      }
    }
  };

  const handleAddressManagerClick = () => {
    // Navigate to the location page
    navigate("/location");
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-6 border border-red-500">
      {/* Address with location icon */}
      <div className="flex items-center mb-6">
        <FaMapMarkerAlt className="text-red-500 mr-2" />
        <p className="text-sm text-red-500">{address.fullAddress || "Address not available"}</p>
      </div>

      {/* Address Fields */}
      <div className="mb-4">
        <label
          htmlFor="house"
          className="block text-sm font-medium text-gray-700"
        >
          House / Flat / Block No.
        </label>
        <input
          type="text"
          id="house"
          name="house"
          value={userAddress.house}
          onChange={handleInputChange}
          placeholder="Enter house/flat/block number"
          className="mt-1 p-2 border rounded-lg w-full focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="apartment"
          className="block text-sm font-medium text-gray-700"
        >
          Apartment / Road / Area
        </label>
        <input
          type="text"
          id="apartment"
          name="apartment"
          value={userAddress.apartment}
          onChange={handleInputChange}
          placeholder="Enter apartment/road/area"
          className="mt-1 p-2 border rounded-lg w-full focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Save As Options */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Save As</p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleCategoryChange("Home")}
            className={`p-3 rounded-full border ${
              userAddress.category === "Home"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <FaHome />
          </button>
          <button
            onClick={() => handleCategoryChange("Office")}
            className={`p-3 rounded-full border ${
              userAddress.category === "Office"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <FaSuitcase />
          </button>
          <button
            onClick={() => handleCategoryChange("Friends & Family")}
            className={`p-3 rounded-full border ${
              userAddress.category === "Friends & Family"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <FaUserFriends />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Save Address
      </button>

      {/* Address Manager Button */}
      <button
        onClick={handleAddressManagerClick}
        className="w-full bg-gray-300 text-black py-2 rounded-lg mt-4 hover:bg-gray-400"
      >
        Address Manager
      </button>
    </div>
  );
};

export default DeliveryAddress;
