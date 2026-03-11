import { useState } from "react";
import { useEffect } from "react";
import { Location } from "@/lib/types";

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      // Fallback to Lagos
      setLocation({ 
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

        setLoading(true);
        const { city, state } = await fetchLocationDetails(lat, lng);

        setLocation({
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
        setLocation({ 
          lat: 6.5244, 
          lng: 3.3792, 
          city: "Lagos", 
          state: "Lagos State",
          locality: "Lagos, Nigeria" 
        });
        setLoading(false);
      },
    );
  }, []);

  return { location, loading, error };
}
