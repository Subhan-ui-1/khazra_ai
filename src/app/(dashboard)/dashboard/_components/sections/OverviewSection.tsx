"use client";

import { useEffect, useState } from "react";
import MetricsCard from "./overview/MetricsCard";
import ScopeCard from "./overview/ScopeCard";
import EmissionTrendsChart from "./overview/EmissionTrendsChart";
import ProgressChart from "./overview/ProgressChart";
import RecentActivitiesTable from "./overview/RecentActivitiesTable";
import MetricsModal from "./overview/MetricsModal";
import ScopeModal from "./overview/ScopeModal";
import ScopeChartData from "./overview/ScopeChartData";
import StackedBarChart from "./overview/StackedBarWithLineChart";
import HorizontalStackedChart from "./overview/HorizontalStackedChart";
import StackedBarWithLineChart from "./overview/StackedBarWithLineChart";
import Table from "@/components/Table";
import { Edit3, Trash2 } from "lucide-react";
import { getRequest } from "@/utils/api";

type ChartType = "monthly" | "quarterly" | "annual";

export default function OverviewSection() {
  const [activeChart, setActiveChart] = useState<ChartType>("monthly");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedScope, setSelectedScope] = useState(null);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [data, setData] = useState<any>({});
  const getDashboard = async () => {
    const response = await getRequest(
      "dashboard/getDashboardData/688c75d2b9785be4aeabb4ab", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODhjNzVmYmI5Nzg1YmU0YWVhYmI1MTgiLCJqdGkiOiJhYzAxNWVjMDkyNzlhM2IyYmRlZDU2ZWI5OTJkNzg3NTM1NjcyY2JiYzg4ZjM0NzExNDU3ZGRlMTFjMzBlNGRmIiwiaWF0IjoxNzU0MTQyMTgxLCJleHAiOjE3NTQ3NDY5ODEsImF1ZCI6ImFwcC1hdWRpZW5jZSIsImlzcyI6ImFwcC1iYWNrZW5kIn0.d4s14u_vC-TtJWaJkGCx43QqDqiR5kgqJdjEvVQXY4g'
    );
    console.log('dashboard', response)
    if (response.success) {
      setData(response.dashboardData);
      return;
    }
  };
  useEffect(() => {
    getDashboard()
  
    
  }, [])
  
  const activityData = [
    {
      _id: "1",
      date: "2025-08-01",
      activity: "Reduced diesel usage in forklifts",
      scope: "Scope 1",
      impact: "Low",
      status: "Completed",
      statusType: "success",
    },
    {
      _id: "2",
      date: "2025-07-24",
      activity: "Switched to LED lighting",
      scope: "Scope 2",
      impact: "Medium",
      status: "Ongoing",
      statusType: "pending",
    },
    {
      _id: "3",
      date: "2025-07-15",
      activity: "Employee awareness program",
      scope: "Scope 3",
      impact: "High",
      status: "Planned",
      statusType: "info",
    },
  ];

  const metricsData = [
    {
      id: "total-emissions",
      title: "Total Emissions",
      value: "8,947.3",
      change: "▼ 8.2%",
      changeType: "decrease",
      subtitle: "Tonnes CO₂e • All scopes",
      icon: "🏭",
      progress: 82.4,
      details: [
        {
          category: "Scope 1 (Direct)",
          sources: [
            { name: "Stationary Combustion", amount: "1,200.0 t CO₂e" },
            { name: "Mobile Combustion", amount: "1,500.5 t CO₂e" },
            { name: "Fugitive Emissions", amount: "850.0 t CO₂e" },
            { name: "Process Emissions", amount: "573.2 t CO₂e" },
          ],
        },
        {
          category: "Scope 2 (Energy Indirect)",
          sources: [
            {
              name: "Purchased Electricity – Market-based",
              amount: "1,200.3 t CO₂e",
            },
            {
              name: "Purchased Electricity – Location-based",
              amount: "928.6 t CO₂e",
            },
            { name: "Purchased Steam", amount: "359.0 t CO₂e" },
          ],
        },
        {
          category: "Scope 3 (Other Indirect)",
          sources: [
            { name: "Business Travel", amount: "530.4 t CO₂e" },
            { name: "Employee Commuting", amount: "423.8 t CO₂e" },
            { name: "Waste Disposal", amount: "392.5 t CO₂e" },
            { name: "Purchased Goods and Services", amount: "480.0 t CO₂e" },
            { name: "Transportation and Distribution", amount: "509.0 t CO₂e" },
          ],
        },
      ],
    },
    {
      id: "baseline-targets",
      title: "Base Line Targets",
      value: "64.2%",
      change: "▲ 5.1% improvement",
      changeType: "increase",
      subtitle: "Audited & Verified",
      icon: "📊",
      progress: 94.2,
      details: [
        {
          category: "Data Quality",
          sources: [
            { name: "Completeness", amount: "97%" },
            { name: "Accuracy", amount: "93%" },
            { name: "Timeliness", amount: "96%" },
            { name: "Consistency", amount: "92%" },
            { name: "Verification Standard", amount: "ISO 14064-3" },
            { name: "Verified By", amount: "GreenAudit Inc." },
            { name: "Audit Date", amount: "May 2025" },
          ],
        },
      ],
    },
    {
      id: "target-progress",
      title: "Target Progress",
      value: "82.4%",
      change: "▲ On track for 2025",
      changeType: "increase",
      subtitle: "SBTi Targets • 2 months ahead",
      icon: "🎯",
      progress: 82.4,
      details: [
        {
          category: "Target Progress",
          sources: [
            { name: "Target Year", amount: "2025" },
            { name: "Reduction Goal", amount: "90%" },
            { name: "Achieved", amount: "82.4%" },
            { name: "Remaining", amount: "7.6%" },
            { name: "Current Rate of Reduction", amount: "1.5% per month" },
            { name: "Projected by Year-End", amount: "94.1%" },
            { name: "Goal Type", amount: "Science-Based (SBTi)" },
          ],
        },
      ],
    },
    {
      id: "data-quality",
      title: "Data Quality",
      value: "94.2%",
      change: "▲ 3.1% improvement",
      changeType: "increase",
      subtitle: "Audited & Verified",
      icon: "📊",
      progress: 94.2,
      details: [
        {
          category: "Data Quality",
          sources: [
            { name: "Completeness", amount: "97%" },
            { name: "Accuracy", amount: "93%" },
            { name: "Timeliness", amount: "96%" },
            { name: "Consistency", amount: "92%" },
            { name: "Verification Standard", amount: "ISO 14064-3" },
            { name: "Verified By", amount: "GreenAudit Inc." },
            { name: "Audit Date", amount: "May 2025" },
          ],
        },
      ],
    },
  ];

  const scopeBreakdownData = [
    {
      id: "scope1",
      title: "Scope 1 Emissions",
      subtitle: "Direct emissions from owned sources",
      value: "3,247.8",
      percentage: 96.3,
      icon: "🔥",
      trend: [320, 315, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265],
      details: [
        {
          sources: [
            { name: "Stationary Combustion", amount: "1,200.0 t CO₂e" },
            { name: "Mobile Combustion", amount: "1,500.5 t CO₂e" },
            { name: "Fugitive Emissions", amount: "850.0 t CO₂e" },
            { name: "Process Emissions", amount: "573.2 t CO₂e" },
          ],
        },
      ],
    },
    {
      id: "scope2",
      title: "Scope 2 Emissions",
      subtitle: "Energy indirect emissions",
      value: "2,856.4",
      percentage: 31.9,
      icon: "⚡",
      trend: [285, 282, 280, 278, 275, 272, 270, 268, 265, 262, 260, 258],
      details: [
        {
          sources: [
            { name: "Stationary Combustion", amount: "1,200.0 t CO₂e" },
            { name: "Mobile Combustion", amount: "1,500.5 t CO₂e" },
            { name: "Fugitive Emissions", amount: "850.0 t CO₂e" },
            { name: "Process Emissions", amount: "573.2 t CO₂e" },
          ],
        },
      ],
    },
    {
      id: "scope3",
      title: "Scope 3 Emissions",
      subtitle: "Value chain emissions",
      value: "2,843.1",
      percentage: 31.8,
      icon: "📦",
      trend: [184, 181, 379, 177, 225, 250, 311, 169, 127, 195, 223, 291],
      details: [
        {
          sources: [
            { name: "Stationary Combustion", amount: "1,200.0 t CO₂e" },
            { name: "Mobile Combustion", amount: "1,500.5 t CO₂e" },
            { name: "Fugitive Emissions", amount: "850.0 t CO₂e" },
            { name: "Process Emissions", amount: "573.2 t CO₂e" },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    // Animate progress bars when component mounts
    const animateProgressBars = () => {
      const progressBars = document.querySelectorAll(".progress-fill");
      progressBars.forEach((bar) => {
        const width = (bar as HTMLElement).style.width;
        (bar as HTMLElement).style.width = "0%";
        setTimeout(() => {
          (bar as HTMLElement).style.width = width;
        }, 100);
      });
    };

    animateProgressBars();
  }, []);

  const overallProgressValue = 46;

  const handleMetricCardClick = (metric: any) => {
    setSelectedMetric(metric);
    setIsMetricsModalOpen(true);
  };

  const handleScopeCardClick = (scope: any) => {
    setSelectedScope(scope);
    setIsScopeModalOpen(true);
  };

  const closeMetricsModal = () => {
    setIsMetricsModalOpen(false);
    setSelectedMetric(null);
  };

  const closeScopeModal = () => {
    setIsScopeModalOpen(false);
    setSelectedScope(null);
  };

  function setIsStationaryModalOpen(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  function getFacilityName(
    facility: any,
    facilityId: any
  ): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  function getEquipmentTypeName(
    equipment: any,
    equipmentId: any
  ): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  function getFuelTypeName(arg0: any): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  function handleEditStationary(row: any, arg1: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-black mb-4">
          Sustainability Dashboard Overview
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
          Comprehensive view of your organization's sustainability performance
          across all environmental, social, and governance metrics with
          real-time data and actionable insights.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <MetricsCard
            key={metric.id}
            metric={metric}
            onCardClick={handleMetricCardClick}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="xl:flex gap-5 space-y-3 items-center w-full">
        {/* <EmissionTrendsChart
            activeChart={activeChart}
            setActiveChart={setActiveChart}
            emissionTrendsData={emissionTrendsData}
            scopeBreakdownData={scopeBreakdownData}
          /> */}
        <div className="xl:w-2/3 h-[600px]">
          <ScopeChartData title="📊 Emission Trends by Scope" />
        </div>
        <div className="xl:w-1/3 h-full">
          <ProgressChart overallProgressValue={overallProgressValue} />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scopeBreakdownData.map((scope) => (
          <ScopeCard
            key={scope.id}
            scope={scope}
            onCardClick={handleScopeCardClick}
          />
        ))}
      </div>
      <div className="w-full flex justify-between gap-5">
        <HorizontalStackedChart title="🔥 Emissions by Vehicle" />
        <HorizontalStackedChart title="🔥 Emissions by Equipments" />
      </div>
      <div>
        {/* Emissions by Facility Section */}
        <div className="h-[600px] flex w-full gap-10">
          <ScopeChartData title="📊 Emissions by Facility" />
          <div className="xl:w-1/3 h-full">
            <ProgressChart overallProgressValue={overallProgressValue} />
          </div>
        </div>
      </div>

      {/* <div className='flex flex-col w-full justify-between space-y-5'> */}
      {/* <ScopeChartData title="Emissions by Vehicle" /> */}
      {/* <StackedBarChart />
      </div> */}

      {/* overall Targets */}
      <div className="h-[500px]">
        <StackedBarWithLineChart title="📊overall Target" />
      </div>

      {/* Data Table */}
      {/* <RecentActivitiesTable recentActivitiesData={recentActivitiesData} /> */}
      <Table
        title="Recent Sustainability Activities"
        columns={[
          { key: "date", label: "Date" },
          { key: "activity", label: "Activity" },
          { key: "scope", label: "Scope" },
          { key: "impact", label: "Impact" },
          {
            key: "status",
            label: "Status",
            render: (value, row) => (
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-lg border ${
                  row.statusType === "success"
                    ? "bg-green-100 text-green-800 border-green-800"
                    : "bg-white text-green-800 border-green-800"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={activityData}
        // actions={[
        //   {
        //     icon: <Edit3 className="w-4 h-4" />,
        //     onClick: (row) => console.log('Edit', row),
        //     variant: 'primary'
        //   },
        //   {
        //     icon: <Trash2 className="w-4 h-4" />,
        //     onClick: (row) => console.log('Delete', row),
        //     variant: 'danger'
        //   }
        // ]}
        showAddButton={true}
        addButtonLabel="Add Sustainability Activity"
        onAddClick={() => console.log("Add new")}
        showSearch={true}
        rowKey="_id"
      />

      {/* Modals */}
      <MetricsModal
        isOpen={isMetricsModalOpen}
        onClose={closeMetricsModal}
        selectedMetric={selectedMetric}
      />

      <ScopeModal
        isOpen={isScopeModalOpen}
        onClose={closeScopeModal}
        selectedScope={selectedScope}
      />
    </div>
  );
}
