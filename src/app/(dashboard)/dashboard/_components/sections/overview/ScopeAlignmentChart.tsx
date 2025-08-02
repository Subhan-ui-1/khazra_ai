'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const labels = ['Scope 1', 'Scope 2', 'Scope 3'];

const data = {
    labels,
    datasets: [
        {
            label: 'Fully aligned',
            data: [60, 40, 70],
            backgroundColor: '#35896d',
            stack: 'Stack 0',
            barPercentage: 1.0,
            barThickness: 20,
        },
        {
            label: 'Partially aligned',
            data: [30, 35, 20],
            backgroundColor: '#3b82f6',
            stack: 'Stack 0',
            barPercentage: 1.0,
            barThickness: 20,
        },
        {
            label: 'Not aligned',
            data: [10, 25, 10],
            backgroundColor: '#d1d5db',
            stack: 'Stack 0',
            barPercentage: 1.0,
            barThickness: 20,
        },
    ],
};

const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}%`,
            },
        },
    },
    scales: {
        x: {
            stacked: true,
            max: 110,
            ticks: {
                callback: (value: number | string) => `${value}%`,
            },
            grid: {
                display: false,
            },
        },
        y: {
            stacked: true,
            grid: {
                display: false,
            },
        },
    },
};

interface ScopeAlignmentChartProps {
    title: string;
}

export default function ScopeAlignmentChart({ title }: ScopeAlignmentChartProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow border border-green-100 w-full">
            <h2 className="text-xl font-bold text-green-800 mb-4">{title}</h2>
            <Chart type="bar" data={data} options={options} className="max-h-[300px]" />
        </div>
    );
}
