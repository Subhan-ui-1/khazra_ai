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

interface HorizontalGroupedBarChartProps {
    title: string;
    emissionData?: number;
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

export default function HorizontalGroupedBarChart({ title, emissionData = 0, createdAt }: HorizontalGroupedBarChartProps) {
    const [duration, setDuration] = useState<DurationType>('Yearly');

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
                    index === 5 ?  emissionData : 0
                );
                scope2Data = Array(12).fill(0).map((_, index) => 
                    index < 6 ? 0 : 0 // 10% of main data for scope 2
                );
                break;
            case 'Quarterly':
                labels = getLastFourQuarters();
                // Distribute current year data across quarters, previous year as 0
                scope1Data = [0, 0, 0, emissionData];
                scope2Data = [0, 0, 0, 0];
                break;
            case 'Yearly':
                labels = [previousYear.toString(), currentYear.toString()];
                scope1Data = [0, emissionData]; // Previous year as 0
                scope2Data = [0, 0]; // Previous year as 0, 10% of main data
                break;
            default:
                labels = [];
                scope1Data = [];
                scope2Data = [];
        }

        return {
            labels,
            scope1: scope1Data,
            scope2: scope2Data,
        };
    };

    const { labels, scope1, scope2 } = generateChartData(duration);

    const data = {
        labels,
        datasets: [
            {
                label: 'Scope 1',
                data: scope1,
                backgroundColor: '#0a1c10',
                barThickness: 8,
                borderColor: '#ffffff',
                borderWidth: 1,
            },
            {
                label: 'Scope 2',
                data: scope2,
                backgroundColor: '#34d399',
                barThickness: 8,
                borderColor: '#ffffff',
                borderWidth: 1,
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
                max: emissionData * 1.2 || 1800,
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#000000',
                },
            },
            y: {
                stacked: false,
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#000000',
                },
            },
        },
    };

    return (
        <div className="space-y-6 border-t border-gray-200 shadow-xl p-2 h-full rounded-xl w-full">
            {/* Title */}
            <div className="w-full flex justify-between items-center">
                <p className="w-full text-xl font-bold text-black">{title}</p>
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
