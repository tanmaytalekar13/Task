import React, { createContext, useState } from 'react';

export const LocationDataContext = createContext();

const LocationContext = ({ children }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState({
    house: "",
    apartment: "",
    category: "Home",
    fullAddress: "", // This will store the full address from the map
  });
  const [recentSearches, setRecentSearches] = useState([]); // State for storing recent searches

  const updateAddress = (newAddress) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      ...newAddress,
      fullAddress: newAddress.fullAddress || prevAddress.fullAddress, // Ensure fullAddress is updated
    }));

    // Update recent searches with full address details
    setRecentSearches((prevSearches) => {
      const updatedSearches = [
        { ...address, ...newAddress }, // Add the current address to recent searches
        ...prevSearches.filter(
          (search) => search.fullAddress !== newAddress.fullAddress
        ), // Avoid duplicates
      ];
      return updatedSearches.slice(0, 5); // Keep only the last 5 searches
    });
  };

  return (
    <LocationDataContext.Provider
      value={{
        location,
        setLocation,
        address,
        setAddress,
        updateAddress,
        recentSearches,
      }}
    >
      {children}
    </LocationDataContext.Provider>
  );
};

export default LocationContext;
