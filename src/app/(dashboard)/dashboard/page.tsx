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
import EquipmentTypeSection from './_components/sections/EquipmentTypeSection';
import FeedbackSection from './_components/sections/FeedbackSection';
import AddDepartmentSection from './_components/sections/AddDepartmentSection';
import AddRoleSection from './_components/sections/AddRoleSection';
import AddUserSection from './_components/sections/AddUserSection';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import MaterialityAssessmentEngine from './_components/sections/materiality_assessment_demo';
import ReportGeneration from './_components/sections/ReportGeneration';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const { canView, canCreate, canManage } = usePermissions();
  
  useEffect(()=>{
    if(section){
      setActiveSection(section)
    }
  }, [section])

  const sections = {
    overview: <OverviewSection />, // decarbonization
    // 'data-collection': <DataCollectionSection />,
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
    // targets: <TargetsSection />,
    "customTargets":<FlexibleTargetPlatform />,
    "granularTargets":<AssetLevelTargetPlatform />,
    performance: <PerformanceSection />,
    'esg-kpis': <ESGKPIsSection />,
    'sustainability-reporting': <SustainabilityReportingSection />,
    analytics: <AnalyticsSection />,
    chatbot: <ChatbotSection />,
    reporting: <MaterialityAssessmentEngine />,
    'ReportGeneration': <ReportGeneration />,
    feedback: <FeedbackSection />,
    'add-facility': <PermissionGuard permission="facilities.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view facilities.</div>}>
      <AddFacilitySection />
    </PermissionGuard>,
    'add-boundary': <PermissionGuard permission="boundaries.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view boundaries.</div>}>
      <AddBoundarySection />
    </PermissionGuard>,
    'add-vehicle': <PermissionGuard permission="vehicle.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view vehicles.</div>}>
      <AddVehicleSection />
    </PermissionGuard>,
    'add-equipment': <PermissionGuard permission="equipment.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view equipment.</div>}>
      <AddEquipmentSection />
    </PermissionGuard>,
    'add-department': <PermissionGuard permission="department.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view departments.</div>}>
      <AddDepartmentSection />
    </PermissionGuard>,
    'add-role': <PermissionGuard permission="role.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view roles.</div>}>
      <AddRoleSection />
    </PermissionGuard>,
    'add-user': <PermissionGuard permission="user.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view users.</div>}>
      <AddUserSection />
    </PermissionGuard>,
    // 'equipment-type': <PermissionGuard permission="equipmentType.view" fallback={<div className="p-8 text-center text-gray-500">You don't have permission to view equipment types.</div>}>
    //   <EquipmentTypeSection />
    // </PermissionGuard>
  };

  return (
    <div className="min-h-screen bg-white relative">
      <DashboardHeader />
      <div className="flex pt-16">
        <div className="fixed left-0 top-0 h-screen z-50">
          <DashboardSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>
        <main className="flex-1 ml-64 border-l border-green-100 xl:ps-10 pe-2 lg:py-6 lg:ps-8 p-4 bg-white max-md:mt-6 overflow-y-auto">
          {sections[activeSection as keyof typeof sections]}
        </main>
      </div>
    </div>
  );
} 