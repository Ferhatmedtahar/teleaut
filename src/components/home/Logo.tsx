"use client";

import { useState } from "react";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "icon" | "text" | "stacked";
  className?: string;
}

const sizeClasses = {
  xs: "text-base",
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-5xl",
};

const iconSizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export default function CognaciaLogo({
  size = "md",
  variant = "default",
  className = "",
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const textSize = sizeClasses[size];
  const iconSize = iconSizes[size];

  if (variant === "icon") {
    return (
      <div
        className={`${iconSize} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <linearGradient
              id="iconGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(205, 35%, 78%)" />
              <stop offset="100%" stopColor="hsl(208, 50%, 22%)" />
            </linearGradient>
            <linearGradient
              id="iconGradientHover"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(205, 40%, 83%)" />
              <stop offset="100%" stopColor="hsl(208, 55%, 27%)" />
            </linearGradient>
          </defs>

          {/* Main circular shape */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="url(#iconGradient)"
            className={`transition-all duration-300 ${
              isHovered ? "opacity-95" : "opacity-100"
            }`}
          />

          {/* Abstract brain/C shape */}
          <path
            d="M60 20 
               C40 20, 25 35, 25 60 
               C25 85, 40 100, 60 100
               C75 100, 85 90, 90 80"
            fill="none"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
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

          {/* Central node - lightbulb concept */}
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
    );
  }

  if (variant === "text") {
    return (
      <div className={`${className} flex items-center`}>
        <span
          className={`font-medium tracking-tight text-[#355869] dark:text-[#9BB5C4] transition-colors duration-300 ${textSize}`}
          style={{
            fontFamily: "var(--font-sans)",
            letterSpacing: "-0.02em",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Cognacia
        </span>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`${className} flex flex-col items-center gap-3`}>
        <CognaciaLogo size={size} variant="icon" />
        <CognaciaLogo
          size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"}
          variant="text"
        />
      </div>
    );
  }

  return (
    <div
      className={`px-2 flex items-center gap-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${iconSize}`}>
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
            <linearGradient
              id="logoGradientHover"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(205, 40%, 83%)" />
              <stop offset="100%" stopColor="hsl(208, 55%, 27%)" />
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
          {/* Abstract brain/C shape */}
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
          {/* Central node - lightbulb concept */}
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

      <span
        className={`font-medium font-sf-ui italic tracking-tight dark:primary-gradient-dark  text-primary-400 transition-colors duration-300 text-lg lg:text-xl  `}
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
