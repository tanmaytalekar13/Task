import React, { useState, useEffect, useContext } from "react"; // Added useContext import
import { FiSearch, FiMapPin, FiHome, FiBriefcase, FiUsers } from "react-icons/fi";
import axios from "axios";
import { LocationDataContext } from '../context/LocationContext';

const LocationPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [suggestions, setSuggestions] = useState([]); // State for location suggestions
  const [currentLocationAddress, setCurrentLocationAddress] = useState(""); // State for current location address
  const [selectedAddress, setSelectedAddress] = useState(""); // State for the selected address
  const { recentSearches, setRecentSearches } = useContext(LocationDataContext); // Using useContext to access LocationDataContext

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        console.log("token: " + token);
        const response = await axios.get("http://localhost:8000/api/users/addresses", {
          headers: {
            Authorization: `Bearer ${token}`, // Correctly formatted
            "Content-Type": "application/json",
          },
        });
        console.log("Addresses fetched:", response.data);
        setAddresses(response.data); // Assuming the response contains the addresses directly
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

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&format=json`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.display_name);
    setSelectedAddress(suggestion.display_name); // Set the selected address
    setSuggestions([]);
    // Add the selected suggestion to recent searches
    if (!recentSearches.some(search => search.fullAddress === suggestion.display_name)) {
      setRecentSearches([{ fullAddress: suggestion.display_name, category: "Search", _id: Date.now() }, ...recentSearches]);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            if (data && data.display_name) {
              setCurrentLocationAddress(data.display_name);
            }
          } catch (error) {
            console.error("Error fetching current location address:", error);
          }
        },
        (error) => {
          alert("Error getting location: " + error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-red-100">
      {/* Header */}
      <header className="bg-red-600 text-white py-4 text-center font-semibold text-xl">
        Your Location
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-white rounded-lg shadow-md relative">
          <FiSearch className="text-gray-500 ml-4 text-xl" />
          <input
            type="text"
            placeholder="Search your area/pincode/apartment"
            className="flex-1 p-3 text-gray-700 focus:outline-none rounded-r-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
          />
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg ml-2"
            onClick={handleSearch}
          >
            Search
          </button>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Display Selected Address */}
      {selectedAddress && (
        <div className="p-4">
          <h3 className="font-medium text-lg">Selected Address:</h3>
          <p className="text-sm text-gray-700">{selectedAddress}</p>
        </div>
      )}

      {/* Current Location */}
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center text-red-600">
          <FiMapPin className="text-xl mr-2" />
          <span className="font-medium">Current location</span>
        </div>
        <button
          className="border border-red-600 text-red-600 px-4 py-1 rounded-lg hover:bg-red-600 hover:text-white transition mt-2"
          onClick={handleCurrentLocation}
        >
          Enable
        </button>
        {currentLocationAddress && (
          <p className="mt-2 text-sm text-gray-700">{currentLocationAddress}</p>
        )}
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
          {recentSearches.length === 0 ? (
            <div>No recent searches</div>
          ) : (
            recentSearches.map((search, index) => {
              const { area, district, state, pincode, country } = parseFullAddress(search.fullAddress);

              return (
                <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  <FiMapPin className="text-red-600 text-2xl mr-4" />
                  <div>
                    <h3 className="font-medium">{search.fullAddress}</h3>
                    <p className="text-sm text-gray-500">
                      {area}, {district}, {state}, {pincode}, {country}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
