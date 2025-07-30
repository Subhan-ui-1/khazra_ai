'use client';

import { useEffect, useState } from 'react';
import DashboardHeader from './_components/DashboardHeader';
import DashboardSidebar from './_components/DashboardSidebar';
import OverviewSection from './_components/sections/OverviewSection';
import DataCollectionSection from './_components/sections/DataCollectionSection';
import OverallEmissionDashboard from './_components/sections/OverallEmissionDashboard';
import Scope1Section from './_components/sections/Scope1Section';
import StationaryCombustionSection from './_components/sections/StationaryCombustionSection';
import MobileCombustionSection from './_components/sections/MobileCombustionSection';
import Scope2Section from './_components/sections/Scope2Section';
import Scope3Section from './_components/sections/Scope3Section';
import TargetsSection from './_components/sections/TargetsSection';
import PerformanceSection from './_components/sections/PerformanceSection';
import ESGKPIsSection from './_components/sections/ESGKPIsSection';
import SustainabilityReportingSection from './_components/sections/SustainabilityReportingSection';
import AnalyticsSection from './_components/sections/AnalyticsSection';
import ChatbotSection from './_components/sections/ChatbotSection';
import AddFacilitySection from './_components/sections/AddFacilitySection';
import AddBoundarySection from './_components/sections/AddBoundarySection';
import { useSearchParams } from 'next/navigation';
import AddVehicleSection from './_components/sections/AddVehicleSection';
import AddEquipmentSection from './_components/sections/AddEquipmentSection';
import FlexibleTargetPlatform from './_components/sections/khazra-target-setting (2)';
import Scope2DataEntry from './_components/sections/scope2-data-entry';
import AssetLevelTargetPlatform from './_components/sections/Asset level targets';
import Scope2ElectricityEntry from './_components/sections/Scope2ElectricityEntry';
import Scope2SteamEntry from './_components/sections/Scope2SteamEntry';
import Scope2HeatingEntry from './_components/sections/Scope2HeatingEntry';
import Scope2CoolingEntry from './_components/sections/Scope2CoolingEntry';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  useEffect(()=>{
    if(section){
      setActiveSection(section)
    }
  }, [section])

  const sections = {
    overview: <OverviewSection />,
    'data-collection': <Scope2DataEntry />,
    overallEmissionDashboard: <OverallEmissionDashboard />,
    scope1: <Scope1Section />,
    'stationary-combustion': <StationaryCombustionSection />,
    'mobile-combustion': <MobileCombustionSection />,
    scope2: <Scope2Section />,
    'scope2-electricity': <Scope2ElectricityEntry />,
    'scope2-steam': <Scope2SteamEntry />,
    'scope2-heating': <Scope2HeatingEntry />,
    'scope2-cooling': <Scope2CoolingEntry />,
    scope3: <Scope3Section />,
    targets: <TargetsSection />,
    performance: <PerformanceSection />,
    'esg-kpis': <ESGKPIsSection />,
    'sustainability-reporting': <SustainabilityReportingSection />,
    analytics: <AnalyticsSection />,
    chatbot: <ChatbotSection />,
    'add-facility': <AddFacilitySection />,
    'add-boundary': <AddBoundarySection />,
    'add-vehicle': <AddVehicleSection />,
    'add-equipment': <AddEquipmentSection />
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <div className="flex pt-16">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 ml-70 p-10 bg-white ">
          {sections[activeSection as keyof typeof sections]}
        </main>
      </div>
    </div>
  );
} 