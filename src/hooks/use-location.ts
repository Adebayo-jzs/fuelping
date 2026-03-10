import { useState } from "react";
import { useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
  locality: string;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocality = async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        );
        const data = await response.json();
        return (
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          "Lags, Nigeria"
        );
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
        return "Lags, Nigeria";
      }
    };

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      // Fallback to Lags
      setLocation({ lat: 6.5244, lng: 3.3792, locality: "Lags, Nigeria" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLoading(true);
        const locality = await fetchLocality(lat, lng);

        setLocation({
          lat,
          lng,
          locality,
        });
        setLoading(false);
      },
      () => {
        setError("Location access denied");
        setLocation({ lat: 6.5244, lng: 3.3792, locality: "Lags, Nigeria" });
        setLoading(false);
      },
    );
  }, []);

  return { location, loading, error };
}
