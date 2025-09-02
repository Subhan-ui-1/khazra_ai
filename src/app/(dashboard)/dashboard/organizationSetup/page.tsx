"use client"

import React, { useState } from 'react'
import DashboardSidebar from '../_components/DashboardSidebar'
import DashboardHeader from '../_components/DashboardHeader'
import Section1 from '../_components/sections/OrganizationSetup/Section1'
import Section2 from '../_components/sections/OrganizationSetup/Section2'
import Section3 from '../_components/sections/OrganizationSetup/Section3'
import Section4 from '../_components/sections/OrganizationSetup/Section4'
import Section5 from '../_components/sections/OrganizationSetup/Section5'
import Section6 from '../_components/sections/OrganizationSetup/Section6'
import Section9 from '../_components/sections/OrganizationSetup/Section9'
import Section10 from '../_components/sections/OrganizationSetup/Section10'

const page = () => {
    const [activeSection, setActiveSection] = useState('section1');
    const sections = {
        section1: <Section9 />,
    }
  return (
    <div className="min-h-screen bg-white relative">
    <DashboardHeader />
    <div className="flex pt-16">
      <div className="fixed left-0 top-0 h-screen z-10">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      </div>
      <main className="flex-1 ml-64 border-l border-green-100 xl:ps-10 pe-2 lg:py-6 lg:ps-8 p-4 bg-white max-md:mt-6 overflow-y-auto">
      {sections[activeSection as keyof typeof sections]}
      </main>
    </div>
  </div>
  )
}

export default page