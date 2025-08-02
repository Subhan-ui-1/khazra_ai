'use client';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
  const parentWithActiveChild = sidebarItems
    .flatMap(group => group.items)
    .find(item => item.children?.some(child => child.id === activeSection));

  if (parentWithActiveChild) {
    setOpenDropdown(parentWithActiveChild.id);
  }
}, [activeSection]);

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
      section: 'Measurements',
      items: [
        { id: 'measurements-assessments', icon: '💬', label: 'Measurements Assessments', },
      ]
    },
    {
      section: 'Custom',
      items: [
        { id: 'custom', icon: '💬', label: 'Custom', },
      ]
    },
    {
      section: 'Granual',
      items: [
        { id: 'granual', icon: '💬', label: 'Granual', },
      ]
    }
  ];
  const handleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  return (
    <aside className="w-72 bg-[#0D5942] text-white border-r border-green-100 py-6 px-2.5 overflow-y-auto h-screen">
      {sidebarItems.map((group) => (
        <div key={group.section} className="mb-12">
          <div className="px-6 py-2 text-xs font-semibold text-white opacity-60 uppercase tracking-wider">
            {group.section}
          </div>
          {group.items.map((item) => {
            const isChildActive = item.children?.some((child) => child.id === activeSection);
            const isActive = activeSection === item.id;
            // Dropdown logic
            if (item.children) {
              const isDropdownOpen = openDropdown === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      setOpenDropdown(openDropdown === item.id ? null : item.id);
                      onSectionChange(item.id); // navigate to scope1/scope2 section page
                    }}
                    className={`w-full flex items-center gap-2 pe-2 py-3 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#0D5942] ${
                      openDropdown === item.id || isChildActive || activeSection === item.id ? ' bg-[#10694e] font-semibold' : ''
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    <span className="ml-auto">{openDropdown === item.id ? <ChevronDown /> : <ChevronRight />}</span>
                  </button>
                  {openDropdown === item.id && (
                    <div className="ml-4">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => onSectionChange(child.id)}
                          className={`w-full flex items-center gap-3 py-2 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#496a6065]  ${
                            activeSection === child.id ? 'bg-[#10694e] font-semibold' : ''
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
                className={`w-full flex items-center gap-2 py-2.5 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#496a6065] ${
                  isActive ? 'bg-[#10694e] font-semibold' : ''
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