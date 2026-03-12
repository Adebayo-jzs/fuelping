import React, { createContext, useContext, useState, useEffect } from "react";
import { Location } from "@/lib/types";

interface LocationContextType {
  location: Location | null;
  loading: boolean;
  error: string | null;
  setLocation: (location: Location) => void;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
  };

  const fetchLocationDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      );
      const data = await response.json();
      const city = data.city || data.locality || "";
      const state = data.principalSubdivision || "";

      return { city, state };
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return { city: "Lagos", state: "Lagos State" };
    }
  };

  const refreshLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      // Fallback to Lagos
      setLocationState({ 
        lat: 6.5244, 
        lng: 3.3792, 
        city: "Lagos", 
        state: "Lagos State",
        locality: "Lagos, Nigeria" 
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const { city, state } = await fetchLocationDetails(lat, lng);

        setLocationState({
          lat,
          lng,
          city,
          state,
          locality: city && state ? `${city}, ${state}` : (city || state || "Lagos, Nigeria"),
        });
        setLoading(false);
      },
      () => {
        setError("Location access denied");
        setLocationState({ 
          lat: 6.5244, 
          lng: 3.3792, 
          city: "Lagos", 
          state: "Lagos State",
          locality: "Lagos, Nigeria" 
        });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, setLocation, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};
