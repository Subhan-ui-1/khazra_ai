import { useState } from 'react';
import ProfileTab from './_components/profileTab/ProfileTab';
import SecurityTab from './_components/securityTab/SecurityTab';
import TeamTab from './_components/teamTab/TeamTab';
import BillingTab from './_components/billingTab/BillingTab';


const tabs = ['Profile', 'Security', 'Team', 'Billing'];

const AccountSetting = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    return (
        <div className='flex w-full h-screen overflow-scroll no-scrollbar bg-white'>    
            <section className="px-3 w-full h-full bg-white">
                <div className='py-[18px]'>
                    <h1 className='text-[24px]' style={{fontWeight: 'var(--H3-weight)', color: 'var(--Heading)' }}>
                        Account Settings
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2 py-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-[6px] text-sm font-medium cursor-pointer ${
                            tab === activeTab ? 'bg-[var(--Heading)] text-white' : 'bg-[var(--Background)] text-[var(--Paragraph)]'
                        }`}
                        >
                        {tab}
                        </button>
                    ))}
                </div>

                {/* Conditional content */}
                <div className='max-h-full'>
                    {activeTab === 'Profile' && <ProfileTab />}
                    {activeTab === 'Security' && <SecurityTab />}
                    {activeTab === 'Team' && <TeamTab />}
                    {activeTab === 'Billing' && <BillingTab />}
                </div>
            </section>
        </div>
    )
};
export default AccountSetting
