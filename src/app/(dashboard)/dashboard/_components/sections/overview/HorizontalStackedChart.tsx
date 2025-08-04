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
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const durations = ['Monthly', 'Quarterly', 'Yearly'] as const;
type DurationType = typeof durations[number];

const rawData: Record<DurationType, { labels: string[]; scope1: number[]; scope2: number[]; scope3: number[] }> = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        scope1: [100, 150, 130, 20, 50, 70, 100, 120, 180, 30, 150, 60],
        scope2: [70, 90, 85, 60, 75, 150, 162, 112, 96, 138, 56, 45],
        scope3: [50, 60, 70, 120, 20, 35, 65, 85, 180, 90, 58, 75],
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        scope1: [270, 280, 260, 150],
        scope2: [190, 170, 160, 50],
        scope3: [150, 140, 130, 250],
    },
    Yearly: {
        labels: ['2016', '2017', '2019', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        scope1: [1100, 1200, 1300, 1400, 1000, 900, 800, 1500, 1600, 200, 500],
        scope2: [900, 950, 750, 1200, 1500, 1600, 350, 960, 450, 1200, 1300],
        scope3: [700, 750, 900, 950, 750, 1200, 1500, 1600, 350, 500, 900],
    },
};

interface HorizontalGroupedBarChartProps {
    title: string;
}

export default function HorizontalGroupedBarChart({ title }: HorizontalGroupedBarChartProps) {
    const [duration, setDuration] = useState<DurationType>('Yearly');
    const { labels, scope1, scope2, scope3 } = rawData[duration];

    const data = {
        labels,
        datasets: [
            {
                label: 'Scope 1',
                data: scope1,
                backgroundColor: '#0a1c10',
                barThickness: 5,
            },
            {
                label: 'Scope 2',
                data: scope2,
                backgroundColor: '#34d399',
                barThickness: 5,
            },
            {
                label: 'Scope 3',
                data: scope3,
                backgroundColor: '#35896d',
                barThickness: 5,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, 
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                display: false
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 1800,
                grid: {
                    display: false,
                },
            },
            y: {
                stacked: false,
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="space-y-6 border-t border-gray-200 shadow-xl p-2 h-full rounded-xl w-full">
            {/* Title */}
            <div className="w-full flex justify-between items-center">
                <p className="w-full text-xl font-bold text-green-800">{title}</p>
                {/* Duration Filter Buttons */}
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

            {/* Chart */}
            <div className="bg-white p-2 rounded-xl shadow border border-green-100 h-full">
                <Chart type="bar" data={data} options={options} className='w-[80%] h-[90%]' />
            </div>
        </div>
    );
}
