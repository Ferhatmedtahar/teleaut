// "use client";

// import { useEffect, useState } from "react";
// import AppSidebar from "./Sidebar";

// export function MobileSidebarDrawer() {
//   const [isOpen, setIsOpen] = useState(false);

//   // Listen for sidebar toggle event from Navbar
//   useEffect(() => {
//     const handleSidebarToggle = (event: CustomEvent) => {
//       setIsOpen(event.detail.isOpen);
//     };

//     // Add event listener
//     window.addEventListener(
//       "toggleSidebar" as string,
//       handleSidebarToggle as EventListener
//     );

//     // Cleanup
//     return () => {
//       window.removeEventListener(
//         "toggleSidebar" as string,
//         handleSidebarToggle as EventListener
//       );
//     };
//   }, []);

//   // Close sidebar when clicking outside
//   const handleOverlayClick = () => {
//     setIsOpen(false);
//     // Dispatch event to sync with navbar
//     window.dispatchEvent(new CustomEvent("sidebarClosed"));
//   };

//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 z-40 md:hidden"
//           onClick={handleOverlayClick}
//           aria-hidden="true"
//         />
//       )}

//       {/* Sidebar drawer */}
//       <div
//         className={`
//           fixed md:hidden z-50
//           h-[calc(100vh-4rem)] top-16 left-0

//           transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         <AppSidebar ismobile className="h-full bg-white dark:bg-background" />
//       </div>
//     </>
//   );
// }
"use client";
import { Button } from "@/components/common/buttons/Button";
import { X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { createContext, ReactNode, useContext, useState } from "react";
import AppSidebar from "./Sidebar";

// Context for managing mobile sidebar state
interface MobileSidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

const MobileSidebarContext = createContext<
  MobileSidebarContextType | undefined
>(undefined);

// Hook to use the mobile sidebar context
export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error(
      "useMobileSidebar must be used within a MobileSidebarProvider"
    );
  }
  return context;
};

// Provider component
export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <MobileSidebarContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

// Mobile sidebar drawer component
export function MobileSidebarDrawer() {
  const { isOpen, close } = useMobileSidebar();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            onClick={close}
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Sidebar */}
          <motion.div
            className="absolute inset-y-0 left-0 w-64 bg-background border-r border-border/20 dark:border-border/90"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/20">
              <span className="text-xl font-bold">LOGO</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={close}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AppSidebar ismobile={true} className="h-full border-none" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
