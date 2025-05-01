"use client";

import { useEffect, useState } from "react";
import AppSidebar from "./Sidebar";

export function MobileSidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for sidebar toggle event from Navbar
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
    };

    // Add event listener
    window.addEventListener(
      "toggleSidebar" as any,
      handleSidebarToggle as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "toggleSidebar" as any,
        handleSidebarToggle as EventListener
      );
    };
  }, []);

  // Close sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsOpen(false);
    // Dispatch event to sync with navbar
    window.dispatchEvent(new CustomEvent("sidebarClosed"));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <div
        className={`
          fixed md:hidden z-50
          h-[calc(100vh-4rem)] top-16 left-0

          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AppSidebar ismobile className="h-full bg-white dark:bg-background" />
      </div>
    </>
  );
}
