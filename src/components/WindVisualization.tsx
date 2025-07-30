import React from 'react';
import { Wind, ArrowUp, Thermometer, Droplets, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WindData {
  altitude: number;
  windSpeed: number;
  windDirection: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  unit: string;
}

interface WindVisualizationProps {
  data: WindData[];
  selectedAltitude?: number;
  onAltitudeSelect?: (altitude: number) => void;
}

const getWindSpeedColor = (speed: number) => {
  if (speed < 5) return 'text-wind-light';
  if (speed < 15) return 'text-wind-moderate';
  if (speed < 25) return 'text-wind-strong';
  return 'text-wind-extreme';
};

const getWindSpeedIntensity = (speed: number) => {
  if (speed < 5) return 'wind-light';
  if (speed < 15) return 'wind-moderate';
  if (speed < 25) return 'wind-strong';
  return 'wind-extreme';
};

export const WindVisualization: React.FC<WindVisualizationProps> = ({
  data,
  selectedAltitude,
  onAltitudeSelect
}) => {
  return (
    <div className="space-y-4">
      {data.map((windData, index) => (
        <Card
          key={windData.altitude}
          className={`p-6 cursor-pointer transition-all duration-500 bg-gradient-altitude hover:shadow-wind ${
            selectedAltitude === windData.altitude ? 'ring-2 ring-primary shadow-glow' : ''
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onAltitudeSelect?.(windData.altitude)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Altitude Indicator */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground">Altitude</div>
                <div className="text-2xl font-bold text-primary">
                  {windData.altitude}
                  <span className="text-sm ml-1">{windData.unit}</span>
                </div>
              </div>

              {/* Wind Direction Indicator */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-wind flex items-center justify-center shadow-wind">
                  <ArrowUp
                    className={`w-8 h-8 text-primary-foreground transform transition-transform duration-700 ${getWindSpeedColor(windData.windSpeed)}`}
                    style={{
                      transform: `rotate(${windData.windDirection}deg)`,
                      filter: windData.windSpeed > 10 ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  {windData.windDirection}°
                </div>
              </div>

              {/* Wind Speed */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <Wind className={`w-6 h-6 animate-wind-pulse ${getWindSpeedColor(windData.windSpeed)}`} />
                  <span className={`text-3xl font-bold ${getWindSpeedColor(windData.windSpeed)}`}>
                    {windData.windSpeed}
                  </span>
                  <span className="text-sm text-muted-foreground">km/h</span>
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {getWindSpeedIntensity(windData.windSpeed).replace('-', ' ')} wind
                </div>
              </div>
            </div>

            {/* Additional Data */}
            <div className="flex flex-col items-end space-y-3">
              {/* Weather Parameters */}
              <div className="grid grid-cols-1 gap-2 text-right">
                {windData.temperature && (
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-lg font-semibold">{windData.temperature}°C</span>
                    <Thermometer className="w-4 h-4 text-orange-500" />
                  </div>
                )}
                {windData.humidity && (
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-lg font-semibold">{windData.humidity}%</span>
                    <Droplets className="w-4 h-4 text-blue-500" />
                  </div>
                )}
                {windData.pressure && (
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-lg font-semibold">{windData.pressure} hPa</span>
                    <Gauge className="w-4 h-4 text-purple-500" />
                  </div>
                )}
              </div>
              
              {/* Wind Intensity Bars */}
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-2 h-6 rounded-full transition-all duration-500 ${
                      bar <= Math.ceil(windData.windSpeed / 5)
                        ? `bg-${getWindSpeedIntensity(windData.windSpeed)} animate-wind-pulse`
                        : 'bg-muted'
                    }`}
                    style={{ animationDelay: `${bar * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Wind Flow Animation */}
          <div className="mt-4 relative overflow-hidden h-2 bg-muted rounded-full">
            <div
              className={`absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-${getWindSpeedIntensity(windData.windSpeed)} to-transparent animate-data-flow rounded-full`}
              style={{ animationDuration: `${Math.max(0.5, 3 - windData.windSpeed / 10)}s` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};