'use client';

import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

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

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      section: 'Management',
      items: [
        { id: 'targets', icon: '🎯', label: 'Targets' },
        { id: 'performance', icon: '📈', label: 'Performance' },
        { id: 'esg-kpis', icon: '🏆', label: 'ESG KPIs' }
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
        { id: 'chatbot', icon: '💬', label: 'Sustainability Advisory' }
      ]
    },
    {
      section: 'Add',
      items: [
        { id: 'add-facility', icon: '🏭', label: 'Facility'},
        { id: 'add-boundary', icon: '🏭', label: 'Boundary'},
        { id: 'add-vehicle', icon: '🏭', label: 'Vehicle'},
        { id: 'add-equipment', icon: '🏭', label: 'Equipment'}
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
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-[72px] right-4 z-10 p-1 bg-green-800 text-white rounded-md shadow-md"
      >
        {isOpen ? <HiX className="w-3 h-3" /> : <HiMenu className="w-3 h-3" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 h-full min-w-60 bg-white xl:p-6 lg:p-4 p-2 overflow-y-auto transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
      >
        {sidebarItems.map((group) => (
          <div key={group.section} className="mb-6">
            <div className="px-1 py-2 text-xs font-semibold text-green-800 opacity-60 uppercase tracking-wider">
              {group.section}
            </div>
            {group.items.map((item) => {
              const isActive = activeSection === item.id;
              const Component = item.href ? 'a' : 'button';

              return (
                <Component
                  key={item.id}
                  href={item.href}
                  onClick={!item.href ? () => onSectionChange(item.id) : undefined}
                  className={`w-full flex items-center text-left outline-0 gap-3 px-2 py-3 text-green-800 text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 hover:translate-x-1 ${
                    isActive
                      ? 'bg-green-50 border-l-4 border-green-800 font-semibold'
                      : ''
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
    </>
  );
}
