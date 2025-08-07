"use client";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { usePermissions } from "@/utils/permissions";
import { safeLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import Image from "next/image";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  href?: string;
  children?: SidebarItem[];
  permission?: string;
  resource?: string; // For checking if user has any permission for this resource
}
interface SidebarGroup {
  section: string;
  items: SidebarItem[];
}

export default function DashboardSidebar({
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { hasPermission, canManage } = usePermissions();

  // Ensure component only renders on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const permission = safeLocalStorage.getItem("permissions");
    if (!permission) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!isClient) return;

    const parentWithActiveChild = sidebarItems
      .flatMap((group) => group.items)
      .find((item) =>
        item.children?.some((child) => child.id === activeSection)
      );

    if (parentWithActiveChild) {
      setOpenDropdown(parentWithActiveChild.id);
    }
  }, [activeSection, isClient]);

  // Helper function to check if user has any permission for a resource
  const hasAnyPermissionForResource = (resource: string): boolean => {
    if (!isClient) return false;
    return canManage(resource);
  };

  const sidebarItems: SidebarGroup[] = useMemo(() => {
    if (!isClient) {
      // Return a minimal structure during SSR to prevent hydration mismatch
      return [
        {
          section: "Overview",
          items: [
            { id: "overview", icon: "📊", label: "Dashboard Overview" },
            { id: "data-collection", icon: "📥", label: "Data Collection" },
          ],
        },
        {
          section: "Emissions",
          items: [
            {
              id: "scope1",
              icon: "🏭",
              label: "Scope 1 Emissions",
              children: [
                {
                  id: "stationary-combustion",
                  icon: "🔥",
                  label: "Stationary Combustion",
                },
                {
                  id: "mobile-combustion",
                  icon: "🚗",
                  label: "Mobile Combustion",
                },
              ],
            },
            {
              id: "scope2",
              icon: "⚡",
              label: "Scope 2 Emissions",
              children: [
                { id: "scope2-electricity", icon: "🔌", label: "Electricity" },
                { id: "scope2-steam", icon: "💨", label: "Steam" },
                { id: "scope2-heating", icon: "🔥", label: "Heating" },
                { id: "scope2-cooling", icon: "❄️", label: "Cooling" },
              ],
            },
          ],
        },
      ];
    }

    return [
      {
        section: "Overview",
        items: [
          { id: "overview", icon: "📊", label: "Dashboard Overview" },
          // { id: 'data-collection', icon: '📥', label: 'Data Collection' }
        ],
      },
      {
        section: "Emissions",
        items: [
          {
            id: "scope1",
            icon: "🏭",
            label: "Scope 1 Emissions",
            children: [
              {
                id: "stationary-combustion",
                icon: "🔥",
                label: "Stationary Combustion",
              },
              {
                id: "mobile-combustion",
                icon: "🚗",
                label: "Mobile Combustion",
              },
            ],
          },
          {
            id: "scope2",
            icon: "⚡",
            label: "Scope 2 Emissions",
            children: [
              { id: "scope2-electricity", icon: "🔌", label: "Electricity" },
              { id: "scope2-steam", icon: "💨", label: "Steam" },
              { id: "scope2-heating", icon: "🔥", label: "Heating" },
              { id: "scope2-cooling", icon: "❄️", label: "Cooling" },
            ],
          },
        ],
      },
      {
        section: "DECARBONIZATION",
        items: [
          { id: "customTargets", icon: "🎯", label: "Custom Targets" },
          { id: "granularTargets", icon: "🎯", label: "Granular Targets" },
          { id: "esg-kpis", icon: "🏆", label: "Initiative Management" },
        ],
      },
      {
        section: "Reporting",
        items: [
          // { id: 'sustainability-reporting', icon: '📋', label: 'Sustainability Reporting' },
          // { id: 'analytics', icon: '📊', label: 'Analytics & Insights' },
          { id: "reporting", icon: "📊", label: "Materiality Engine" },
          { id: "ReportGeneration", icon: "📝", label: "Report Generation"},
          // { id: "NewReport", icon: "📝", label: "New Report Generation"},
        ],
      },
      {
        section: "Support",
        items: [
          // { id: 'chatbot', icon: '💬', label: 'Sustainability Advisory' },
          {
            id: "feedback",
            icon: "📝",
            label: "Feedback",
            permission: "feedback.view",
          },
        ],
      },
      {
        section: "Add",
        items: [
          {
            id: "add-boundary",
            icon: "🏭",
            label: "Boundary",
            resource: "boundaries",
          },
          {
            id: "add-department",
            icon: "🏭",
            label: "Department",
            resource: "department",
          },
          {
            id: "add-facility",
            icon: "🏭",
            label: "Facility",
            resource: "facilities",
          },
          {
            id: "add-vehicle",
            icon: "🏭",
            label: "Vehicle",
            resource: "vehicle",
          },
          {
            id: "add-equipment",
            icon: "🏭",
            label: "Equipment",
            resource: "equipment",
          },
          { id: "add-role", icon: "🏭", label: "Role", resource: "role" },
          { id: "add-user", icon: "🏭", label: "Users", resource: "user" },
        ].filter((item) => {
          // If item has a specific permission, check that permission
          if ("permission" in item && item.permission) {
            return hasPermission(item.permission as string);
          }
          // If item has a resource, check if user has any permission for that resource
          if ("resource" in item && item.resource) {
            return hasAnyPermissionForResource(item.resource as string);
          }
          // If no permission specified, show the item
          return true;
        }),
      },
    ];
  }, [isClient, hasPermission, hasAnyPermissionForResource]);

  // Filter out empty sections
  const filteredSidebarItems = sidebarItems.filter(
    (group) => group.items.length > 0
  );

  const handleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
    onSectionChange(id);
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <aside className="w-72 bg-[#0D5942] text-white border-r border-green-100 py-6 overflow-y-auto h-screen absolute top-0">
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="px-6 py-2 h-4 bg-white opacity-20 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="px-6 py-2 h-6 bg-white opacity-20 rounded"></div>
              <div className="px-6 py-2 h-6 bg-white opacity-20 rounded"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-[#0D5942] text-white border-r border-green-100 py-6 overflow-y-auto h-screen no-scrollbar">
      <Link href='/' className='xl:w-[147px] lg:w-[127px] w-[97px] h-[16px] lg:h-[26px] flex items-center mb-5 ps-5'>
          <Image
              src={'/Logo.svg'}
              alt="khazra logo"
              height={26}
              width={147}
          />
      </Link>
      {filteredSidebarItems.map((group, i) => (
        <div key={i} className="mb-5">
          <p className="px-2 py-2 text-xs font-semibold text-white opacity-60 uppercase tracking-wider">
            {group.section}
          </p>
          {group.items.map((item) => {
            const isChildActive = item.children?.some(
              (child) => child.id === activeSection
            );
            const isActive = activeSection === item.id;

            if (item.children) {
              const isDropdownOpen = openDropdown === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleDropdown(item.id)}
                    className={`w-full flex items-center gap-2 pe-2 py-3 px-5 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#496a6065] ${
                      openDropdown === item.id || isChildActive || isActive
                        ? "bg-[#10694e] font-semibold"
                        : ""
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    <span className="ml-auto">
                      {isDropdownOpen ? <ChevronDown /> : <ChevronRight />}
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-4">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => onSectionChange(child.id)}
                          className={`w-full flex items-center gap-3 py-2 ps-5 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#496a6065] ${
                            activeSection === child.id
                              ? "bg-[#10694e] font-semibold"
                              : ""
                          }`}
                        >
                          <span className="text-base">{child.icon}</span>
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-2 py-2.5 ps-5 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#496a6065] ${
                  isActive ? "bg-[#10694e] font-semibold" : ""
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
