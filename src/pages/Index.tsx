import React, { useState } from 'react';
import { LocationSearch } from '@/components/LocationSearch';
import { WindVisualization } from '@/components/WindVisualization';
import { WindMap } from '@/components/WindMap';
import { useWindyAPI } from '@/hooks/useWindyAPI';
import { RefreshCw, Wind, Layers, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [selectedAltitude, setSelectedAltitude] = useState<number | undefined>();

  const { windData, loading, error, refetch } = useWindyAPI(
    selectedLocation ? {
      lat: selectedLocation.lat,
      lon: selectedLocation.lon
    } : undefined
  );

  const selectedWindData = windData.find(data => data.altitude === selectedAltitude);

  return (
    <div className="min-h-screen bg-gradient-sky">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Wind className="w-12 h-12 text-primary animate-wind-rotate" />
            <h1 className="text-5xl font-bold bg-gradient-wind bg-clip-text text-transparent">
              WindCast
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced wind forecast visualization with altitude analysis and real-time data
          </p>
        </div>

        {/* Location Search */}
        <LocationSearch
          onLocationSelect={setSelectedLocation}
          currentLocation={selectedLocation}
        />

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center bg-gradient-altitude shadow-altitude">
            <div className="space-y-4">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
              <div className="text-lg font-semibold">Fetching Wind Data...</div>
              <div className="text-muted-foreground">Analyzing atmospheric conditions</div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-destructive/10 border-destructive/20">
            <div className="text-center text-destructive">
              <div className="font-semibold">Error Loading Data</div>
              <div className="text-sm mt-1">{error}</div>
              <Button 
                variant="outline" 
                onClick={refetch}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Main Content */}
        {windData.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Wind Visualization */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Layers className="w-6 h-6 text-primary" />
                  <span>Altitude Analysis</span>
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
              </div>

              <WindVisualization
                data={windData}
                selectedAltitude={selectedAltitude}
                onAltitudeSelect={setSelectedAltitude}
              />
            </div>

            {/* Wind Map and Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Wind className="w-6 h-6 text-primary" />
                <span>Live Visualization</span>
              </h2>

              <WindMap
                location={selectedLocation}
                windData={selectedWindData ? {
                  speed: selectedWindData.windSpeed,
                  direction: selectedWindData.windDirection
                } : undefined}
              />

              {/* Current Conditions Summary */}
              {selectedWindData && (
                <Card className="p-6 bg-gradient-wind text-primary-foreground shadow-glow animate-altitude-rise">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Current Conditions</span>
                      <span className="text-primary-foreground/80">• {selectedWindData.altitude}{selectedWindData.unit}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-primary-foreground/80 text-sm">Wind Speed</div>
                        <div className="text-2xl font-bold">{selectedWindData.windSpeed} km/h</div>
                      </div>
                      <div>
                        <div className="text-primary-foreground/80 text-sm">Direction</div>
                        <div className="text-2xl font-bold">{selectedWindData.windDirection}°</div>
                      </div>
                      {selectedWindData.temperature && (
                        <>
                          <div>
                            <div className="text-primary-foreground/80 text-sm">Temperature</div>
                            <div className="text-2xl font-bold">{selectedWindData.temperature}°C</div>
                          </div>
                          <div>
                            <div className="text-primary-foreground/80 text-sm">Altitude</div>
                            <div className="text-2xl font-bold">{selectedWindData.altitude}{selectedWindData.unit}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center bg-card/60 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-wind-light">
                    {windData.filter(d => d.windSpeed < 15).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Light Wind</div>
                </Card>
                <Card className="p-4 text-center bg-card/60 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-wind-moderate">
                    {windData.filter(d => d.windSpeed >= 15 && d.windSpeed < 25).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Moderate</div>
                </Card>
                <Card className="p-4 text-center bg-card/60 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-wind-strong">
                    {windData.filter(d => d.windSpeed >= 25).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Strong+</div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedLocation && (
          <Card className="p-8 text-center bg-gradient-altitude shadow-altitude">
            <div className="space-y-4">
              <Wind className="w-16 h-16 text-primary mx-auto animate-wind-pulse" />
              <h3 className="text-2xl font-bold">Get Started</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Search for a location or use your current position to view detailed wind forecasts at different altitudes
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;