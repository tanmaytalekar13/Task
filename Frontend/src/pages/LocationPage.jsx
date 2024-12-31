import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiHome, FiBriefcase, FiUsers } from "react-icons/fi";
import axios from "axios";

const LocationPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token: " + token);
        const response = await axios.get("http://localhost:8000/api/users/addresses", {
            headers: {
                Authorization: `Bearer ${token}`, // Correctly formatted
                "Content-Type": "application/json",
            },
        });
        

        console.log("Addresses fetched:", response.data);
        setAddresses(response.data.addresses); // Assuming the response contains an 'addresses' field
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const parseFullAddress = (fullAddress) => {
    const addressParts = fullAddress.split(",");
    const area = addressParts[0].trim();
    const district = addressParts[1]?.trim();
    const state = addressParts[2]?.trim();
    const pincode = addressParts[3]?.trim();
    const country = addressParts[4]?.trim();

    return { area, district, state, pincode, country };
  };

  return (
    <div className="min-h-screen bg-red-100">
      {/* Header */}
      <header className="bg-red-600 text-white py-4 text-center font-semibold text-xl">
        Your Location
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-white rounded-lg shadow-md">
          <FiSearch className="text-gray-500 ml-4 text-xl" />
          <input
            type="text"
            placeholder="Search your area/pincode/apartment"
            className="flex-1 p-3 text-gray-700 focus:outline-none rounded-r-lg"
          />
        </div>
      </div>

      {/* Current Location */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center text-red-600">
          <FiMapPin className="text-xl mr-2" />
          <span className="font-medium">Current location</span>
        </div>
        <button className="border border-red-600 text-red-600 px-4 py-1 rounded-lg hover:bg-red-600 hover:text-white transition">
          Enable
        </button>
      </div>

      {/* Saved Locations */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Saved Location</h2>
        <div className="space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            addresses.map((address, index) => {
              const { area, district, state, pincode, country } = parseFullAddress(address.fullAddress);

              return (
                <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  {address.category === "Home" && <FiHome className="text-black text-2xl mr-4" />}
                  {address.category === "Office" && <FiBriefcase className="text-black text-2xl mr-4" />}
                  {address.category === "Friends & Family" && <FiUsers className="text-black text-2xl mr-4" />}
                  <div>
                    <h3 className="font-medium">{address.category}</h3>
                    <p className="text-sm text-gray-500">{area}, {district}, {state}, {pincode}, {country}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
        <div className="space-y-4">
          {/* Example of static recent searches */}
          <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
            <FiMapPin className="text-red-600 text-2xl mr-4" />
            <div>
              <h3 className="font-medium">Wadala West</h3>
              <p className="text-sm text-gray-500">
                near Shitla Devi Mandir, Chembur Colony, Chembur, Mumbai,
                Maharashtra, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
