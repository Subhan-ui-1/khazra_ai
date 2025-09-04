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
import { Edit3, Trash2, History, Loader, ArrowRight } from "lucide-react";
import { safeLocalStorage } from "@/utils/localStorage";
import { getRequest } from "@/utils/api";
import { useI18n } from "@/i18n/context";
import LineChart from "./overview/lineChart";
import { safeQuerySelectorAll } from "@/utils/clientUtils";
import Link from "next/link";

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
  const { t, locale } = useI18n();
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
  const [loading, setLoading] = useState(false);
  const getDashboard = async () => {
    try {
      setLoading(true);
      const response = await getRequest(
        `dashboard/getDashboardData`,
        getTokens()
      );

      if (response.success) {
        setData(response.dashboardData);
      }
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  // Transform recent activities data for display
  const transformActivitiesData = () => {
    if (!data.recentActivities) return [];

    const dateLocale = locale === "ar" ? "ar-EG" : "en-US";
    return data.recentActivities.map((activity, index) => ({
      _id: activity._id || `activity-${index}`,
      date: new Date(activity.createdAt).toLocaleDateString(dateLocale as any, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      activity: `${activity.scopeType} ${activity.scope} ${t(
        "overview.activities.emissions",
        "emissions"
      )}`,
      scope: activity.scope || "Scope 1",
      impact:
        activity.totalEmissions > 1000
          ? t("overview.activities.impact.high")
          : activity.totalEmissions > 100
          ? t("overview.activities.impact.medium")
          : t("overview.activities.impact.low"),
      status: t("overview.activities.status.completed"),
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
      label: t("overview.activities.columns.date"),
      type: "text" as const,
    },
    {
      key: "activity",
      label: t("overview.activities.columns.activity"),
      type: "text" as const,
    },
    {
      key: "scope",
      label: t("overview.activities.columns.scope"),
      type: "text" as const,
    },
    {
      key: "impact",
      label: t("overview.activities.columns.impact"),
      type: "text" as const,
    },
    {
      key: "status",
      label: t("overview.activities.columns.status"),
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
      title: t("overview.metrics.totalEmissions.title"),
      value: data.totalEmissions.toFixed(1),
      change: t("overview.metrics.totalEmissions.onTrack"),
      changeType: "decrease",
      subtitle: t("overview.metrics.totalEmissions.subtitle"),
      icon: "🏭",
      progress: 100,
      details: [
        {
          category: t("overview.scopes.scope1.title"),
          sources: [
            {
              name: t("overview.scopes.scope1.stationary"),
              amount: `${data.stationaryCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            {
              name: t("overview.scopes.scope1.mobile"),
              amount: `${data.mobileCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            // { name: "Fugitive Emissions", amount: "0.0 t CO₂e" },
            // { name: "Process Emissions", amount: "0.0 t CO₂e" },
          ],
        },
        {
          category: t("overview.scopes.scope2.title"),
          sources: [
            {
              name: t("overview.scopes.scope2.purchasedElectricity"),
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
      title: t("overview.metrics.baselineTargets.title"),
      value: `${data.dataQuality}%`,
      change: t("overview.metrics.baselineTargets.improvement").replace(
        "{value}",
        String(data.dataQuality)
      ),
      changeType: "increase",
      subtitle: t("overview.metrics.baselineTargets.subtitle"),
      icon: "📊",
      progress: data.dataQuality,
      details: [
        {
          category: t("overview.metrics.dataQuality.title"),
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
      title: t("overview.metrics.targetProgress.title"),
      value: `${data.targetProgress}%`,
      change: t("overview.metrics.targetProgress.onTrack"),
      changeType: "increase",
      subtitle: t("overview.metrics.targetProgress.subtitle"),
      icon: "🎯",
      progress: data.targetProgress,
      details: [
        {
          category: t("overview.metrics.targetProgress.title"),
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
      title: t("overview.metrics.dataQuality.title"),
      value: `${data.dataQuality}%`,
      change: t("overview.metrics.dataQuality.improvement").replace(
        "{value}",
        String(data.dataQuality)
      ),
      changeType: "increase",
      subtitle: t("overview.metrics.dataQuality.subtitle"),
      icon: "📊",
      progress: data.dataQuality,
      details: [
        {
          category: t("overview.metrics.dataQuality.title"),
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
      title: t("overview.scopes.scope1.title"),
      subtitle: t("overview.scopes.scope1.subtitle"),
      value: data.scope1Emissions.toFixed(1),
      percentage:
        data.scope1Emissions > 0
          ? Number(
              ((data.scope1Emissions / data.totalEmissions) * 100).toFixed(2)
            )
          : 0,
      icon: "🔥",
      trend: [320, 315, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265],
      details: [
        {
          sources: [
            {
              name: t("overview.scopes.scope1.stationary"),
              amount: `${data.stationaryCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            {
              name: t("overview.scopes.scope1.mobile"),
              amount: `${data.mobileCombustionEmissions.toFixed(1)} t CO₂e`,
            },
            {
              name: t("overview.scopes.scope1.fugitive"),
              amount: "0.0 t CO₂e",
            },
            { name: t("overview.scopes.scope1.process"), amount: "0.0 t CO₂e" },
          ],
        },
      ],
    },
    {
      id: "scope2",
      title: t("overview.scopes.scope2.title"),
      subtitle: t("overview.scopes.scope2.subtitle"),
      value: data.scope2Emissions.toFixed(1),
      percentage:
        data.scope2Emissions > 0
          ? Number(
              ((data.scope2Emissions / data.totalEmissions) * 100).toFixed(2)
            )
          : 0,
      icon: "⚡",
      trend: [285, 282, 280, 278, 275, 272, 270, 268, 265, 262, 260, 258],
      details: [
        {
          sources: [
            {
              name: t("overview.scopes.scope2.purchasedElectricity"),
              amount: `${data.scope2Emissions.toFixed(1)} t CO₂e`,
            },
            {
              name: t("overview.scopes.scope2.purchasedSteam"),
              amount: "0.0 t CO₂e",
            },
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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }
  if (loading || data.totalEmissions > 0) {
    return (
      <div className="space-y-10">
        <div className="border-b border-green-100 pb-6">
          <h1 className="text-3xl font-bold text-black mb-4">
            {t("overview.header.title")}
          </h1>
          <p className="text-black opacity-70 max-w-4xl leading-relaxed">
            {t("overview.header.subtitle")}
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
              title={t("overview.charts.emissionTrends")}
              scope1Emissions={data.scope1Emissions}
              scope2Emissions={data.scope2Emissions}
              createdAt={data.createdAt}
              label
            />
          </div>
          <div className="xl:w-1/3 h-[590px]">
            <ProgressChart />
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
            title={t("overview.charts.byVehicle")}
            emissionData={data.emissionByVehicle}
            createdAt={data.createdAt}
          />
          <HorizontalStackedChart
            title={t("overview.charts.byEquipments")}
            emissionData={data.emissionByEquipment}
            createdAt={data.createdAt}
          />
        </div>
        <div className="xl:flex gap-5 space-y-5 w-full">
          <div className="xl:w-1/3 h-full">
            <ProgressChart />
          </div>
          <div className="h-[580px] flex xl:w-2/3 w-full">
            <ScopeChartData
              title={t("overview.charts.byFacility")}
              scope1Emissions={data.emissionByFacility}
              // scope2Emissions={data.emissionByFacility * 0.1}
              createdAt={data.createdAt}
            />
          </div>
        </div>

        <div className="h-[500px]">
          {/* <StackedBarWithLineChart title="🥇overall Target" /> */}
          <LineChart title={t("overview.charts.complianceStatus")} />
        </div>

        <Table
          title={t("overview.activities.title")}
          columns={tableColumns}
          data={transformActivitiesData()}
          // actions={tableActions}
          showSearch={false}
          showAddButton={false}
          // addButtonLabel="Add Sustainability Activity"
          // onAddClick={() =>}
          // onSearch={(query) => }
          rowKey="_id"
          emptyMessage={t("overview.activities.empty")}
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
  } else {

    const user = safeLocalStorage.getItem("user");
    const userName = user ? JSON.parse(user).firstName : "";
    return (
      <div className="relative overflow-hidden w-full rounded-3xl border border-gray-200/50 shadow-xl ">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full  animate-pulse" />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full  animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full  animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative p-8 lg:p-16">
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#0D5942]/10 to-emerald-500/10 text-[#0D5942] mb-6 border border-[#0D5942]/20">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              {t("overview.cta.badge", "Welcome to your Sustainability Hub")}
            </div> */}
            <h1 className="text-4xl md:text-4xl font-black tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-[#0D5942] to-gray-900 bg-clip-text text-transparent">
              {userName ? `${userName}, Let's Start Your Carbon Journey` : t("overview.cta.title", "Start Your Carbon Journey")}
            </h1>
            {/* <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t(
                "overview.cta.desc",
                "Transform your organization's environmental impact with intelligent tracking, beautiful insights, and actionable sustainability reports."
              )}
            </p> */}
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#f8fffe] border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D5942]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D5942] to-emerald-600 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t("overview.cta.stationary.title")}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("overview.cta.stationary.subtitle")}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t("overview.cta.stationary.description")}
                </p>
                <Link
                  href="/dashboard?section=stationary-combustion"
                  className="inline-flex items-center justify-center w-full px-6 py-4 rounded-xl text-white bg-gradient-to-r from-[#0D5942] to-emerald-600 hover:from-[#0D5942]/90 hover:to-emerald-600/90 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group-hover:scale-105 transform"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {t("overview.cta.stationary.add")}
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#f8fffe] border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t("overview.cta.mobile.title")}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("overview.cta.mobile.subtitle")}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t("overview.cta.mobile.description")}
                </p>
                <Link
                  href="/dashboard?section=mobile-combustion"
                  className="inline-flex items-center justify-center w-full px-6 py-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-600/90 hover:to-cyan-600/90 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group-hover:scale-105 transform"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {t("overview.cta.mobile.add")}
                </Link>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard?section=customTargets" className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-6 hover:bg-white/90 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900  flex items-center gap-2">
                {t("overview.cta.customTargets.title")} <ArrowRight className="w-4 h-4" />
              </h4>
             
            </Link>

            <Link href="/dashboard?section=reporting" className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-6 hover:bg-white/90 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900  flex items-center gap-2">
                {t("overview.cta.materiality.title")} <ArrowRight className="w-4 h-4" />
              </h4>
             
            </Link>

            <Link href="/dashboard?section=add-department" className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-6 hover:bg-white/90 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
                {t("overview.cta.department.title")} <ArrowRight className="w-4 h-4" />
              </h4>
             
            </Link>

            <Link href="/dashboard?section=add-user" className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-6 hover:bg-white/90 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900  flex items-center gap-2">
                {t("overview.cta.userManagement.title")} <ArrowRight className="w-4 h-4" />
              </h4>
             
            </Link>
          </div>

          {/* Bottom CTA */}
          {/* <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#0D5942]/10 to-emerald-500/10 border border-[#0D5942]/20">
              <svg
                className="w-5 h-5 text-[#0D5942] mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-[#0D5942]">
                {t("overview.cta.help")}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}
