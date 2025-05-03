"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Background() {
  const currentPath = usePathname();
  return (
    <div className="hidden w-full lg:flex lg:w-1/2 lg:rounded-br-[6rem] items-center justify-center bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] text-gray-300 relative overflow-hidden">
      {/* Large SVG background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 z-0"
      >
        <h1 className="absolute top-10 left-10 text-2xl font-bold">LOGO</h1>
        {currentPath == "/sign-in" ? (
          <Image
            src="/icons/sign-in.svg"
            alt="Sign In Background"
            fill
            className="object-contain opacity-40 pointer-events-none"
            priority
          />
        ) : (
          <>
            <Image
              src="/icons/sign-up1.svg"
              alt="Sign Up Background Element 1"
              width={500}
              height={500}
              className={cn(
                "absolute top-[5%] left-[10%]",
                "w-[70%] h-auto",
                "opacity-65",
                "pointer-events-none object-contain",
                "transform scale-110 rotate-[-1deg]"
              )}
              priority
            />

            <Image
              src="/icons/sign-up2.svg"
              alt="Sign Up Background Element 2"
              width={450}
              height={450}
              className={cn(
                "absolute bottom-[15%] right-[5%]",
                "w-[60%] h-auto",
                "opacity-55",
                "pointer-events-none object-contain",
                "transform scale-95 rotate-[5deg]"
              )}
              priority
            />
          </>
        )}
      </motion.div>

      {/* Foreground text */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
        className={cn(
          "relative z-10 text-center px-8",
          currentPath == "/sign-in" ? " -translate-y-10" : " -translate-y-24"
        )}
      >
        <h1 className="radial-gradient text-6xl lg:text-7xl font-extrabold leading-tight">
          {currentPath == "/sign-in" ? (
            <span>
              Content de <br /> te revoir
            </span>
          ) : (
            <span>
              Explorez les cours
              <br />
              en ligne les plus
              <br />
              performants
            </span>
          )}
        </h1>
      </motion.div>
    </div>
  );
}
