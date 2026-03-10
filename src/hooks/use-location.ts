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
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      // Fallback to Lagos
      setLocation({ lat: 6.5244, lng: 3.3792, locality: "Lags, Nigeria" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          locality: "Lags, Nigeria", // In production, reverse geocode
        });
        setLoading(false);
      },
      () => {
        setError("Location access denied");
        setLocation({ lat: 6.5244, lng: 3.3792, locality: "Lags, Nigeria" });
        setLoading(false);
      }
    );
  }, []);

  return { location, loading, error };
}
