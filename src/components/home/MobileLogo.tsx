"use client";
import Image from "next/image";

interface MobileLogoProps {
  readonly className?: string;
  readonly textColor?: string;
}

export default function MobileTeleLogo({
  className = "",
  textColor = "text-primary dark:text-primary-50",
}: MobileLogoProps) {
  return (
    <div className="w-8 h-8 lg:h-9 lg:w-9 flex-shrink-0">
      <Image
        src="/images/logo.png"
        alt="teleaustism Logo"
        width={36}
        height={36}
        className={`w-full h-full object-contain ${className}`}
      />
    </div>
  );
}
