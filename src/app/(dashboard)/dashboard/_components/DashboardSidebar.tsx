'use client';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePermissions } from '@/utils/permissions';

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
  const router = useRouter();
  const { hasPermission, canView, canManage } = usePermissions();
  
  const permission = localStorage.getItem('permissions')
  if(!permission){
    router.replace('/login')
    return;
  }

  // Helper function to check if user has any permission for a resource
  const hasAnyPermissionForResource = (resource: string): boolean => {
    return canManage(resource);
  };

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
        // { id: 'overallEmissionDashboard', icon: '🏭', label: 'Overall Emissions Dashboard' },
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
        // { id: 'scope3', icon: '📦', label: 'Scope 3 Emissions' }
      ]
    },
    {
      section: 'DECARBONIZATION',
      items: [
        // { id: 'performance', icon: '📈', label: 'Performance Dashboard' },
        { id: 'customTargets', icon: '🎯', label: 'Custom Targets' },
        { id: 'granularTargets', icon: '🎯', label: 'Granular Targets' },
        { id: 'esg-kpis', icon: '🏆', label: 'Initiative Management' }
      ]
    },
    {
      section: 'Reporting',
      items: [
        { id: 'sustainability-reporting', icon: '📋', label: 'Sustainability Reporting' },
        { id: 'analytics', icon: '📊', label: 'Analytics & Insights' },
        { id: 'reporting', icon: '📊', label: 'Reporting' }
      ]
    },
    {
      section: 'Support',
      items: [
        { id: 'chatbot', icon: '💬', label: 'Sustainability Advisory' },
        { id: 'feedback', icon: '📝', label: 'Feedback', permission: 'feedback.view' }
      ]
    },
    {
      section: 'Add',
      items: [
        { id: 'add-boundary', icon: '🏭', label: 'Boundary', resource: 'boundaries' },
        { id: 'add-department', icon: '🏭', label: 'Department', resource: 'department' },
        { id: 'add-facility', icon: '🏭', label: 'Facility', resource: 'facilities' },
        { id: 'add-vehicle', icon: '🏭', label: 'Vehicle', resource: 'vehicle' },
        { id: 'add-equipment', icon: '🏭', label: 'Equipment', resource: 'equipment' },
        { id: 'add-role', icon: '🏭', label: 'Role', resource: 'role' },
        { id: 'add-user', icon: '🏭', label: 'Users', resource: 'user' },
        // { id: 'equipment-type', icon: '⚙️', label: 'Equipment Type', resource: 'equipmentType' }
      ].filter(item => {
        // If item has a specific permission, check that permission
        if ('permission' in item && item.permission) {
          return hasPermission(item.permission as string);
        }
        // If item has a resource, check if user has any permission for that resource
        if ('resource' in item && item.resource) {
          return hasAnyPermissionForResource(item.resource as string);
        }
        // If no permission specified, show the item
        return true;
      })
    }
  ];

  // Filter out empty sections
  const filteredSidebarItems = sidebarItems.filter(group => group.items.length > 0);

  const handleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  return (
    <aside className="w-70 bg-[#01383c] text-white border-r border-green-100 p-6 pb-12 fixed h-screen overflow-y-auto">
      {filteredSidebarItems.map((group) => (
        <div key={group.section} className="mb-6">
          <div className="px-6 py-2 text-xs font-semibold text-white opacity-60 uppercase tracking-wider">
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
                    onClick={() => handleDropdown(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 hover:translate-x-1 ${
                      isDropdownOpen ? 'bg-green-50 text-[#013b3f] border-l-3 border-green-800 font-semibold' : ''
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
                          className={`w-full flex items-center gap-3 px-6 py-2 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 ${
                            activeSection === child.id ? 'bg- text-[#013b3f] font-semibold' : ''
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
                className={`w-full flex items-center gap-3 px-6 py-3 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#013b3f1a] hover:translate-x-1 ${
                  isActive ? 'bg-green-50 border-l-3 border-green-800 font-semibold' : ''
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