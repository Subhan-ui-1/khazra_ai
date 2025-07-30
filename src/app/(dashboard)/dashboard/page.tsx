'use client';

import { useState } from 'react';
import DashboardHeader from './_components/DashboardHeader';
import DashboardSidebar from './_components/DashboardSidebar';
import OverviewSection from './_components/sections/OverviewSection';
import DataCollectionSection from './_components/sections/DataCollectionSection';
import OverallEmissionDashboard from './_components/sections/OverallEmissionDashboard';
import Scope1Section from './_components/sections/Scope1Section';
import Scope2Section from './_components/sections/Scope2Section';
import Scope3Section from './_components/sections/Scope3Section';
import TargetsSection from './_components/sections/TargetsSection';
import PerformanceSection from './_components/sections/PerformanceSection';
import ESGKPIsSection from './_components/sections/ESGKPIsSection';
import SustainabilityReportingSection from './_components/sections/SustainabilityReportingSection';
import AnalyticsSection from './_components/sections/AnalyticsSection';
import ChatbotSection from './_components/sections/ChatbotSection';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: <OverviewSection />,
    'data-collection': <DataCollectionSection />,
    overallEmissionDashboard: <OverallEmissionDashboard />,
    scope1: <Scope1Section />,
    scope2: <Scope2Section />,
    scope3: <Scope3Section />,
    targets: <TargetsSection />,
    performance: <PerformanceSection />,
    'esg-kpis': <ESGKPIsSection />,
    'sustainability-reporting': <SustainabilityReportingSection />,
    analytics: <AnalyticsSection />,
    chatbot: <ChatbotSection />
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <div className="flex pt-16">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="md:flex-1 border-l border-green-100 xl:p-10 lg:p-8 p-4 bg-white min-h-screen max-md:mt-6">
          {sections[activeSection as keyof typeof sections]}
        </main>
      </div>
    </div>
  );
} 