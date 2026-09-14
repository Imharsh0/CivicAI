import { useState, useCallback } from 'react';
import { INDIAN_CITIES } from '../data/cities';

export interface LocationData {
  latitude: number;
  longitude: number;
  locationText: string;
  city: string;
  state: string;
  accuracyMeters?: number;
  isManual: boolean;
}

export function useGeolocation(initialCity = 'Delhi') {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData>(() => {
    const cityObj = INDIAN_CITIES.find((c) => c.name === initialCity) || INDIAN_CITIES[0];
    return {
      latitude: cityObj.latitude,
      longitude: cityObj.longitude,
      locationText: `Near Main Road, ${cityObj.name}`,
      city: cityObj.name,
      state: cityObj.state,
      isManual: true,
    };
  });

  const requestCurrentLocation = useCallback(async (): Promise<LocationData> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setIsLoading(false);
        resolve(location);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          // Find closest Indian city from our database
          let closestCity = INDIAN_CITIES[0];
          let minDistance = Infinity;

          for (const c of INDIAN_CITIES) {
            const d = Math.hypot(c.latitude - lat, c.longitude - lon);
            if (d < minDistance) {
              minDistance = d;
              closestCity = c;
            }
          }

          const resolvedLocation: LocationData = {
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lon.toFixed(6)),
            locationText: `GPS Pin (${lat.toFixed(4)}, ${lon.toFixed(4)}), ${closestCity.name}`,
            city: closestCity.name,
            state: closestCity.state,
            accuracyMeters: accuracy,
            isManual: false,
          };

          setLocation(resolvedLocation);
          setIsLoading(false);
          resolve(resolvedLocation);
        },
        (err) => {
          console.warn('Geolocation permission denied or timed out:', err.message);
          setError('Location access was denied or timed out. You can enter your landmark manually.');
          setIsLoading(false);
          resolve(location);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    });
  }, [location]);

  const setManualLocation = useCallback((manualData: Partial<LocationData>) => {
    setLocation((prev) => ({
      ...prev,
      ...manualData,
      isManual: true,
    }));
  }, []);

  return {
    location,
    isLoading,
    error,
    requestCurrentLocation,
    setManualLocation,
  };
}
