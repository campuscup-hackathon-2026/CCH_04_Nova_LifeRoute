import { useState, useEffect } from 'react';
import { Coordinates } from '../types';
import { DEFAULT_CENTER_COORDS } from '../data/mockData';

interface GeolocationState {
  coordinates: Coordinates;
  isLoading: boolean;
  accuracyMeters: number;
  isSimulated: boolean;
  error: string | null;
  detectLocation: () => void;
}

export const useGeolocation = (): GeolocationState => {
  const [coordinates, setCoordinates] = useState<Coordinates>(DEFAULT_CENTER_COORDS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accuracyMeters, setAccuracyMeters] = useState<number>(8);
  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser. Using high-precision simulated coordinates.');
      setIsLoading(false);
      setIsSimulated(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: 'Current Detected GPS Location',
        });
        setAccuracyMeters(Math.round(pos.coords.accuracy) || 12);
        setIsSimulated(false);
        setIsLoading(false);
      },
      (err) => {
        console.warn('GPS permission denied or unavailable, falling back to simulated Metro Center', err);
        // Realistic simulated coordinate with slight realistic jitter
        const jitterLat = (Math.random() - 0.5) * 0.004;
        const jitterLng = (Math.random() - 0.5) * 0.004;
        setCoordinates({
          lat: DEFAULT_CENTER_COORDS.lat + jitterLat,
          lng: DEFAULT_CENTER_COORDS.lng + jitterLng,
          address: 'Simulated Metro District Location (GPS Demo Mode)',
        });
        setAccuracyMeters(9);
        setIsSimulated(true);
        setIsLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return {
    coordinates,
    isLoading,
    accuracyMeters,
    isSimulated,
    error,
    detectLocation,
  };
};

