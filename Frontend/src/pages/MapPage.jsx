import React, { useContext, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LocationDataContext } from "../context/LocationContext"; // Adjust the import based on your file structure
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const MapPage = () => {
  const { location, setLocation, updateAddress } = useContext(LocationDataContext);
  const [address, setAddress] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for routing

  // Fetch address using lat and lng
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        updateAddress({ fullAddress: data.display_name }); // Update fullAddress in the context
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch coordinates based on location name
  const fetchCoordinates = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName
        )}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        fetchAddress(lat, lon);
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Marker component to update location on map click
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        fetchAddress(lat, lng);
      },
    });

    return location.lat && location.lng ? (
      <Marker position={location}>
        <Popup>
          <div className="text-center text-sm text-white bg-red-600 px-2 py-1 rounded-md">
            Your order will be delivered here <br />
            Move pin to your exact location
          </div>
        </Popup>
      </Marker>
    ) : null;
  };

  // Locate user based on geolocation API
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log("Geolocation accuracy:", accuracy); // Log accuracy
          setLocation({ lat: latitude, lng: longitude, accuracy });
          fetchAddress(latitude, longitude);
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

  // Hook to update map view when location changes
  const MapView = () => {
    const map = useMap();

    useEffect(() => {
      if (location.lat && location.lng) {
        // Adjust zoom level based on accuracy
        const zoomLevel = location.accuracy < 500 ? 15 : 13; // Zoom level 15 for higher accuracy
        map.setView([location.lat, location.lng], zoomLevel); // Set zoom level dynamically
      }
    }, [location, map]);

    return null; // This component doesn't render anything
  };

  // Fetch user's location on component mount if not available
  useEffect(() => {
    if (!location.lat && !location.lng) {
      locateUser(); // Automatically fetch location on page load
    }
  }, [location]);

  // Function to handle setting the location as delivery location
  const handleSetDeliveryLocation = () => {
    if (address) {
      // Navigate to /address route
      navigate("/address");
    } else {
      alert("Please select a valid location.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white text-center py-2 shadow-md">
        <h1 className="text-lg font-bold">Location Information</h1>
      </header>

      {location.lat && location.lng ? (
        <div className="relative flex-1">
          <MapContainer
            center={location}
            zoom={15} // Increased zoom level
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            <MapView /> {/* This component updates the map view */}
            <ZoomControl position="bottomright" />
          </MapContainer>

          <div className="flex justify-center">
            <button
              onClick={locateUser}
              className="absolute bottom-52 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-200 text-black px-3 py-2 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ease-in-out z-50"
              style={{ zIndex: 1000 }}
            >
              <img
                src="https://static-00.iconduck.com/assets.00/scope-icon-2045x2048-m01gyvn2.png"
                alt="Locate Me"
                className="w-5 h-5 mr-2"
              />
              Locate Me
            </button>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md z-10"
            style={{ zIndex: 1000 }}
          >
            <h3 className="text-sm font-semibold mb-1">
              Select Your Delivery Location
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-600">
                  {address || "Fetching address..."}
                </p>
                <p className="text-xs text-gray-600">
                  {address ? "Address updated dynamically" : ""}
                </p>
              </div>
              <div className="flex space-x-4 flex-col gap-4 items-end">
                <button
                  className={`w-full text-sm px-4 py-2 rounded-md ${
                    address
                      ? "bg-white text-black border-2 border-red-500"
                      : "bg-red-500 text-white"
                  }`}
                  onClick={locateUser} // Use the same function for both buttons
                >
                  {address ? "Enable" : "Enable"}
                </button>
                <button
                  className="w-full text-sm px-4 py-2 rounded-md bg-red-500 text-white"
                  onClick={() => setShowSearchBox(!showSearchBox)}
                >
                  Change
                </button>
              </div>
            </div>

            {showSearchBox && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter location"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  onClick={() => fetchCoordinates(manualLocation)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Update Location
                </button>
              </div>
            )}

            {/* Set as Delivery Location Button */}
            <div className="mt-4">
              <button
                onClick={handleSetDeliveryLocation}
                className="w-full text-sm px-4 py-2 rounded-md bg-green-500 text-white"
              >
                Set as Delivery Location
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default MapPage;
