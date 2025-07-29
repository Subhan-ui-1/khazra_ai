'use client';
import { useState } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { TbWorldSearch } from 'react-icons/tb';

type ChartData = {
    name: string;
    value: number;
};

type InsightCardProps = {
    title: string;
    description: string;
    barData: ChartData[];
    donutData: ChartData[];
    current: number;
    previous: number;
    timeAgo: string;
    cardBgColor: string;
    cardTextColor: string;
    btnBorder: string;
    btnHoverColor: string;
    btnHoverBgColor: string;
};

const COLORS = ['#0D5942', '#081813', '#5CD6AD', '#aeeeb0', '#A0E9C2'];

export default function InsightCard({
    title,
    description,
    barData,
    donutData,
    cardBgColor,
    cardTextColor,
    btnBorder,
    current,
    previous,
    timeAgo,
    btnHoverColor,
    btnHoverBgColor,
}: InsightCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            className="py-5 flex flex-col space-y-8 w-[330px] lg:w-[360px] max-h-[560px] items-center justify-between"
            style={{ backgroundColor: cardBgColor, color: cardTextColor }}>
            {/* Chart Container */}
            <div className="relative max-w-[296px] w-full flex h-44">
                {/* Bar Chart Box */}
                <div className="flex flex-col items-start justify-between absolute z-10 rounded-lg p-2 shadow-xl w-[60%] h-[90%]" style={{ backgroundColor: 'var(--Placeholder)' }}>
                    <div className="w-full h-full">
                        <div className="text-black flex space-x-1">
                            <span className="text-4xl font-semibold">{current}</span>
                            <div className="flex flex-col text-xs mt-1 text-green-500 font-semibold">
                                <p>tC02</p>
                                <TbWorldSearch />
                            </div>
                        </div>
                        <p className="text-xs text-start text-[var(--Disable)]">
                            {previous} tCO₂, {timeAgo}
                        </p>
                    </div>

                    {/* Responsive Bar Chart */}
                    <div className="w-full h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                {barData.map((_, index) => (
                                    <Cell
                                        width={18}
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart Box */}
                <div className="ml-28 mt-5 rounded-lg p-2 w-2/3 flex bg-amber-700 items-center justify-end"
                    style={{ backgroundColor: 'var(--Placeholder)' }}>
                    <div className="w-[120px] h-[120px] sm:w-[100px] sm:h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    dataKey="value"
                                    innerRadius="75%"
                                    outerRadius="100%"
                                >
                                {donutData.map((_, index) => (
                                    <Cell key={`pie-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Text Section */}
            <div className="flex flex-col gap-y-3 max-w-[296px] w-full">
                <h3 className="xl:text-[24px] lg:text-[22px] text-[20px] font-semibold text-start">{title}</h3>
                <p className="text-start" style={{ fontSize: 'var(--P2-size)' }}>
                {description}
                </p>
            </div>

            <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                border: btnBorder,
                backgroundColor: isHovered ? btnHoverBgColor : 'transparent',
                color: isHovered ? btnHoverColor : cardTextColor,
                transition: 'all 0.3s ease',
                }}
                className="mt-2 px-4 py-2 rounded-lg cursor-pointer max-w-[296px] w-full"
            >
                Learn more
            </button>
        </div>
    );
}
