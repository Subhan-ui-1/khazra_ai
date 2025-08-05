'use client';

import { useState } from 'react';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const durations = ['Monthly', 'Quarterly', 'Yearly'] as const;
type DurationType = typeof durations[number];

const lineChartData: Record<DurationType, { labels: string[]; datasets: any[] }> = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
        {
            label: 'Scope 1',
            data: [1000, 1200, 100, 700, 1000, 2200],
            borderColor: '#0a1c10',
            backgroundColor: '#0a1c10',
            fill: false,
            tension: 0.1,
        },
        {
            label: 'Scope 2',
            data: [800, 600, 900, 1150, 600, 1000],
            borderColor: '#34d399',
            backgroundColor: '#34d399',
            fill: false,
            tension: 0.1
        },
        ],
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
        {
            label: 'Scope 1',
            data: [3400, 800, 6900, 5000],
            borderColor: '#0a1c10',
            backgroundColor: '#0a1c10',
            tension: 0.1,
            fill: false,
        },
        {
            label: 'Scope 2',
            data: [2200, 4600, 2300, 9400],
            borderColor: '#34d399',
            backgroundColor: '#34d399',
            tension: 0.1,
            fill: false,
        },
        ],
    },
    Yearly: {
        labels: ['2022', '2023', '2024', '2025'],
        datasets: [
        {
            label: 'Scope 1',
            data: [8000, 25500, 16000, 43000],
            borderColor: '#0a1c10',
            backgroundColor: '#0a1c10',
            tension: 0.1,
            fill: false,
        },
        {
            label: 'Scope 2',
            data: [11500, 15800, 8000, 2500],
            borderColor: '#34d399',
            backgroundColor: '#34d399',
            tension: 0.1,
            fill: false,
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
            ticks: {
                color: '#000000',
            },
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: '#000000',
            },
            grid: {
                display: false,
            },
        },
    },
};

interface LineChartProps {
    title: string;
}

export default function LineChart({ title }: LineChartProps) {
    const [duration, setDuration] = useState<DurationType>('Quarterly');

    return (
        <div className="space-y-6 w-full shadow-md rounded-xl p-2 flex flex-col items-center justify-center h-full border-t border-gray-100">
        <div className="w-full flex justify-between items-center">
            <p className="w-full text-xl font-bold text-black">{title}</p>
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

        <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 w-full flex items-end h-[85%]">
            <Line data={lineChartData[duration]} options={options} className="min-w-full h-full" />
        </div>
        </div>
    );
}
