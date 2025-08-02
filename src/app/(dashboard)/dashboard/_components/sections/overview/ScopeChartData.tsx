'use client';

import { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const durations = ['Monthly', 'Quarterly', 'Yearly'] as const;
type DurationType = typeof durations[number];

const scopeChartData: Record<DurationType, { labels: string[]; datasets: any[] }> = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Scope 1',
                data: [2000, 1800, 1500, 1400, 2150, 2500, 1900, 3900, 4000, 2200, 3500, 2700],
                backgroundColor: '#0a1c10',
                stack: 'scopes',
                barThickness: 40,
            },
            {
                label: 'Scope 2',
                data: [2000, 1800, 1500, 1400, 2250, 1500, 1900, 3900, 4000, 2200, 3500, 2700],
                backgroundColor: '#34d399',
                stack: 'scopes',
                barThickness: 40,
            },
            {
                label: 'Scope 3',
                data: [2000, 1800, 1500, 1400, 2750, 3800, 1900, 3900, 4000, 2200, 3500, 2700],
                backgroundColor: '#35896d',
                stack: 'scopes',
                barThickness: 40,
            },
        ],
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Scope 1',
                data: [6000, 5120, 4800, 5000],
                backgroundColor: '#0a1c10',
                stack: 'scopes',
            },
            {
                label: 'Scope 2',
                data: [3150, 4000, 2080, 1000],
                backgroundColor: '#34d399',
                stack: 'scopes',
            },
            {
                label: 'Scope 3',
                data: [2750, 3220, 4200, 1500],
                backgroundColor: '#35896d',
                stack: 'scopes',
            },
        ],
    },
    Yearly: {
        labels: ['2016', '2017', '2019', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
            {
                label: 'Scope 1',
                data: [2400, 2500, 2700, 3700, 1500, 2000, 4000, 1200, 4500, 3200, 3600],
                backgroundColor: '#191A19',
                stack: 'scopes',
            },
            {
                label: 'Scope 2',
                data: [2100, 2200, 2700, 3700, 1500, 2000, 4000, 1200, 4500, 3200, 3600],
                backgroundColor: '#34d399',
                stack: 'scopes',
            },
            {
                label: 'Scope 3',
                data: [1800, 1900, 2700, 3700, 1500, 2000, 4000, 1200, 4500, 3200, 3600],
                backgroundColor: '#0D5942',
                stack: 'scopes',
            },
        ],
    },
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            display: false,
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: { display: false },
        },
        y: {
            stacked: true,
            beginAtZero: true,
            max: 16000,
            grid: { display: false },
        },
    },
};

interface StackedBarChartProps {
    title: string;
}

export default function StackedBarChart({ title }: StackedBarChartProps) {
    const [duration, setDuration] = useState<DurationType>('Monthly');

    return (
        <div className="space-y-6 w-full shadow-md rounded-xl p-2 flex flex-col items-center justify-center h-full border-t border-gray-100">
            <div className='w-full flex justify-between items-center'>
                <p className='w-full text-xl font-bold text-black'>{title}</p>
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
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 w-full flex items-end h-[90%]">
                <Bar data={scopeChartData[duration]} options={options} className='min-w-full h-full'/>
            </div>
        </div>
    );
}
