"use client";
import CognaciaLogo from "@/components/home/Logo";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Background() {
  const currentPath = usePathname();
  return (
    <div className="hidden w-full lg:flex lg:w-1/2 lg:rounded-br-[6rem] items-center justify-center bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] dark:bg-gradient-to-tr dark:from-[#0B111E] dark:via-[#14212E] dark:to-[#1F2F3F] text-gray-300 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <Link href="/">
          <CognaciaLogo
            className="absolute top-10 left-10  font-bold"
            textColor="text-white"
          />
        </Link>
        {/* <h1 className="absolute top-10 left-10 text-2xl font-bold">LOGO</h1> */}
        {currentPath == "/sign-in" ? (
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "relative w-full h-auto",
              "opacity-65",
              "pointer-events-none",
              "lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-[57%] xl:-translate-y-[55%] 2xl:-translate-y-[55%] "
            )}
          >
            <Image
              src="/icons/sign-in.svg"
              alt="Sign In Background"
              // fill
              width={1500}
              height={1200}
              className="h-full   object-contain opacity-40 pointer-events-none"
              priority
            />
          </motion.div>
        ) : (
          <>
            <Image
              src="/icons/sign-up1.svg"
              alt="Sign Up Background Element 1"
              width={500}
              height={500}
              className={cn(
                "absolute lg:top-[12%] lg:left-[10%] xl:top-[10%] xl:left-[15%] 2xl:top-[2%] 2xl:left-[10%]",
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
                "absolute lg:bottom-[30%] lg:right-[5%] xl:bottom-[22%] xl:right-[3%] 2xl:bottom-[7%] 2xl:right-[5%]",
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
        <h1 className="radial-gradient lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold leading-tight">
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
