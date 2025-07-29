'use client';

import { useState } from 'react';
import clsx from 'clsx';

const tabs = [
    'Industries',
    'Textile',
    'Chemical Industries',
    'Tech Industries',
    'Medical Industries',
    'Automobile Industries',
];

interface TabsProps {
    onChange: (activeTab: string) => void;
    defaultTab?: string;
}

export default function Tabs({ onChange, defaultTab = 'Industries' }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        onChange(tab);
    };

    return (
        <div className="max-w-[1400px] w-full">
            <div className="flex flex-wrap sm:justify-center gap-2 md:gap-4 sm:p-2">
                {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={clsx( 'sm:px-4 sm:py-2 p-2 rounded-lg transition-all duration-200 cursor-pointer',
                        activeTab === tab
                            ? 'bg-white text-black'
                            : 'bg-transparent text-white hover:bg-white hover:text-black'
                        )} style={{ fontSize: 'var(--P2-size)', fontWeight: 'var(--P2-weight)' }}
                >
                    {tab}
                </button>
                ))}
            </div>
        </div>
    );
}
