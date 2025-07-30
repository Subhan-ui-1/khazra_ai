'use client';

import { SetStateAction, useEffect, useState } from 'react';
import MetricsCard from './overview/MetricsCard';
import ScopeCard from './overview/ScopeCard';
import EmissionTrendsChart from './overview/EmissionTrendsChart';
import ProgressChart from './overview/ProgressChart';
import RecentActivitiesTable from './overview/RecentActivitiesTable';
import MetricsModal from './overview/MetricsModal';
import ScopeModal from './overview/ScopeModal';

export default function OverviewSection() {
  const [activeChart, setActiveChart] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedScope, setSelectedScope] = useState(null);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);

  // Dynamic data arrays for charts
  const emissionTrendsData = {
    monthly: [
      { month: 'Jan', scope1: 320, scope2: 285, scope3: 284 },
      { month: 'Feb', scope1: 315, scope2: 282, scope3: 281 },
      { month: 'Mar', scope1: 310, scope2: 280, scope3: 279 },
      { month: 'Apr', scope1: 305, scope2: 278, scope3: 277 },
      { month: 'May', scope1: 300, scope2: 275, scope3: 275 },
      { month: 'Jun', scope1: 295, scope2: 272, scope3: 273 },
      { month: 'Jul', scope1: 290, scope2: 270, scope3: 271 },
      { month: 'Aug', scope1: 285, scope2: 268, scope3: 269 },
      { month: 'Sep', scope1: 280, scope2: 265, scope3: 267 },
      { month: 'Oct', scope1: 275, scope2: 262, scope3: 265 },
      { month: 'Nov', scope1: 270, scope2: 260, scope3: 263 },
      { month: 'Dec', scope1: 265, scope2: 258, scope3: 261 }
    ],
    quarterly: [
      { quarter: 'Q1', scope1: 945, scope2: 847, scope3: 844 },
      { quarter: 'Q2', scope1: 895, scope2: 825, scope3: 825 },
      { quarter: 'Q3', scope1: 855, scope2: 803, scope3: 803 },
      { quarter: 'Q4', scope1: 415, scope2: 781, scope3: 781 },
      { quarter: 'Q5', scope1: 595, scope2: 781, scope3: 781 },
      { quarter: 'Q6', scope1: 615, scope2: 781, scope3: 781 },
      { quarter: 'Q7', scope1: 715, scope2: 781, scope3: 781 },
      { quarter: 'Q8', scope1: 81, scope2: 781, scope3: 781 },
    ],
    annual: [
      { year: '2020', scope1: 3800, scope2: 3200, scope3: 3200 },
      { year: '2021', scope1: 3650, scope2: 3100, scope3: 3100 },
      { year: '2022', scope1: 3500, scope2: 3000, scope3: 3000 },
      { year: '2023', scope1: 3350, scope2: 2900, scope3: 2900 },
      { year: '2000', scope1: 1200, scope2: 9000, scope3: 1200 },
      { year: '2025', scope1: 3050, scope2: 2700, scope3: 2700 }
    ]
  };

  const metricsData = [
    {
      id: 'total-emissions',
      title: 'Total Emissions',
      value: '8,947.3',
      change: '▼ 8.2%',
      changeType: 'decrease',
      subtitle: 'Tonnes CO₂e • All scopes',
      icon: '🏭',
      trend: [320, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265, 260],
      details: [
        {
          category: 'Scope 1 (Direct)',
          sources: [
            { name: 'Stationary Combustion', amount: '1,200.0 t CO₂e' },
            { name: 'Mobile Combustion', amount: '1,500.5 t CO₂e' },
            { name: 'Fugitive Emissions', amount: '850.0 t CO₂e' },
            { name: 'Process Emissions', amount: '573.2 t CO₂e' },
          ],
        },
        {
          category: 'Scope 2 (Energy Indirect)',
          sources: [
            { name: 'Purchased Electricity – Market-based', amount: '1,200.3 t CO₂e' },
            { name: 'Purchased Electricity – Location-based', amount: '928.6 t CO₂e' },
            { name: 'Purchased Steam', amount: '359.0 t CO₂e' },
          ],
        },
        {
          category: 'Scope 3 (Other Indirect)',
          sources: [
            { name: 'Business Travel', amount: '530.4 t CO₂e' },
            { name: 'Employee Commuting', amount: '423.8 t CO₂e' },
            { name: 'Waste Disposal', amount: '392.5 t CO₂e' },
            { name: 'Purchased Goods and Services', amount: '480.0 t CO₂e' },
            { name: 'Transportation and Distribution', amount: '509.0 t CO₂e' },
          ],
        },
      ],
    },
    {
      id: 'target-progress',
      title: 'Target Progress',
      value: '82.4%',
      change: '▲ On track for 2025',
      changeType: 'increase',
      subtitle: 'SBTi Targets • 2 months ahead',
      icon: '🎯',
      progress: 82.4,
      details: [
        {
          sources: [
            { name: 'Target Year', amount: '2025' },
            { name: 'Reduction Goal', amount: '90%' },
            { name: 'Achieved', amount: '82.4%' },
            { name: 'Remaining', amount: '7.6%' },
            { name: 'Current Rate of Reduction', amount: '1.5% per month' },
            { name: 'Projected by Year-End', amount: '94.1%' },
            { name: 'Goal Type', amount: 'Science-Based (SBTi)' },
          ],
        }
      ]
    },
    {
      id: 'esg-score',
      title: 'ESG Score',
      value: '91.5',
      change: '▲ 3.2% improvement',
      changeType: 'increase',
      subtitle: 'Environmental, Social & Governance',
      icon: '🏆',
      progress: 91.5,
      details: [
        {
          sources: [
            { name: 'Overall ESG Rating', amount: '91.5' },
            { name: 'Environment', amount: '92' },
            { name: 'Social', amount: '89' },
            { name: 'Governance', amount: '93' },
            { name: 'Compared to Sector Avg.', amount: '+8.4%' },
            { name: 'Assessed By', amount: 'Sustainalytics' },
            { name: 'Latest Review Date', amount: 'June 2025' },
          ]
        }
      ],
    },
    {
      id: 'data-quality',
      title: 'Data Quality',
      value: '94.2%',
      change: '▲ 3.1% improvement',
      changeType: 'increase',
      subtitle: 'Audited & Verified',
      icon: '📊',
      progress: 94.2,
      details: [
        {
          sources: [
            { name: 'Completeness', amount: '97%' },
            { name: 'Accuracy', amount: '93%' },
            { name: 'Timeliness', amount: '96%' },
            { name: 'Consistency', amount: '92%' },
            { name: 'Verification Standard', amount: 'ISO 14064-3' },
            { name: 'Verified By', amount: 'GreenAudit Inc.' },
            { name: 'Audit Date', amount: 'May 2025' },
          ]
        }
      ],
    },
  ];

  const scopeBreakdownData = [
    {
      id: 'scope1',
      title: 'Scope 1 Emissions',
      subtitle: 'Direct emissions from owned sources',
      value: '3,247.8',
      percentage: 96.3,
      icon: '🔥',
      trend: [320, 315, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265],
      details:[
        {
          sources: [
            { name: 'Stationary Combustion', amount: '1,200.0 t CO₂e' },
            { name: 'Mobile Combustion', amount: '1,500.5 t CO₂e' },
            { name: 'Fugitive Emissions', amount: '850.0 t CO₂e' },
            { name: 'Process Emissions', amount: '573.2 t CO₂e' },
          ],
        }
      ]
    },
    {
      id: 'scope2',
      title: 'Scope 2 Emissions',
      subtitle: 'Energy indirect emissions',
      value: '2,856.4',
      percentage: 31.9,
      icon: '⚡',
      trend: [285, 282, 280, 278, 275, 272, 270, 268, 265, 262, 260, 258],
      details:[
        {
          sources: [
            { name: 'Stationary Combustion', amount: '1,200.0 t CO₂e' },
            { name: 'Mobile Combustion', amount: '1,500.5 t CO₂e' },
            { name: 'Fugitive Emissions', amount: '850.0 t CO₂e' },
            { name: 'Process Emissions', amount: '573.2 t CO₂e' },
          ],
        }
      ]
    },
    {
      id: 'scope3',
      title: 'Scope 3 Emissions',
      subtitle: 'Value chain emissions',
      value: '2,843.1',
      percentage: 31.8,
      icon: '📦',
      trend: [284, 281, 279, 277, 275, 273, 271, 269, 267, 265, 263, 261],
      details:[
        {
          sources: [
            { name: 'Stationary Combustion', amount: '1,200.0 t CO₂e' },
            { name: 'Mobile Combustion', amount: '1,500.5 t CO₂e' },
            { name: 'Fugitive Emissions', amount: '850.0 t CO₂e' },
            { name: 'Process Emissions', amount: '573.2 t CO₂e' },
          ],
        }
      ]
    }
  ];

  const recentActivitiesData = [
    {
      id: 1,
      date: 'Mar 20, 2025',
      activity: 'Solar Panel Installation',
      scope: 'Scope 2',
      impact: '-145.2 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 2,
      date: 'Mar 18, 2025',
      activity: 'Fleet Electrification',
      scope: 'Scope 1',
      impact: '-67.8 tCO₂e',
      status: 'In Progress',
      statusType: 'pending'
    },
    {
      id: 3,
      date: 'Mar 15, 2025',
      activity: 'Supplier Engagement',
      scope: 'Scope 3',
      impact: '-234.5 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 4,
      date: 'Mar 12, 2025',
      activity: 'Energy Efficiency Upgrade',
      scope: 'Scope 2',
      impact: '-89.3 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 5,
      date: 'Mar 10, 2025',
      activity: 'Waste Reduction Program',
      scope: 'Scope 3',
      impact: '-45.7 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 6,
      date: 'Mar 8, 2025',
      activity: 'Building Automation',
      scope: 'Scope 2',
      impact: '-123.4 tCO₂e',
      status: 'In Progress',
      statusType: 'pending'
    }
  ];

  useEffect(() => {
    // Animate progress bars when component mounts
    const animateProgressBars = () => {
      const progressBars = document.querySelectorAll('.progress-fill');
      progressBars.forEach((bar) => {
        const width = (bar as HTMLElement).style.width;
        (bar as HTMLElement).style.width = '0%';
        setTimeout(() => {
          (bar as HTMLElement).style.width = width;
        }, 100);
      });
    };

    animateProgressBars();
  }, []);

  const overallProgressValue = 82;

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
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Sustainability Dashboard Overview
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Comprehensive view of your organization's sustainability performance across all environmental, 
          social, and governance metrics with real-time data and actionable insights.
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EmissionTrendsChart
          activeChart={activeChart}
          setActiveChart={setActiveChart}
          emissionTrendsData={emissionTrendsData}
          scopeBreakdownData={scopeBreakdownData}
        />
        <ProgressChart overallProgressValue={overallProgressValue} />
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

      {/* Data Table */}
      <RecentActivitiesTable recentActivitiesData={recentActivitiesData} />

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