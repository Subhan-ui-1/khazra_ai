import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';

const tabs = [
    {
        label: 'Stationary Combustion',
        data: [
            {
                id: 'CLR-01', description: 'Coal burning in furnace', area: '1,000', fuel: 'Bituminous Coal', state: 'Solid'
            },
            {
                id: 'CLR-02', description: 'Natural gas combustion in boiler', area: '500', fuel: 'Natural Gas', state: 'Gas'
            },
            {
                id: 'CLR-03', description: 'Oil combustion in heaters', area: '800', fuel: 'Distillate Fuel Oil No. 2', state: 'Liquid'
            },
            {
                id: 'CLR-04', description: 'Metal smelting', area: '15,000', fuel: 'Propane Gas', state: 'Gas'
            },
            {
                id: 'CLR-05', description: 'Biomass power generation', area: '2,000', fuel: 'Agricultural Byproducts', state: 'Solid'
            },
            {
                id: 'CLR-06', description: 'Landfill gas combustion for electricity', area: '1,240', fuel: 'Landfill Gas', state: 'Gas'
            },
            {
                id: 'CLR-07', description: 'Power generation using anthracite', area: '3,000', fuel: 'Anthracite Coal', state: 'Solid'
            },
            {
                id: 'CLR-08', description: 'Electricity generation using lignite', area: '1,000', fuel: 'Lignite Coal', state: 'Solid'
            },
            {
                id: 'CLR-09', description: 'Energy use in institutions', area: '3,000', fuel: 'Mixed (Commercial Sector)', state: 'Solid'
            },
            {
                id: 'CLR-10', description: 'House hold cooking', area: '1,000', fuel: 'Peat', state: 'Solid'
            },
            {
                id: 'CLR-11', description: 'Power sectors', area: '2,000', fuel: 'Mixed (Electric Power Sector)', state: 'Solid'
            },
            {
                id: 'CLR-12', description: 'Industrial coking for coke production', area: '1,000', fuel: 'Mixed (Industrial Coking)', state: 'Solid'
            },
            {
                id: 'CLR-13', description: 'Industry operations', area: '3,000', fuel: 'Mixed (Industrial Sector)', state: 'Solid'
            },
            {
                id: 'CLR-14', description: 'Used in power generation', area: '4,000', fuel: 'Coal Coke', state: 'Solid'
            },
        ]
    },
    {
        label: 'S.C Emission Factors',
        data: []
    },
    {
        label: 'Mobile Combustion',
        data: []
    },
    {
        label: 'M.C Emission Factors',
        data: []
    },
    ];

const subTabs = ['General Info', 'Quantities', 'CO₂ Data', 'CH₄ & N₂O'];
// const subTabs = [
// 
// 
// ]

export default function scope1() {
    const [activeTab, setActiveTab] = useState(0);
    const [activeSubTab, setActiveSubTab] = useState(0);

    const currentData = tabs[activeTab].data;

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6 bg-white">
            {/* Page Title */}
            <div className="text-[var(--Heading)] font-bold" style={{fontSize: 'var(--H3-size)'}}>
                Measurements
            </div>

            {/* Main Tabs */}
            <div className="flex flex-wrap gap-3">
                {tabs.map((tab, i) => (
                <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`text-[var(--P2-size)] font-medium px-4 py-1.5 cursor-pointer rounded transition-all duration-200 bg-[var(--Background)]
                    ${activeTab === i ? 'bg-[var(--Heading)] text-white' : 'border-[var(--Outline)] text-[var(--Heading)]'}`}
                >
                    {tab.label}
                </button>
                ))}
            </div>

            <div className='rounded-xl border border-[var(--Outline)] bg-white py-2 px-1'>
                {/* Sub Tabs */}
                <div className=" text-[var(--P2-size)] px-2 font-medium flex gap-6" style={{fontSize: 'var(--Paragraph)'}}>
                    {subTabs.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSubTab(i)}
                            className={`relative cursor-pointer px-4 py-3 ${activeSubTab === i ? 'text-[var(--Heading)]' : 'text-[var(--Paragraph)]'}`}
                        >
                            {tab} <span className="text-[var(--Disable)]">({i + 1})</span>
                            {activeSubTab === i && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--Heading)]"></div>}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto p-3">
                    <table className="min-w-full text-left text-[var(--Paragraph)]" style={{fontSize: 'var(--S1-size)'}}>
                        <thead className="bg-[var(--Outline)] text-[var(--Heading)] mb-2">
                            <tr className='rounded-lg mb-2'>
                                <th className="px-4 py-3 font-medium rounded-l-lg">ID</th>
                                <th className="px-4 py-3 font-medium">Source Description</th>
                                <th className="px-4 py-3 font-medium">Area (Sq ft)</th>
                                <th className="px-4 py-3 font-medium">Fuel Combusted</th>
                                <th className="px-4 py-3 font-medium">Fuel State</th>
                                <th className="px-4 py-3 font-medium rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#E7EEEC] hover:text-[var(--Primary)] transition-all">
                                        <td className="px-4 py-3 rounded-l-lg">{row.id}</td>
                                        <td className="px-4 py-3">{row.description}</td>
                                        <td className="px-4 py-3">{row.area}</td>
                                        <td className="px-4 py-3">{row.fuel}</td>
                                        <td className="px-4 py-3">
                                            <select className="border border-[var(--Outline)] bg-[var(--Background)] rounded px-2 py-1 text-[var(--Paragraph)] text-xs w-full outline-0">
                                                <option>{row.state}</option>
                                                <option>{row.state}</option>
                                                <option>{row.state}</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 rounded-r-lg flex justify-center">
                                            <button className="text-xl text-[var(--Heading)] cursor-pointer">⋮</button>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-[var(--Disable)]">
                                    No data available for this section.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Add New Button */}
            <div className="flex justify-end">
                <button className="bg-[#0D5942] text-white text-sm px-6 py-2 rounded-full">
                + Add New
                </button>
            </div>
        </div>
    );
    }
