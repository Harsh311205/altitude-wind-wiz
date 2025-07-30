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
  unit: string;
}

// Mock data generator for demonstration
const generateMockWindData = (lat: number, lon: number, altitudes: number[]): WindDataPoint[] => {
  return altitudes.map(altitude => ({
    altitude,
    windSpeed: Math.round(5 + Math.random() * 25 + (altitude / 1000) * 3),
    windDirection: Math.round(Math.random() * 360),
    temperature: Math.round(15 - (altitude / 1000) * 6.5 + Math.random() * 5),
    unit: altitude < 10000 ? 'm' : 'ft'
  }));
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