"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  readonly className?: string;
  readonly textColor?: string;
}

export default function TeleaustismLogo({
  className = "",
  textColor = "text-primary dark:text-primary-50",
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`${className}  px-2 flex items-center gap-1`}>
      <Image
        src={"/images/logo.png"}
        width={30}
        height={30}
        alt="TeleAustism Logo"
        className="rounded-full"
      />{" "}
      <span
        className={`${
          textColor ?? "text-white"
        } hidden sm:block font-sf-ui italic font-medium tracking-tight transition-colors duration-300 text-lg lg:text-xl xl:text-2xl`}
        style={{
          fontFamily: "var(--font-sans)",
          letterSpacing: "-0.02em",
        }}
      >
        TeleAustism
      </span>
    </div>
  );
}
