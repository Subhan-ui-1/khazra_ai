'use client';

import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type DurationType = 'This Year' | 'Last Year' | 'Comparison';

type Scope3Source = {
  label: string;
  value: number;
  percentage: number;
  color: string;
  opacity: string;
  arcLabelPos: { x: number; y: number };
};

type Scope3Data = {
  [key in DurationType]: Scope3Source[];
};

const scope3DataByDuration: Scope3Data = {
  'This Year': [
    {
      label: 'Purchased Goods & Services',
      value: 1500,
      percentage: 36,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-100',
      arcLabelPos: { x: 45, y: -10 },
    },
    {
      label: 'Business Travel',
      value: 1000,
      percentage: 24,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-80',
      arcLabelPos: { x: 20, y: 40 },
    },
    {
      label: 'Employee Commuting',
      value: 700,
      percentage: 16.8,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-80',
      arcLabelPos: { x: -25, y: 30 },
    },
    {
      label: 'Waste Disposal',
      value: 500,
      percentage: 12,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-60',
      arcLabelPos: { x: -35, y: -10 },
    },
    {
      label: 'Transportation & Distribution',
      value: 300,
      percentage: 7.2,
      color: 'fill-[#1f514d]',
      opacity: 'opacity-50',
      arcLabelPos: { x: -15, y: -35 },
    },
  ],
  'Last Year': [
    {
      label: 'Purchased Goods & Services',
      value: 1600,
      percentage: 38,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-100',
      arcLabelPos: { x: 45, y: -10 },
    },
    {
      label: 'Business Travel',
      value: 900,
      percentage: 21.3,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-90',
      arcLabelPos: { x: 20, y: 40 },
    },
    {
      label: 'Employee Commuting',
      value: 800,
      percentage: 19,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-80',
      arcLabelPos: { x: -25, y: 30 },
    },
    {
      label: 'Waste Disposal',
      value: 500,
      percentage: 11.8,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-60',
      arcLabelPos: { x: -35, y: -10 },
    },
    {
      label: 'Transportation & Distribution',
      value: 400,
      percentage: 9.9,
      color: 'fill-[#286864]',
      opacity: 'opacity-50',
      arcLabelPos: { x: -15, y: -35 },
    },
  ],
  'Comparison': [
    {
      label: 'Purchased Goods & Services',
      value: 1550,
      percentage: 37,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-100',
      arcLabelPos: { x: 45, y: -10 },
    },
    {
      label: 'Business Travel',
      value: 950,
      percentage: 22.7,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-80',
      arcLabelPos: { x: 20, y: 40 },
    },
    {
      label: 'Employee Commuting',
      value: 750,
      percentage: 17.9,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-70',
      arcLabelPos: { x: -25, y: 30 },
    },
    {
      label: 'Waste Disposal',
      value: 550,
      percentage: 13.1,
      color: 'fill-[#134e4a]',
      opacity: 'opacity-60',
      arcLabelPos: { x: -35, y: -10 },
    },
    {
      label: 'Transportation & Distribution',
      value: 400,
      percentage: 9.3,
      color: 'fill-[#286864]',
      opacity: 'opacity-50',
      arcLabelPos: { x: -15, y: -35 },
    },
  ],
};

export default function Scope3Section() {
  const [duration, setDuration] = useState<DurationType>('This Year');
  const scope3Sources = scope3DataByDuration[duration];

  const pieChartData = {
    labels: scope3Sources.map((item) => item.label),
    datasets: [
      {
        label: 'Scope 3 Emissions',
        data: scope3Sources.map((item) => item.value),
        backgroundColor: scope3Sources.map((item) =>
          item.color.replace('fill-[', '').replace(']', '')
        ),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

    const pieChartOptions = {
        responsive: true,
        plugins: {
        legend: {
            position: 'right' as const,
            labels: {
                color: '#134e4a',
                font: { 
                    size: 12,
                    weight: 'bold' as const
                },
            },
        },
        },
    };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Scope 3 Emissions</h2>
        <div className="flex gap-2">
          {(['This Year', 'Last Year', 'Comparison'] as DurationType[]).map((type) => (
            <button
              key={type}
              onClick={() => setDuration(type)}
              className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors duration-200 ${
                duration === type
                  ? 'bg-green-800 text-white border-green-800'
                  : 'bg-white text-green-800 border-green-300 hover:bg-green-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
}
