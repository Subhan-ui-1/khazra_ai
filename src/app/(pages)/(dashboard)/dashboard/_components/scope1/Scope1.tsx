'use client';
import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import SideBar from '@/components/sideBar/SideBar'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const data = {
    labels: ['1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul', '7 Jul', '8 Jul', '9 Jul', '10 Jul', '11 Jul', '12 Jul'],
    datasets: [
        {
            label: 'Scope 1',
            data: [25, 30, 24, 30, 30, 24, 30, 25, 28, 24, 25, 24],
            backgroundColor: '#20A35D',
            barThickness: 12,
            borderRadius: 6,
        },
        {
            label: 'Scope 2',
            data: [40, 50, 40, 50, 50, 40, 50, 45, 42, 40, 39, 38],
            backgroundColor: '#FF9D00',
            barThickness: 12,
            borderRadius: 6,
        },
        {
            label: 'Scope 3',
            data: [18, 20, 18, 22, 22, 18, 22, 19, 20, 18, 18, 18],
            backgroundColor: '#0088FF',
            barThickness: 12,
            borderRadius: 6,
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            type: 'linear' as const,
            beginAtZero: true,
        },
        x: {
        grid: {
            display: false,
        },
    }
    },
};

const StatCard = ({ title, value, change, isPositive }: any) => (
    <div className="max-w-[256px] w-full flex flex-col bg-white p-4 rounded-lg border border-[var(--Outline)]">
        <div className="flex items-center gap-2 text-[var(--Disable)]" style={{fontSize: 'var(--S1-size)'}}>
            <MdTrendingUp />
            {title}
        </div>
        <div className='flex justify-between'>
            <div className="text-[var(--Heading)] font-bold text-2xl mt-2">{value}</div>
            <div className={`text-sm mt-1 flex items-center gap-1 ${isPositive ? 'text-[#0BC361]' : 'text-[#F54646]'}`}>
                {isPositive ? <MdTrendingUp /> : <MdTrendingDown />}
                {change}
            </div>
        </div>
    </div>
);

const Scope1 = () => {

    return (
        <div className='flex h-full'>   
            <main className="bg-white w-full min-h-screen">
                {/* Top Stats */}
                <div className='p-3'>
                    <p className='py-[6px] text-[24px]' style={{fontWeight: 'var(--H3-weight)'}}>Measurements</p>
                    <div className="flex gap-4 pt-3">
                        <StatCard title="Total Emissions" value="567,899" change="2.5%" isPositive />
                        <StatCard title="Emissions Avoided" value="$3,456 M" change="2.5%" isPositive />
                        <StatCard title="Emissions per Employee" value="1,136 M" change="2.5%" isPositive={false} />
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="p-3 rounded-lg">
                    <div className='border border-[var(--Outline)] rounded-2xl p-4 flex flex-col space-y-8'>
                        <div className='flex justify-between'>
                            <h2 className="text-[24px]"  style={{fontWeight: 'var(--H3-weight)'}}>My Emission Evolution</h2>
                            <div className='flex gap-6'>
                                <div className='flex items-center space-x-2'>
                                    <div className='w-[10px] h-[10px] rounded-full bg-[#20A35D]'></div>
                                    <p className='text-[var(--p2-size)]'>Scope 1</p>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <div className='w-[10px] h-[10px] rounded-full bg-[#FF9D00]'></div>
                                    <p className='text-[var(--p2-size)]'>Scope 2</p>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <div className='w-[10px] h-[10px] rounded-full bg-[#0088FF]'></div>
                                    <p className='text-[var(--p2-size)]'>Scope 3</p>
                                </div>
                            </div>
                        </div>
                        <Bar data={data} options={options} className='max-h-[308px]' />
                    </div>
                </div>

                {/* Bottom Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-[2.7fr_1.3fr] gap-6 p-3">
                    <div className="h-[200px] rounded-lg p-4 border border-[var(--Outline)]">
                        <p className='text-[24px]' style={{fontWeight: 'var(--H3-weight)'}}>Heading 2</p>
                    </div>
                    <div className="h-[200px] rounded-lg p-4 border border-[var(--Outline)]">
                        <p className='text-[24px]' style={{fontWeight: 'var(--H3-weight)'}}>Heading 3</p>
                    </div>
                </div>
            </main>
        </div>
  )
}

export default Scope1
