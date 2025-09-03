'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { getRequest } from '@/utils/api';
import { safeLocalStorage } from '@/utils/localStorage';
import AddEmissionSection from './_components/sections/AddEmissionSection';
import GHGManage from './_components/sections/GHGManage';
import BoundarySetupSteps from './_components/sections/BoundarySetupSteps';
import Section9 from './_components/sections/OrganizationSetup/Section9';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [setupComplete, setSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const { canView, canCreate, canManage } = usePermissions();
  const router = useRouter();
  
  useEffect(()=>{
    if(section){
      setActiveSection(section)
    }
  }, [section])

  // Check if setup is complete
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        setLoading(true);
        
        // Get tokens
        const token = safeLocalStorage.getItem("tokens");
        const tokenData = JSON.parse(token || "{}");
        
        if (!tokenData.accessToken) {
          router.push('/login');
          return;
        }

        // Check dashboard data to see what's already configured
        const dashboardResponse = await getRequest(
          'dashboard/getDashboardData',
          tokenData.accessToken
        );

        if (dashboardResponse.success) {
          const dashboardData = dashboardResponse.dashboardData;
          
          // Check if boundary exists by calling the boundaries API directly
          let hasBoundary = false;
          let hasFacilities = false;
          let hasVehicles = false;
          let hasEquipment = false;
          
          try {
            const boundaryResponse = await getRequest(
              'boundaries/getBoundaries',
              tokenData.accessToken
            );
            
            if (boundaryResponse.success && boundaryResponse.data?.boundaries?.length > 0) {
              hasBoundary = true;
              const boundary = boundaryResponse.data.boundaries[0];
              hasFacilities = boundary.facilityCount > 0;
              hasVehicles = boundary.vehicleCount > 0;
              hasEquipment = boundary.equipmentCount > 0;
            }
          } catch (error) { 
            hasBoundary = false;
          }
          
          // Check if departments exist
          let hasDepartments = false;
          try {
            const departmentsResponse = await getRequest(
              'departments/getDepartments?limit=1',
              tokenData.accessToken
            );
            hasDepartments = departmentsResponse.success && departmentsResponse.data?.departments?.length > 0;
          } catch (error) {
            hasDepartments = false;
          }
          
          // Check if facilities exist (only if user said they have facilities)
          const facilitiesExist = dashboardData.totalFacilities > 0;
          const facilitiesComplete = !hasFacilities || (hasFacilities && facilitiesExist);
          
          // Check if vehicles exist (only if user said they have vehicles)
          const vehiclesExist = dashboardData.totalVehicles > 0;
          const vehiclesComplete = !hasVehicles || (hasVehicles && vehiclesExist);
          
          // Check if equipment exists (only if user said they have equipment)
          const equipmentExist = dashboardData.totalEquipment > 0;
          const equipmentComplete = !hasEquipment || (hasEquipment && equipmentExist);

          // Setup is complete if boundary, departments, and all applicable steps are done
          const isSetupComplete = hasBoundary && hasDepartments && facilitiesComplete && vehiclesComplete && equipmentComplete;
          
          if (!isSetupComplete) {
            // Redirect to steps page if setup is not complete
            
            
          }
          
          setSetupComplete(true);
        }
      } catch (error) {
        router.push('/dashboard/steps');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkSetupStatus();
  }, [router]);

  // Show loading while checking setup status
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if setup is not complete
  if (!setupComplete) {
    return null;
  }

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
    'GHGManage': <GHGManage />,
    'boundary-setup': <BoundarySetupSteps />,
    // 'section9':<Section9 />,""
    'add-emission': <AddEmissionSection />,
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
        <div className="fixed left-0 top-0 h-screen z-10">
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