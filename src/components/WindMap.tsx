import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Wind, Navigation } from 'lucide-react';

interface WindMapProps {
  location?: {
    lat: number;
    lon: number;
    name: string;
  };
  windData?: {
    speed: number;
    direction: number;
  };
}

export const WindMap: React.FC<WindMapProps> = ({ location, windData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !location || !windData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2; // For retina displays
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'hsl(210, 60%, 85%)');
    gradient.addColorStop(1, 'hsl(200, 40%, 95%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw wind vectors
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create animated wind particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: windData.speed / 10 + Math.random() * 2,
      direction: windData.direction * (Math.PI / 180),
      opacity: 0.3 + Math.random() * 0.4
    }));

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Redraw background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw particles
      particles.forEach(particle => {
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        // Wrap around edges
        if (particle.x > width) particle.x = 0;
        if (particle.x < 0) particle.x = width;
        if (particle.y > height) particle.y = 0;
        if (particle.y < 0) particle.y = height;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(205, 85%, ${45 + particle.speed * 5}%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1 + particle.speed / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw central location marker
      ctx.save();
      ctx.fillStyle = 'hsl(205, 85%, 45%)';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [location, windData]);

  return (
    <Card className="p-4 bg-gradient-sky shadow-altitude">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-primary" />
            <span>Wind Visualization</span>
          </h3>
          {windData && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Wind className="w-4 h-4" />
              <span>{windData.speed} km/h • {windData.direction}°</span>
            </div>
          )}
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg border border-border/50"
            style={{ background: 'transparent' }}
          />
          
          {location && (
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-md text-sm">
              {location.name}
            </div>
          )}
          
          {windData && (
            <div className="absolute top-2 right-2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-md text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full bg-primary animate-wind-pulse"
                  style={{ animationDuration: `${Math.max(0.5, 2 - windData.speed / 15)}s` }}
                />
                <span>Live Wind Data</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};