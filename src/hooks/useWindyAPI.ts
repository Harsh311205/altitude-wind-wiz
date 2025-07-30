import { useState, useEffect } from 'react';

interface WindyAPIOptions {
  lat: number;
  lon: number;
  altitudes?: number[];
}

interface WindDataPoint {
  altitude: number;
  windSpeed: number;
  windDirection: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  unit: string;
}

// Mock data generator for demonstration
const generateMockWindData = (lat: number, lon: number, altitudes: number[]): WindDataPoint[] => {
  const baseTemp = 15 + Math.random() * 10; // Base temperature varies by location
  const basePressure = 1013.25; // Sea level pressure in hPa
  const baseHumidity = 40 + Math.random() * 40; // Base humidity 40-80%

  return altitudes.map(altitude => {
    // Temperature decreases with altitude (lapse rate ~6.5°C per km)
    const temperature = Math.round(baseTemp - (altitude / 1000) * 6.5 + (Math.random() - 0.5) * 4);
    
    // Pressure decreases with altitude (approximately exponential)
    const pressure = Math.round(basePressure * Math.pow((1 - 0.0065 * altitude / 288.15), 5.255));
    
    // Humidity generally decreases with altitude but can vary
    const humidityVariation = (Math.random() - 0.5) * 30;
    const humidity = Math.max(10, Math.min(100, Math.round(baseHumidity - (altitude / 1000) * 5 + humidityVariation)));

    return {
      altitude,
      windSpeed: Math.round(5 + Math.random() * 25 + (altitude / 1000) * 3),
      windDirection: Math.round(Math.random() * 360),
      temperature,
      humidity,
      pressure,
      unit: altitude < 10000 ? 'm' : 'ft'
    };
  });
};

export const useWindyAPI = (options?: WindyAPIOptions) => {
  const [windData, setWindData] = useState<WindDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultAltitudes = [100, 500, 1000, 2000, 3000, 5000, 8000];

  const fetchWindData = async (lat: number, lon: number, altitudes = defaultAltitudes) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, generate mock data
      // In a real implementation, you would call the Windy API here
      const data = generateMockWindData(lat, lon, altitudes);
      setWindData(data);
    } catch (err) {
      setError('Failed to fetch wind data');
      console.error('Wind API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.lat && options?.lon) {
      fetchWindData(options.lat, options.lon, options.altitudes);
    }
  }, [options?.lat, options?.lon]);

  return {
    windData,
    loading,
    error,
    fetchWindData,
    refetch: () => options && fetchWindData(options.lat, options.lon, options.altitudes)
  };
};