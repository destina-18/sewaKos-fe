"use client";

import * as React from "react";

type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used within a SidebarProvider."
    );
  }

  return context;
}

/* =========================================================
   SIDEBAR PROVIDER
========================================================= */

function SidebarProvider({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div
        className={`flex min-h-screen w-full ${className}`}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  children,
  className = "",
}: {
  children: React.ReactNode;
  collapsible?: "offcanvas" | "icon" | "none";
  className?: string;
}) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen min-h-screen w-[143px] flex-col overflow-hidden md:flex ${className}`}
    >
      {children}
    </aside>
  );
}

/* =========================================================
   SIDEBAR HEADER
========================================================= */

function SidebarHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`shrink-0 ${className}`}>
      {children}
    </div>
  );
}

/* =========================================================
   SIDEBAR CONTENT
========================================================= */

function SidebarContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SIDEBAR FOOTER
========================================================= */

function SidebarFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-auto shrink-0 ${className}`}>
      {children}
    </div>
  );
}

/* =========================================================
   SIDEBAR MENU
========================================================= */

function SidebarMenu({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {children}
    </div>
  );
}

/* =========================================================
   SIDEBAR MENU ITEM
========================================================= */

function SidebarMenuItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

/* =========================================================
   SIDEBAR MENU BUTTON
========================================================= */

function SidebarMenuButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center text-left outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};