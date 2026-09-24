"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/* =========================================================
   MENU
========================================================= */

const menuSections = [
  {
    label: "Ringkasan",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Kelola",
    items: [
      {
        title: "Kamar",
        url: "/admin/rooms",
        icon: DoorOpen,
      },
      {
        title: "Penyewa",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Pembayaran",
        url: "/admin/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Lainnya",
    items: [
      {
        title: "Laporan",
        url: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
];

/* =========================================================
   APP SIDEBAR
========================================================= */

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar className="bg-[#172642] text-white">
      {/* ===================================================
          HEADER
      ==================================================== */}

      <SidebarHeader className="border-b border-[#263654] bg-[#172642]">
        <div className="px-[20px] pb-[18px] pt-[19px]">
          {/* Logo */}
          <div className="flex h-[31px] w-[31px] items-center justify-center rounded-[7px] bg-[#c58b2c] font-serif text-[16px] font-bold text-white">
            K
          </div>

          {/* Nama */}
          <h1 className="mt-[8px] font-serif text-[17px] font-bold leading-none text-white">
            Kosku
          </h1>

          {/* Subtitle */}
          <p className="mt-[4px] whitespace-nowrap text-[8px] font-medium text-[#9da5b2]">
            swiji kost — Admin
          </p>
        </div>
      </SidebarHeader>

      {/* ===================================================
          CONTENT
      ==================================================== */}

      <SidebarContent className="bg-[#172642]">
        <SidebarMenu className="gap-0 py-[20px]">
          {menuSections.map((section) => (
            <div key={section.label}>
              {/* Section */}
              <div
                className={`px-[20px] text-[7px] font-medium uppercase tracking-[1.7px] text-[#7e8797] ${
                  section.label === "Ringkasan"
                    ? "pb-[7px]"
                    : "pb-[7px] pt-[20px]"
                }`}
              >
                {section.label}
              </div>

              {/* Items */}
              {section.items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  pathname.startsWith(`${item.url}/`);

                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      type="button"
                      onClick={() => router.push(item.url)}
                      className={`relative h-[34px] px-[20px] text-[11px] font-normal transition-colors ${
                        isActive
                          ? "bg-[#3b3c46] text-white hover:bg-[#3b3c46]"
                          : "text-[#c5cad3] hover:bg-[#283653] hover:text-white"
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-[#d49b35]" />
                      )}

                      <Icon
                        className="mr-[10px] h-[14px] w-[14px] shrink-0"
                        strokeWidth={1.8}
                      />

                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* ===================================================
          FOOTER
      ==================================================== */}

      <SidebarFooter className="border-t border-[#263654] bg-[#172642]">
        <div className="px-[20px] py-[12px]">
          <p className="whitespace-nowrap text-[8px] text-[#6f798b]">
            © 2026 Kosku · v1.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}