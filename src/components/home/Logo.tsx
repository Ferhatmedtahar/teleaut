"use client";

import { useState } from "react";

interface LogoProps {
  className?: string;
}

export default function CognaciaLogo({ className = "" }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${className} px-2 flex items-center gap-2`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Icon */}
      <div className="w-8 h-8 flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(205, 35%, 78%)" />
              <stop offset="100%" stopColor="hsl(208, 50%, 22%)" />
            </linearGradient>
          </defs>

          {/* Main circular shape */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="url(#logoGradient)"
            className={`transition-all duration-300 ${
              isHovered ? "opacity-95" : "opacity-100"
            }`}
          />

          {/* Neural network connections */}
          <g
            className={`transition-all duration-500 ${
              isHovered ? "opacity-90" : "opacity-70"
            }`}
          >
            {/* Connection dots */}
            <circle cx="60" cy="30" r="4" fill="white" />
            <circle cx="40" cy="40" r="4" fill="white" />
            <circle cx="30" cy="60" r="4" fill="white" />
            <circle cx="40" cy="80" r="4" fill="white" />
            <circle cx="60" cy="90" r="4" fill="white" />
            <circle cx="80" cy="80" r="4" fill="white" />
            <circle cx="90" cy="60" r="4" fill="white" />
            <circle cx="80" cy="40" r="4" fill="white" />

            {/* Connection lines */}
            <line
              x1="60"
              y1="30"
              x2="40"
              y2="40"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="40"
              y1="40"
              x2="30"
              y2="60"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="30"
              y1="60"
              x2="40"
              y2="80"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="40"
              y1="80"
              x2="60"
              y2="90"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="60"
              y1="90"
              x2="80"
              y2="80"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="80"
              y1="80"
              x2="90"
              y2="60"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="90"
              y1="60"
              x2="80"
              y2="40"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="80"
              y1="40"
              x2="60"
              y2="30"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Cross connections */}
            <line
              x1="60"
              y1="30"
              x2="30"
              y2="60"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <line
              x1="30"
              y1="60"
              x2="60"
              y2="90"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <line
              x1="60"
              y1="90"
              x2="90"
              y2="60"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <line
              x1="90"
              y1="60"
              x2="60"
              y2="30"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </g>

          {/* Central node */}
          <circle
            cx="60"
            cy="60"
            r="8"
            fill="white"
            className={`transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-90"
            }`}
          />
        </svg>
      </div>

      {/* Logo Text - Hidden on mobile, visible from sm and up */}
      <span
        className="hidden sm:block font-sf-ui italic font-medium tracking-tight text-primary transition-colors duration-300 text-lg"
        style={{
          fontFamily: "var(--font-sans)",
          letterSpacing: "-0.02em",
        }}
      >
        Cognacia
      </span>
    </div>
  );
}
