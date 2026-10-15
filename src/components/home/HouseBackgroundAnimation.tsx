import React, { useEffect, useRef, useState } from 'react';

/**
 * HouseBackgroundAnimation
 * Refined architectural blueprint isometric line elevation.
 * Restrained, enterprise-grade vector line geometry without neon laser gimmicks.
 */
export const HouseBackgroundAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle interactive parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = mousePos.x * 8;
  const parallaxY = mousePos.y * 6;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <style>{`
        @keyframes blueprintDrift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .blueprint-subtle {
          animation: blueprintDrift 8s ease-in-out infinite;
        }
      `}</style>

      {/* Restrained architectural blueprint isometric drawing */}
      <div
        className="absolute right-[-10%] sm:right-[0%] lg:right-[6%] top-[10%] sm:top-[12%] w-[680px] sm:w-[760px] lg:w-[860px] transition-transform duration-700 ease-out blueprint-subtle opacity-45"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px)`
        }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Coordinate Grid Lines */}
          <g stroke="#10B981" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.3">
            <line x1="100" y1="420" x2="500" y2="600" />
            <line x1="500" y1="600" x2="900" y2="400" />
            <line x1="900" y1="400" x2="500" y2="220" />
            <line x1="500" y1="220" x2="100" y2="420" />
            <line x1="200" y1="470" x2="600" y2="270" />
            <line x1="300" y1="520" x2="700" y2="320" />
            <line x1="400" y1="565" x2="800" y2="365" />
          </g>

          {/* Foundation & Terrace Slab */}
          <polygon
            points="500,560 840,390 500,230 160,400"
            fill="#05211B"
            fillOpacity="0.6"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <polygon points="160,400 500,560 500,572 160,412" fill="#021410" stroke="#059669" strokeWidth="0.8" strokeOpacity="0.3" />
          <polygon points="500,560 840,390 840,402 500,572" fill="#010A08" stroke="#059669" strokeWidth="0.8" strokeOpacity="0.3" />

          {/* Terrace Pool Basin */}
          <polygon
            points="280,480 470,390 390,348 200,438"
            fill="#063228"
            fillOpacity="0.7"
            stroke="#059669"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <line x1="220" y1="445" x2="420" y2="395" stroke="#34D399" strokeWidth="0.75" opacity="0.35" strokeDasharray="3 3" />
          <line x1="250" y1="462" x2="445" y2="410" stroke="#34D399" strokeWidth="0.75" opacity="0.35" strokeDasharray="3 3" />

          {/* Ground Floor Living Volume */}
          <polygon
            points="460,420 740,285 580,205 300,340"
            fill="#041B16"
            fillOpacity="0.8"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <polygon
            points="300,340 460,420 460,310 300,230"
            fill="#06241D"
            fillOpacity="0.7"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <polygon
            points="460,420 740,285 740,180 460,310"
            fill="#031612"
            fillOpacity="0.8"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Architectural Glazing Mullions (Ground Level) */}
          <polygon
            points="315,330 445,395 445,320 315,255"
            fill="#0A3328"
            fillOpacity="0.4"
            stroke="#34D399"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <line x1="360" y1="352" x2="360" y2="277" stroke="#34D399" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="405" y1="375" x2="405" y2="300" stroke="#34D399" strokeWidth="0.75" strokeOpacity="0.4" />

          {/* Suspended Cantilevered Upper Master Wing */}
          <polygon
            points="240,250 540,395 620,355 320,210"
            fill="#072921"
            fillOpacity="0.85"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          <polygon
            points="260,240 510,360 510,240 260,120"
            fill="#06221B"
            fillOpacity="0.8"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <polygon
            points="510,360 660,290 660,170 510,240"
            fill="#031611"
            fillOpacity="0.8"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Upper Glass Curtain Wall */}
          <polygon
            points="275,230 495,335 495,250 275,145"
            fill="#0B3A2E"
            fillOpacity="0.4"
            stroke="#34D399"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <line x1="330" y1="205" x2="330" y2="280" stroke="#34D399" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="385" y1="230" x2="385" y2="305" stroke="#34D399" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="440" y1="257" x2="440" y2="320" stroke="#34D399" strokeWidth="0.75" strokeOpacity="0.4" />

          {/* Cantilever Glass Balustrade */}
          <line x1="245" y1="230" x2="535" y2="370" stroke="#10B981" strokeWidth="1.2" strokeOpacity="0.6" />
          <line x1="245" y1="245" x2="245" y2="230" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="535" y1="385" x2="535" y2="370" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" />

          {/* Roof Terrace Flat Slab & Pergola */}
          <polygon
            points="250,115 520,245 680,165 410,35"
            fill="#06221B"
            fillOpacity="0.8"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
          {/* Architectural Pergola Louvers */}
          <g stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.4">
            <line x1="320" y1="75" x2="440" y2="135" />
            <line x1="345" y1="65" x2="465" y2="125" />
            <line x1="370" y1="55" x2="490" y2="115" />
            <line x1="395" y1="45" x2="515" y2="105" />
            <line x1="420" y1="35" x2="540" y2="95" />
          </g>

          {/* Restrained Technical Dimension Annotation */}
          <g opacity="0.4" stroke="#10B981" strokeWidth="0.8">
            <line x1="720" y1="160" x2="720" y2="380" strokeDasharray="3 3" />
            <line x1="715" y1="160" x2="725" y2="160" />
            <line x1="715" y1="380" x2="725" y2="380" />
            <text x="735" y="270" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="600">
              ELEVATION · 350 m²
            </text>
          </g>
        </svg>
      </div>

      {/* Dark vignette gradient ensuring pristine contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#031914] via-[#031914]/90 to-transparent pointer-events-none w-full lg:w-3/5" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#031914] to-transparent pointer-events-none" />
    </div>
  );
};
