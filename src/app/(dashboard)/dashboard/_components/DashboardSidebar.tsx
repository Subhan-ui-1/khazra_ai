'use client';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  href?: string;
}

interface SidebarGroup {
  section: string;
  items: SidebarItem[];
}

export default function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
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
        { id: 'scope1', icon: '🏭', label: 'Scope 1 Emissions' },
        { id: 'scope2', icon: '⚡', label: 'Scope 2 Emissions' },
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

  return (
    <aside className="w-70 bg-white border-r border-green-100 p-6 fixed h-screen overflow-y-auto">
      {sidebarItems.map((group) => (
        <div key={group.section} className="mb-6">
          <div className="px-6 py-2 text-xs font-semibold text-green-800 opacity-60 uppercase tracking-wider">
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
                className={`w-full flex items-center gap-3 px-6 py-3 text-green-800 text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-green-50 hover:translate-x-1 ${
                  isActive 
                    ? 'bg-green-50 border-l-3 border-green-800 font-semibold' 
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
  );
} 