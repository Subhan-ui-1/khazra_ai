'use client';

import { useState } from "react";

type ChartType = 'monthly' | 'quarterly' | 'annual';
interface EmissionTrendsChartProps {
  activeChart: ChartType;
  setActiveChart: (chart: ChartType) => void;
  emissionTrendsData: Record<ChartType, any[]>;
  scopeBreakdownData: any[];
}

export default function EmissionTrendsChart({ 
  activeChart, 
  setActiveChart, 
  emissionTrendsData, 
  scopeBreakdownData 
}: EmissionTrendsChartProps) {
  // Helper function to generate SVG points from data
  const generateChartPoints = (data: any[], key: string, max: number, height: number, width: number) => {
    const step = width / (data.length - 1);
    return data
      .map((item: { [x: string]: number; }, index: number) => {
        const x = index * step;
        const y = height - (item[key] / max) * height;
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Get current data based on active chart
  const getCurrentData = () => {
    return emissionTrendsData[activeChart as keyof typeof emissionTrendsData];
  };

  const [duration, setDuration] = useState<'Monthly' | 'Qaurterly' | 'Annual'>('Monthly');

  // Calculate max value for chart scaling
  const getMaxValue = (data: any[]) => {
    const allValues = data.flatMap(item => [item.scope1, item.scope2, item.scope3]);
    return Math.max(...allValues) * 1.1; // Add 10% padding
  };

  const currentData = getCurrentData();
  const maxValue = getMaxValue(currentData);
  const chartWidth = 360;
  const chartHeight = 160;

  return (
    <div className="lg:col-span-2 bg-white border border-green-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
        <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
          📈 Emission Trends by Scope
        </h3>
        <div className="flex gap-2">
          <div className="flex gap-1 border border-gray-200 rounded overflow-hidden">
            {(['monthly', 'quarterly', 'annual'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`px-4 py-2 text-xs font-medium ${
                  activeChart === type
                    ? 'bg-green-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-80 relative">
        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Scope 1 */}
          <polyline
            fill="none"
            stroke="#0a1c10"
            strokeWidth="3"
            points={generateChartPoints(currentData, 'scope1', maxValue, chartHeight, chartWidth)}
          />
          
          {/* Scope 2 */}
          <polyline
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            opacity="0.7"
            points={generateChartPoints(currentData, 'scope2', maxValue, chartHeight, chartWidth)}
          />
          
          {/* Scope 3 */}
          <polyline
            fill="none"
            stroke="#35896d"
            strokeWidth="2"
            opacity="0.5"
            points={generateChartPoints(currentData, 'scope3', maxValue, chartHeight, chartWidth)}
          />
          
          {/* Data points */}
          {currentData.map((item: any, index: number) => {
            const x = (index / (currentData.length - 1)) * chartWidth;
            const y1 = chartHeight - (item.scope1 / maxValue) * chartHeight;
            const y2 = chartHeight - (item.scope2 / maxValue) * chartHeight;
            const y3 = chartHeight - (item.scope3 / maxValue) * chartHeight;
            
            return (
              <g key={index}>
                <circle cx={x} cy={y1} r="3" fill="#0f5744" />
                <circle cx={x} cy={y2} r="2" fill="#0f5744" opacity="0.7" />
                <circle cx={x} cy={y3} r="2" fill="#0f5744" opacity="0.5" />
              </g>
            );
          })}
          
          {/* Labels */}
          {currentData.map((item: any, index: number) => {
            const x = (index / (currentData.length - 1)) * chartWidth;
            const label = activeChart === 'monthly' ? item.month : activeChart === 'quarterly' ? item.quarter : item.year;
            return (
              <text key={index} x={x} y={chartHeight + 15} fontSize="10" fill="#0f5744" textAnchor="middle">
                {label}
              </text>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-5 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
          <span className="text-sm text-green-800">Scope 1 ({scopeBreakdownData[0].value} tCO₂e)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-800 rounded-sm opacity-70"></div>
          <span className="text-sm text-green-800">Scope 2 ({scopeBreakdownData[1].value} tCO₂e)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-800 rounded-sm opacity-50"></div>
          <span className="text-sm text-green-800">Scope 3 ({scopeBreakdownData[2].value} tCO₂e)</span>
        </div>
      </div>
    </div>
  );
} 