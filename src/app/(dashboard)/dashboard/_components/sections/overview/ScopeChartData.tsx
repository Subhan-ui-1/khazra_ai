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

interface ScopeChartDataProps {
    title: string;
    scope1Emissions?: number;
    scope2Emissions?: number;
    createdAt?: string;
}

const getLastSixMonths = (): string[] => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(date.toLocaleString('default', { month: 'short' }));
    }
    return months;
};

const getQuarter = (month: number) => Math.floor(month / 3) + 1;

const getLastFourQuarters = (): string[] => {
    const now = new Date();
    const quarters = [];
    let year = now.getFullYear();
    let quarter = getQuarter(now.getMonth());

    for (let i = 0; i < 4; i++) {
        quarters.unshift(`Q${quarter} ${year}`);
        quarter--;
        if (quarter < 1) {
            quarter = 4;
            year--;
        }
    }
    return quarters;
};

export default function StackedBarChart({ title, scope1Emissions = 0, scope2Emissions = 0, createdAt }: ScopeChartDataProps) {
    const [duration, setDuration] = useState<DurationType>('Monthly');

    // Generate chart data based on API data
    const generateChartData = (durationType: DurationType) => {
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        
        let labels: string[];
        let scope1Data: number[];
        let scope2Data: number[];

        switch (durationType) {
            case 'Monthly':
                labels = getLastSixMonths();
                // Distribute current year data across months, previous year as 0
                scope1Data = Array(12).fill(0).map((_, index) => 
                    index === 5 ? scope1Emissions  : 0
                );
                scope2Data = Array(12).fill(0).map((_, index) => 
                    index ===5 ? scope2Emissions  : 0
                );
                break;
            case 'Quarterly':
                labels = getLastFourQuarters();
                // Distribute current year data across quarters, previous year as 0
                scope1Data = [0, 0, 0, scope1Emissions];
                scope2Data = [0, 0, 0, scope2Emissions];
                break;
            case 'Yearly':
                labels = [previousYear.toString(), currentYear.toString()];
                scope1Data = [0, scope1Emissions]; // Previous year as 0
                scope2Data = [0, scope2Emissions]; // Previous year as 0
                break;
            default:
                labels = [];
                scope1Data = [];
                scope2Data = [];
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Scope 1',
                    data: scope1Data,
                    backgroundColor: '#0a1c10',
                    stack: 'scopes',
                    barThickness: durationType === 'Monthly' ? 40 : undefined,
                },
                {
                    label: 'Scope 2',
                    data: scope2Data,
                    backgroundColor: '#34d399',
                    stack: 'scopes',
                    barThickness: durationType === 'Monthly' ? 40 : undefined,
                },
            ],
        };
    };

    const scopeChartData = generateChartData(duration);

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
                ticks: {
                    color: '#000000',
                },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: Math.max(scope1Emissions, scope2Emissions) * 1.2 || 10000,
                grid: { display: false },
                ticks: {
                    color: '#000000',
                },
            },
        },
    };

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
                <Bar data={scopeChartData} options={options} className='min-w-full h-full'/>
            </div>
        </div>
    );
}
