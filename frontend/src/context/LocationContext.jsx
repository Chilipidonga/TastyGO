import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

// 👇 THIS WAS MISSING OR BROKEN 👇
export const useLocation = () => useContext(LocationContext); 

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: 'Select Location',
    loaded: false
  });

  const updateLocation = (lat, lng, address) => {
    setLocation({ lat, lng, address, loaded: true });
    localStorage.setItem('userLocation', JSON.stringify({ lat, lng, address }));
  };

  // 1. Fetch Exact Address (Reverse Geocoding)
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      
      const addr = data.address;
      const part1 = addr.house_number || addr.building || addr.amenity || '';
      const part2 = addr.road || addr.pedestrian || addr.street || '';
      const part3 = addr.suburb || addr.neighbourhood || addr.residential || '';
      const city = addr.city || addr.town || addr.village || '';

      let formattedAddress = [part1, part2, part3, city].filter(Boolean).join(', ');

      if (formattedAddress.length < 5) {
        formattedAddress = data.display_name.split(',').slice(0, 3).join(',');
      }

      updateLocation(lat, lng, formattedAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // 2. Search Location by Name
  const searchLocation = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const formattedAddress = data[0].display_name.split(',').slice(0, 3).join(',');
        
        updateLocation(lat, lng, formattedAddress);
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert('Error searching location');
    }
  };

  // 3. Auto-Detect GPS
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchAddress(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert('Unable to retrieve location');
      }
    );
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      setLocation({ ...parsed, loaded: true });
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, detectLocation, searchLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};