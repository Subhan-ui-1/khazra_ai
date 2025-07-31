'use client';

import { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const durations = ['Monthly', 'Quarterly', 'Yearly'] as const;
type DurationType = typeof durations[number];

const rawData: Record<DurationType, { labels: string[]; scope1: number[]; scope2: number[]; scope3: number[] }> = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        scope1: [2000, 1800, 1500, 1400, 2150, 2500, 1900, 3900, 4000, 2200, 3500, 2700],
        scope2: [2000, 1800, 1500, 1400, 2250, 1500, 1900, 3900, 4000, 2200, 3500, 2700],
        scope3: [2000, 1800, 1500, 1400, 2750, 3800, 1900, 3900, 4000, 2200, 3500, 2700],
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4',],
        scope1: [6000, 5120, 4800, 5000],
        scope2: [3150, 4000, 2080, 1000],
        scope3: [2750, 3220, 4200, 1500],
    },
    Yearly: {
        labels: ['2016', '2017', '2019', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025',],
        scope1: [2400, 2500, 2700, 3700, 1500, 2000, 4000, 1200, 4500, 3200, 3600],
        scope2: [2100, 2200, 2700, 3700, 1500, 2000, 4000, 1200, 4500, 3200, 3600],
        scope3: [1800, 1900, 2700, 3700, 1500, 2000, 4000, 1200, 4500, 3200, 3600],
    },
};

const medianOfThree = (a: number, b: number, c: number) => {
    return [a, b, c].sort((x, y) => x - y)[1];
};

export default function StackedBarWithLineChart() {
    const [duration, setDuration] = useState<DurationType>('Monthly');
    const { labels, scope1, scope2, scope3 } = rawData[duration];
    
    const medians = scope1.map((val, i) => medianOfThree(scope1[i], scope2[i], scope3[i]));
    // const total = scope1.map((val, i) => val + scope2[i] + scope3[i]);

    const data = {
        labels,
        datasets: [
        {
            type: 'bar' as const,
            label: 'Scope 1',
            data: scope1,
            backgroundColor: '#0a1c10',
            stack: 'scopes',
            barThickness: 40,
        },
        {
            type: 'bar' as const,
            label: 'Scope 2',
            data: scope2,
            backgroundColor: '#34d399',
            stack: 'scopes',
            barThickness:40,
        },
        {
            type: 'bar' as const,
            label: 'Scope 3',
            data: scope3,
            backgroundColor: '#35896d',
            stack: 'scopes',
            barThickness: 40,
        },
        {
            type: 'line' as const,
            label: 'Total Emissions',
            data: medians,
            borderColor: '#2f855a',
            borderWidth: 2,
            borderDash: [8, 4],
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#47ab79',
        },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top' as const,
            display: false
        },
        },
        scales: {
        x: {
            stacked: true,
            grid: {
                display: false,
            },
        },
        y: {
            stacked: true,
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
        },
    };

    return (
        <div className="space-y-6 w-full shadow-md rounded-xl p-2 flex flex-col items-center">
            {/* Switcher */}
            <div className="flex space-x-2 justify-end w-full">
                {durations.map((type) => (
                <button
                    key={type}
                    onClick={() => setDuration(type)}
                    className={`px-4 py-2 text-sm rounded ${
                    duration === type ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    {type}
                </button>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 w-[100%] min-h-[400px] flex">
                <Chart type="bar" data={data} options={options} />
            </div>
        </div>
    );
}
