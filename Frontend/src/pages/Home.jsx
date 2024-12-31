import React, { useState } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [distance, setDistance] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleLocationClick = () => {
    setIsModalOpen(true);
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          const apiKey = '1c7e4de333314d59a7e297ffa84de7d5';
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
              setAddress(data.results[0].formatted);
              alert(`Location enabled: ${data.results[0].formatted}`);

              const targetLat = 19.0760;
              const targetLng = 72.8777;

              const calculatedDistance = calculateDistance(
                latitude,
                longitude,
                targetLat,
                targetLng
              );

              setDistance(calculatedDistance);
            } else {
              alert('Address not found for this location.');
            }
          } catch (error) {
            alert('Error fetching address.');
          }

          setIsModalOpen(false);
          navigate('/map'); // Navigate to the map page after location is fetched
        },
        () => {
          alert('Location permission denied. Please enable location permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };

  const handleManualSearch = () => {
    alert('Please enter your location manually.');
  };

  return (
    <div className="min-h-screen bg-red-50 p-6">
      <header className="flex justify-between items-center py-4 bg-red-600 text-white px-6 rounded-lg shadow-md">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLocationClick}
        >
          <FiMapPin className="w-6 h-6" />
          <span className="text-lg font-semibold">Your Location</span>
        </div>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-3 pl-12 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
          />
          <FiSearch className="absolute left-4 top-3 w-6 h-6 text-red-600" />
        </div>
      </header>

      <main className="mt-10">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Featured Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img
              src="/path/to/product-image.jpg"
              alt="Product"
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="mt-4 text-lg font-semibold text-red-700">Product Name</h2>
            <p className="text-red-500 font-bold">$Price</p>
            <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold text-red-700 mb-4">
              Location Permission is Off
            </h2>
            <p className="text-gray-600 mb-6">
              We need your location to find the nearest store & provide you a seamless
              delivery experience.
            </p>
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors mb-4"
              onClick={requestLocationPermission}
            >
              Enable Location
            </button>
            <button
              className="w-full border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
              onClick={handleManualSearch}
            >
              Search Your Location Manually
            </button>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {address && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-700">Your Address:</h2>
          <p className="text-gray-700">{address}</p>
          {distance && (
            <p className="text-gray-700 mt-4">
              Distance to Target Address: {distance} km
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
