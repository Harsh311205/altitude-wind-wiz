import React, { useState } from 'react';
import { Search, MapPin, Crosshair } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call - replace with actual geocoding API
    setTimeout(() => {
      const mockLocation = {
        name: searchQuery,
        lat: 51.5074 + (Math.random() - 0.5) * 10,
        lon: -0.1278 + (Math.random() - 0.5) * 10,
        country: 'Mock Country'
      };
      onLocationSelect(mockLocation);
      setIsSearching(false);
    }, 1000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            name: 'Current Location',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          onLocationSelect(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className="p-6 bg-gradient-sky shadow-altitude">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Wind Forecast Location</h2>
          <p className="text-muted-foreground">Search for a location or use your current position</p>
        </div>

        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter city, coordinates, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-background/80 backdrop-blur-sm"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-gradient-wind shadow-wind hover:shadow-glow transition-all duration-300"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            className="flex items-center space-x-2 hover:bg-primary/10 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
            <span>Use Current Location</span>
          </Button>
        </div>

        {currentLocation && (
          <div className="mt-4 p-4 bg-background/60 rounded-lg backdrop-blur-sm animate-altitude-rise">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">{currentLocation.name}</div>
                  {currentLocation.country && (
                    <div className="text-sm text-muted-foreground">{currentLocation.country}</div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Coordinates Display */}
              <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Latitude</div>
                  <div className="text-lg font-bold text-primary">{currentLocation.lat.toFixed(6)}°</div>
                  <div className="text-xs text-muted-foreground">{currentLocation.lat >= 0 ? 'N' : 'S'}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Longitude</div>
                  <div className="text-lg font-bold text-primary">{currentLocation.lon.toFixed(6)}°</div>
                  <div className="text-xs text-muted-foreground">{currentLocation.lon >= 0 ? 'E' : 'W'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};