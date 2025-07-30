import React from 'react';
import { MapPin, Globe, Compass, Navigation2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

interface CoordinateDisplayProps {
  location: Location;
}

export const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({ location }) => {
  const formatCoordinate = (value: number, type: 'lat' | 'lon') => {
    const direction = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    
    const degrees = Math.floor(Math.abs(value));
    const minutes = Math.floor((Math.abs(value) - degrees) * 60);
    const seconds = ((Math.abs(value) - degrees - minutes / 60) * 3600).toFixed(2);
    
    return {
      decimal: Math.abs(value).toFixed(6),
      dms: `${degrees}° ${minutes}' ${seconds}" ${direction}`,
      direction
    };
  };

  const latCoord = formatCoordinate(location.lat, 'lat');
  const lonCoord = formatCoordinate(location.lon, 'lon');

  return (
    <Card className="p-6 bg-gradient-altitude shadow-altitude animate-altitude-rise">
      <div className="space-y-4">
        {/* Location Header */}
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-xl font-bold text-foreground">{location.name}</h3>
            {location.country && (
              <p className="text-sm text-muted-foreground">{location.country}</p>
            )}
          </div>
        </div>

        {/* Coordinate Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Latitude */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Navigation2 className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-foreground">Latitude</span>
            </div>
            
            <div className="bg-background/60 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Decimal</span>
                <span className="font-mono text-lg font-bold text-primary">{latCoord.decimal}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">DMS</span>
                <span className="font-mono text-sm text-foreground">{latCoord.dms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hemisphere</span>
                <span className="font-semibold text-orange-500">
                  {latCoord.direction === 'N' ? 'Northern' : 'Southern'}
                </span>
              </div>
            </div>
          </div>

          {/* Longitude */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-foreground">Longitude</span>
            </div>
            
            <div className="bg-background/60 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Decimal</span>
                <span className="font-mono text-lg font-bold text-primary">{lonCoord.decimal}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">DMS</span>
                <span className="font-mono text-sm text-foreground">{lonCoord.dms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hemisphere</span>
                <span className="font-semibold text-blue-500">
                  {lonCoord.direction === 'E' ? 'Eastern' : 'Western'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Copy */}
        <div className="bg-primary/5 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quick Copy</span>
            <button 
              className="font-mono text-sm bg-background/60 px-3 py-1 rounded border hover:bg-background/80 transition-colors"
              onClick={() => navigator.clipboard?.writeText(`${location.lat}, ${location.lon}`)}
            >
              {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};