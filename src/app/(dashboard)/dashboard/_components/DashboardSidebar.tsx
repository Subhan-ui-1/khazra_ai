'use client';
import { useState } from 'react';
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
}
interface SidebarGroup {
  section: string;
  items: SidebarItem[];
}
export default function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sidebarItems: SidebarGroup[] = [
    {
      section: 'Overview',
      items: [
        { id: 'overview', icon: '📊', label: 'Dashboard Overview' },
        { id: 'data-collection', icon: '📥', label: 'Data Collection' }
      ]
    },
    {
      section: 'Emissions',
      items: [
        { id: 'overallEmissionDashboard', icon: '🏭', label: 'Overall Emissions Dashboard' },
        {
          id: 'scope1',
          icon: '🏭',
          label: 'Scope 1 Emissions',
          children: [
            { id: 'stationary-combustion', icon: '🔥', label: 'Stationary Combustion' },
            { id: 'mobile-combustion', icon: '🚗', label: 'Mobile Combustion' }
          ]
        },
        {
          id: 'scope2',
          icon: '⚡',
          label: 'Scope 2 Emissions',
          children: [
            { id: 'scope2-electricity', icon: '🔌', label: 'Electricity' },
            { id: 'scope2-steam', icon: '💨', label: 'Steam' },
            { id: 'scope2-heating', icon: '🔥', label: 'Heating' },
            { id: 'scope2-cooling', icon: '❄️', label: 'Cooling' }
          ]
        },
        { id: 'scope3', icon: '📦', label: 'Scope 3 Emissions' }
      ]
    },
    {
      section: 'DECARBONIZATION',
      items: [
        { id: 'performance', icon: '📈', label: 'Performance Dashboard' },
        { id: 'customTargets', icon: '🎯', label: 'Custom Targets' },
        { id: 'granularTargets', icon: '🎯', label: 'Granular Targets' },
        { id: 'esg-kpis', icon: '🏆', label: 'Initiative Management' }
      ]
    },
    {
      section: 'Reporting',
      items: [
        { id: 'sustainability-reporting', icon: '📋', label: 'Sustainability Reporting' },
        { id: 'analytics', icon: '📊', label: 'Analytics & Insights' }
      ]
    },
    {
      section: 'Support',
      items: [
        { id: 'chatbot', icon: '💬', label: 'Sustainability Advisory' },
        { id: 'feedback', icon: '📝', label: 'Feedback' }
      ]
    },
    {
      section: 'Add',
      items: [
        { id: 'add-facility', icon: '🏭', label: 'Facility'},
        { id: 'add-boundary', icon: '🏭', label: 'Boundary'},
        { id: 'add-vehicle', icon: '🏭', label: 'Vehicle'},
        { id: 'add-equipment', icon: '🏭', label: 'Equipment'},
        { id: 'equipment-type', icon: '⚙️', label: 'Equipment Type'}
      ]
    },
    {
      section: 'Prototype',
      items: [
        { id: 'process-emissions', icon: '💬', label: 'Process Emissions', href: '/tool/process_emissions.html' },
        { id: 'fugitive-emissions', icon: '💬', label: 'Fugitive Emissions', href: '/tool/fugitive_emissions.html' },
        { id: 'refrigerant-emissions', icon: '💬', label: 'Refrigerant Emissions', href: '/tool/refrigerant_emissions.html' },
        { id: 'stationary-emissions', icon: '💬', label: 'Stationary Emissions', href: '/tool/stationary_combustion.html' },
        { id: 'mobile-emissions', icon: '💬', label: 'Mobile Emissions', href: '/tool/mobile_combustion.html' }
      ]
    }
  ];
  const handleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  return (
    <aside className="w-72 bg-white border-r border-green-100 py-6 px-2.5 overflow-y-auto h-screen">
      {sidebarItems.map((group) => (
        <div key={group.section} className="mb-6">
          <div className="px-6 py-2 text-xs font-semibold text-green-800 opacity-60 uppercase tracking-wider">
            {group.section}
          </div>
          {group.items.map((item) => {
            const isActive = activeSection === item.id;
            // Dropdown logic
            if (item.children) {
              const isDropdownOpen = openDropdown === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleDropdown(item.id)}
                    className={`w-full flex items-center gap-2 px-6 py-3 text-green-800 text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 hover:translate-x-1 ${
                      isDropdownOpen ? 'bg-green-50 border-l-3 border-green-800 font-semibold' : ''
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    <span className="ml-auto">{isDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-6 border-l border-green-100">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => onSectionChange(child.id)}
                          className={`w-full flex items-center gap-3 px-6 py-2 text-green-800 text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 ${
                            activeSection === child.id ? 'bg-green-100 font-semibold' : ''
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
            // Regular item
            const Component = item.href ? 'a' : 'button';
            return (
              <Component
                key={item.id}
                href={item.href}
                onClick={!item.href ? () => onSectionChange(item.id) : undefined}
                className={`w-full flex items-center gap-2 px-4.5 py-2.5 text-green-800 text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 hover:translate-x-1 ${
                  isActive ? 'bg-green-50 border-l-3 border-green-800 font-semibold' : ''
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Component>
            );
          })}
        </div>
      ))}
    </aside>
  );
} 