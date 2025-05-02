import * as motion from "motion/react-client";
import Image from "next/image";
export default function Background() {
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
        <Image
          src="/icons/sign-in.svg"
          alt="Sign In Background"
          fill
          className="object-contain opacity-40 pointer-events-none"
          priority
        />
      </motion.div>

      {/* Foreground text */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
        className="relative z-10 text-center px-8 -translate-y-32"
      >
        <h1 className="gray-gradient text-6xl lg:text-8xl font-extrabold leading-tight">
          Content de <br /> te revoir
        </h1>
      </motion.div>
    </div>
  );
}
