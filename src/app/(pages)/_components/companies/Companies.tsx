'use client'
import Tabs from './_components/common/Tabs';
import { useState } from 'react';
import IndustriesSection from './_components/industries/Industries';
import Textile from './_components/textile/Textile';
import Chemical from './_components/chemical/Chemical';
import Tech from './_components/Tech/Tech';
import Medical from './_components/medical/Medical';
import AutoMobile from './_components/automobile/AutoMobile';

export default function Companies() {
    const [activeTab, setActiveTab] = useState('Industries');

    return (
        <section className="bg-black text-white md:py-16 sm:py-12 py-10 w-full">
            <div className="mx-auto px-4 max-w-[1400px] w-full">
                <h2 className="text-center mb-6 text-white" style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)' }}>
                    Designed for Companies Committed to Sustainability
                </h2>
                <Tabs onChange={setActiveTab} />

                <div>
                    {activeTab === 'Industries' && <IndustriesSection />}
                    {activeTab === 'Textile' && <Textile />}
                    {activeTab === 'Chemical Industries' && <Chemical />}
                    {activeTab === 'Tech Industries' && <Tech />}
                    {activeTab === 'Medical Industries' && <Medical />}
                    {activeTab === 'Automobile Industries' && <AutoMobile />}
                </div>
            </div>
        </section>
    );
}
