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
import HistoryModal from "./overview/HistoryModal";
import Table from "@/components/Table";
import { Edit3, Trash2, History } from "lucide-react";
import { safeLocalStorage } from "@/utils/localStorage";
import { getRequest } from "@/utils/api";
import LineChart from "./overview/lineChart";
import { safeQuerySelectorAll } from "@/utils/clientUtils";

type ChartType = "monthly" | "quarterly" | "annual";

const getTokens = () => {
  const token = safeLocalStorage.getItem("tokens");
  const tokenData = JSON.parse(token || "");
  return tokenData.accessToken;
};
const getOrgId = () => {
  const id = safeLocalStorage.getItem("user");
  const userData = JSON.parse(id || "");
  return userData.organization;
};

export default function OverviewSection() {
  const [activeChart, setActiveChart] = useState<ChartType>("monthly");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedScope, setSelectedScope] = useState(null);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [data, setData] = useState<{
    dataQuality: number;
    emissionByEquipment: number;
    emissionByFacility: number;
    emissionByGHGGases: number;
    emissionByVehicle: number;
    overallTargetProgress: number;
    scope1Emissions: number;
    scope2Emissions: number;
    targetProgress: number;
    totalEmissions: number;
    totalEquipment: number;
    totalFacilities: number;
    totalVehicles: number;
    recentActivities: any[];
    stationaryCombustionEmissions: number;
    mobileCombustionEmissions: number;
    createdAt?: string;
  }>({
    dataQuality: 0,
    emissionByEquipment: 0,
    emissionByFacility: 0,
    emissionByGHGGases: 0,
    emissionByVehicle: 0,
    overallTargetProgress: 0,
    scope1Emissions: 0,
    scope2Emissions: 0,
    targetProgress: 0,
    totalEmissions: 0,
    totalEquipment: 0,
    totalFacilities: 0,
    totalVehicles: 0,
    recentActivities: [],
    stationaryCombustionEmissions: 0,
    mobileCombustionEmissions: 0,
    createdAt: "",
  });

  const getDashboard = async () => {
    try {
      const response = await getRequest(
        `dashboard/getDashboardData`,
        getTokens()
      );

      if (response.success) {
        setData(response.dashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  // Transform recent activities data for display
  const transformActivitiesData = () => {
    if (!data.recentActivities) return [];

    return data.recentActivities.map((activity, index) => ({
      _id: activity._id || `activity-${index}`,
      date: new Date(activity.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      activity: `${activity.scopeType} ${activity.scope} emissions`,
      scope: activity.scope || "Scope 1",
      impact:
        activity.totalEmissions > 1000
          ? "High"
          : activity.totalEmissions > 100
          ? "Medium"
          : "Low",
      status: "Completed",
      statusType: "success",
      originalData: activity,
    }));
  };

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity.originalData);
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setSelectedActivity(null);
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: "date",
      label: "Date",
      type: "text" as const,
    },
    {
      key: "activity",
      label: "Activity",
      type: "text" as const,
    },
    {
      key: "scope",
      label: "Scope",
      type: "text" as const,
    },
    {
      key: "impact",
      label: "Impact",
      type: "text" as const,
    },
    {
      key: "status",
      label: "Status",
      type: "status" as const,
      render: (value: string, row: any) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-lg  ${
            row.statusType === "success"
              ? "bg-green-100 text-green-800 "
              : "bg-red-100 text-red-800 "
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const metricsData = [
    {
      id: "total-emissions",
      title: "Total Emissions",
      value: data.totalEmissions.toFixed(1),
      change: "▼ 8.2%",
      changeType: "decrease",
      subtitle: "Tonnes CO₂e • All scopes",
      icon: "🏭",
      progress: 82.4,
      details: [
        {
          category: "Scope 1 (Direct)",
          sources: [
            {
              name: "Stationary Combustion",
              amount: `${data.stationaryCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            {
              name: "Mobile Combustion",
              amount: `${data.mobileCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            // { name: "Fugitive Emissions", amount: "0.0 t CO₂e" },
            // { name: "Process Emissions", amount: "0.0 t CO₂e" },
          ],
        },
        {
          category: "Scope 2 (Energy Indirect)",
          sources: [
            {
              name: "Scope 2 Emissions",
              amount: `${data.scope2Emissions.toFixed(1)} t CO₂e`,
            },
            // { name: "Purchased Steam", amount: "0.0 t CO₂e" },
          ],
        },
        // {
        //   category: "Scope 3 (Other Indirect)",
        //   sources: [
        //     { name: "Business Travel", amount: "0.0 t CO₂e" },
        //     { name: "Employee Commuting", amount: "0.0 t CO₂e" },
        //     { name: "Waste Disposal", amount: "0.0 t CO₂e" },
        //   ],
        // },
      ],
    },
    {
      id: "baseline-targets",
      title: "Base Line Targets",
      value: `${data.dataQuality}%`,
      change: "▲ 5.1% improvement",
      changeType: "increase",
      subtitle: "Audited & Verified",
      icon: "📊",
      progress: data.dataQuality,
      details: [
        {
          category: "Data Quality",
          sources: [
            { name: "Completeness", amount: `${data.dataQuality}%` },
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
      value: `${data.targetProgress}%`,
      change: "▲ On track for 2025",
      changeType: "increase",
      subtitle: "SBTi Targets • 2 months ahead",
      icon: "🎯",
      progress: data.targetProgress,
      details: [
        {
          category: "Target Progress",
          sources: [
            { name: "Target Year", amount: "2025" },
            { name: "Reduction Goal", amount: "90%" },
            { name: "Achieved", amount: `${data.targetProgress}%` },
            { name: "Remaining", amount: `${90 - data.targetProgress}%` },
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
      value: `${data.dataQuality}%`,
      change: "▲ 3.1% improvement",
      changeType: "increase",
      subtitle: "Audited & Verified",
      icon: "📊",
      progress: data.dataQuality,
      details: [
        {
          category: "Data Quality",
          sources: [
            { name: "Completeness", amount: `${data.dataQuality}%` },
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
      value: data.scope1Emissions.toFixed(1),
      percentage:
        data.scope1Emissions > 0
          ? (data.scope1Emissions / data.totalEmissions) * 100
          : 0,
      icon: "🔥",
      trend: [320, 315, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265],
      details: [
        {
          sources: [
            {
              name: "Stationary Combustion",
              amount: `${data.stationaryCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            {
              name: "Mobile Combustion",
              amount: `${data.mobileCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            { name: "Fugitive Emissions", amount: "0.0 t CO₂e" },
            { name: "Process Emissions", amount: "0.0 t CO₂e" },
          ],
        },
      ],
    },
    {
      id: "scope2",
      title: "Scope 2 Emissions",
      subtitle: "Energy indirect emissions",
      value: data.scope2Emissions.toFixed(1),
      percentage:
        data.scope2Emissions > 0
          ? (data.scope2Emissions / data.totalEmissions) * 100
          : 0,
      icon: "⚡",
      trend: [285, 282, 280, 278, 275, 272, 270, 268, 265, 262, 260, 258],
      details: [
        {
          sources: [
            {
              name: "Purchased Electricity",
              amount: `${data.scope2Emissions.toFixed(1)} t CO₂e`,
            },
            { name: "Purchased Steam", amount: "0.0 t CO₂e" },
          ],
        },
      ],
    },
    // {
    //   id: "scope3",
    //   title: "Scope 3 Emissions",
    //   subtitle: "Value chain emissions",
    //   value: "0.0",
    //   percentage: 0,
    //   icon: "📦",
    //   trend: [184, 181, 379, 177, 225, 250, 311, 169, 127, 195, 223, 291],
    //   details: [
    //     {
    //       sources: [
    //         { name: "Business Travel", amount: "0.0 t CO₂e" },
    //         { name: "Employee Commuting", amount: "0.0 t CO₂e" },
    //         { name: "Waste Disposal", amount: "0.0 t CO₂e" },
    //       ],
    //     },
    //   ],
    // },
  ];

  useEffect(() => {
    // Animate progress bars when component mounts
    const animateProgressBars = () => {
      const progressBars = safeQuerySelectorAll(".progress-fill");
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

  const overallProgressValue = data.overallTargetProgress;

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

  return (
    <div className="space-y-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <MetricsCard
            key={metric.id}
            metric={metric}
            onCardClick={handleMetricCardClick}
          />
        ))}
      </div>

      <div className="xl:flex gap-5 space-y-3 items-center w-full">
        <div className="xl:w-2/3 h-[580px]">
          <ScopeChartData 
            title="📊 Emission Trends by Scope" 
            scope1Emissions={data.scope1Emissions}
            scope2Emissions={data.scope2Emissions}
            createdAt={data.createdAt}
          />
        </div>
        <div className="xl:w-1/3 h-[590px]">
          <ProgressChart overallProgressValue={overallProgressValue} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scopeBreakdownData.map((scope) => (
          <ScopeCard
            key={scope.id}
            scope={scope}
            onCardClick={handleScopeCardClick}
          />
        ))}
      </div>
      <div className="w-full xl:flex space-y-5 justify-between gap-5">
        <HorizontalStackedChart 
          title="🔥 Emissions by Vehicle" 
          emissionData={data.emissionByVehicle}
          createdAt={data.createdAt}
        />
        <HorizontalStackedChart 
          title="🔥 Emissions by Equipments" 
          emissionData={data.emissionByEquipment}
          createdAt={data.createdAt}
        />
      </div>
      <div className="xl:flex gap-5 space-y-5 w-full">
        <div className="xl:w-1/3 h-full">
          <ProgressChart overallProgressValue={overallProgressValue} />
        </div>
        <div className="h-[580px] flex xl:w-2/3 w-full">
          <ScopeChartData 
            title="📊 Emissions by Facility" 
            scope1Emissions={data.emissionByFacility}
            scope2Emissions={data.emissionByFacility * 0.1}
            createdAt={data.createdAt}
          />
        </div>
      </div>

      <div className="h-[500px]">
        {/* <StackedBarWithLineChart title="🥇overall Target" /> */}
        <LineChart title="🥇 Compliance Status" />
      </div>

      <Table
        title="Recent Sustainability Activities"
        columns={tableColumns}
        data={transformActivitiesData()}
        // actions={tableActions}
        showSearch={false}
        showAddButton={false}
        // addButtonLabel="Add Sustainability Activity"
        // onAddClick={() => console.log("Add new activity")}
        // onSearch={(query) => console.log("Search:", query)}
        rowKey="_id"
        emptyMessage="No recent activities found"
      />

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

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={closeHistoryModal}
        history={selectedActivity?.stationary?.history || []}
        activityData={selectedActivity}
      />
    </div>
  );
}
