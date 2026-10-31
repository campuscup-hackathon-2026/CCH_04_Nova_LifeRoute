import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

interface LiveSimulationProps {
  startCoords?: Coordinates | null;
  targetCoords?: Coordinates | null;
  isActive: boolean;
  baseEtaMinutes?: number;
}

export const useLiveSimulation = ({
  startCoords,
  targetCoords,
  isActive,
  baseEtaMinutes = 5,
}: LiveSimulationProps) => {
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(startCoords || null);
  const [progressPercent, setProgressPercent] = useState<number>(15);
  const [etaRemainingMinutes, setEtaRemainingMinutes] = useState<number>(baseEtaMinutes);
  const [speedKmh, setSpeedKmh] = useState<number>(48);

  useEffect(() => {
    if (startCoords) {
      setCurrentCoords(startCoords);
    }
  }, [startCoords?.lat, startCoords?.lng]);

  useEffect(() => {
    if (!isActive || !startCoords || !targetCoords) return;

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + 1.2;
        if (next >= 98) {
          return 98; // hold near destination
        }

        // Linear interpolation with slight speed fluctuation
        const ratio = next / 100;
        const lat = startCoords.lat + (targetCoords.lat - startCoords.lat) * ratio;
        const lng = startCoords.lng + (targetCoords.lng - startCoords.lng) * ratio;

        setCurrentCoords({
          lat,
          lng,
          address: `En Route Telemetry (${Math.round(next)}% route completed)`,
        });

        // Update ETA proportionally
        const remaining = Math.max(1, Math.round(baseEtaMinutes * (1 - ratio)));
        setEtaRemainingMinutes(remaining);

        // Fluctuate speed realistically between 42 - 58 km/h
        setSpeedKmh(Math.floor(45 + Math.random() * 12));

        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, startCoords, targetCoords, baseEtaMinutes]);

  return {
    currentCoords,
    progressPercent,
    etaRemainingMinutes,
    speedKmh,
  };
};

