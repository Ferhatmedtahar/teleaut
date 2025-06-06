"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface MobileSidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MobileSidebarContext = createContext<
  MobileSidebarContextType | undefined
>(undefined);

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useMobileSidebar must be used within a MobileSidebarProvider"
    );
  }
  return context;
};

interface MobileSidebarProviderProps {
  children: React.ReactNode;
}

export const MobileSidebarProvider: React.FC<MobileSidebarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = {
    isOpen,
    open,
    close,
    toggle,
  };

  return (
    <MobileSidebarContext.Provider value={value}>
      {children}
    </MobileSidebarContext.Provider>
  );
};

// Mobile Sidebar Drawer Component
export const MobileSidebarDrawer: React.FC = () => {
  const { isOpen, close } = useMobileSidebar();

  return <AppSidebar ismobile isOpen={isOpen} onClose={close} />;
};

// Import your AppSidebar component here
import AppSidebar from "./Sidebar";
