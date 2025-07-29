'use client';

import React, { useState } from 'react';
import {MdOutlineDashboard, MdExpandMore, MdExpandLess} from 'react-icons/md';
import Image from 'next/image';
import { icons } from "@/components/icons/icons";
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

const sidebarItems = [
    {
        label: 'Dashboard',
        icon: MdOutlineDashboard,
        children: [{title:'Scope 1', route:"/dashboard/scope1"}, {title:'Scope 2', route: '/dashboard/scope2'}, {title:'Scope 3', route: '/dashboard/scope3'}],
    },
    {
        label: 'Measurements',
        icon: icons.measurement,
        children: [{title:'Scope 1', route:"/measurements/scope1"}, {title:'Scope 2', route: '/measurements/scope2'}, {title:'Scope 3', route: '/measurements/scope3'}],
    },
    {
        label: 'Accessories',
        icon: icons.accessories,
        children: [{title:'Scope 1', route:"/accessories/scope1"}, {title:'Scope 2', route: '/accessories/scope2'}, {title:'Scope 3', route: '/accessories/scope3'}],
    },
    {
        label: 'Tutorials',
        icon: icons.tutorial,
        children: [{title:'Scope 1', route:"/tutorials/scope1"}, {title:'Scope 2', route: '/tutorials/scope2'}, {title:'Scope 3', route: '/tutorials/scope3'}],
    },
    {
        label: 'Organization',
        icon: icons.organization,
        children: [{title:'Scope 1', route:"/organization/scope1"}, {title:'Scope 2', route: '/organization/scope2'}, {title:'Scope 3', route: '/organization/scope3'}],
    },
    {
        label: 'System Logs',
        icon: icons.system,
        children: [{title:'Scope 1', route:"/systemLogs/scope1"}, {title:'Scope 2', route: '/systemLogs/scope2'}, {title:'Scope 3', route: '/systemLogs/scope3'}],
    },
    {
        label: 'Target Settings',
        icon: icons.target,
        children: [{title:'Scope 1', route:"/targetSettings/scope1"}, {title:'Scope 2', route: '/targetSettings/scope2'}, {title:'Scope 3', route: '/targetSettings/scope3'}],
    },
    {
        label: 'Reporting',
        icon: icons.reporting,
        children: [{title:'Scope 1', route:"/reporting/scope1"}, {title:'Scope 2', route: '/reporting/scope2'}, {title:'Scope 3', route: '/reporting/scope3'}],
    },
    {
        label: 'AI Chats',
        icon: icons.ai_chats,
        children: [{title:'Scope 1', route:"/aiChats/scope1"}, {title:'Scope 2', route: '/aiChats/scope2'}, {title:'Scope 3', route: '/aiChats/scope3'}],
    },
    {
        label: 'Feedback',
        icon: icons.feedback,
        children: null,
    },
];

const SidebarItem = ({ icon, label, children }: any) => {
    const [open, setOpen] = useState(false);
    const isStringIcon = typeof icon === 'string';
    return (
        <div className="w-full">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-left text-[var(--Heading)] hover:text-[var(--Primary)] px-4 py-3 hover:bg-[#E7EEEC] transition-all rounded-xl group cursor-pointer outline-0"
                style={{ fontSize: 'var(--P2-size)', fontWeight: 'var(--P2-weight)' }}
            >
                <div className="flex items-center gap-3">
                {isStringIcon ? (
                    <span
                        dangerouslySetInnerHTML={{ __html: icon }}
                        className="inline-block w-5 h-5 group-hover:text-[var(--Primary)] text-[var(--Heading)]"
                    />
                ) : (
                    icon && React.createElement(icon, { size: 20 })
                )}
                {label}
                </div>
                {children ? open ? <MdExpandLess size={18} /> : <MdExpandMore size={18} /> : null}
            </button>

            <div className={`overflow-hidden transition-all duration-300 pl-4 ease-in-out ${open ? 'max-h-auto' : 'max-h-0'} text-[var(--Paragraph)]`}>
                {children}
            </div>
        </div>
    );
    };

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter()
    const params = usePathname();
    console.log(params)

    return (
        <>
        {/* Toggle Button for Small Screens */}
        <button
            onClick={() => setIsOpen(true)}
            className="md:hidden fixed top-4 right-3 bg-white z-30 p-1 border border-[var(--Outline)] rounded"
            aria-label="Open sidebar"
            dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 stroke-[1.5] stroke-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>`
            }}
        />

        {/* Overlay */}
        {isOpen && (
            <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden"
            ></div>
        )}

        {/* Sidebar */}
        <aside className={`
            fixed z-40 md:static top-0 left-0 h-screen flex flex-col justify-between no-scrollbar overflow-y-scroll xl:w-[280px] lg:w-[260px] md:w-[240px] w-[220px] transition-transform duration-300 ${isOpen ? 'translate-x-0 bg-white' : '-translate-x-full  bg-[var(--Background)]'} md:translate-x-0
        `}>
            {/* Close Button for Small Screens */}
            <div className="flex justify-end md:hidden absolute top-4 right-3">
                <button onClick={() => setIsOpen(false)}>
                    <IoClose size={24} />
                </button>
            </div>

            {/* Logo */}
            <div className='xl:py-6 lg:px-6 md:px-5 px-4 lg:py-5 py-4'>
                <Link href={'/'}>
                    <Image src={'/Logo.svg'} alt='logo' width={130} height={24} className='xl:w-[130px] xl:h-[24px] lg:w-[110px] lg:h-[20px] w-[80px] h-[18px]' />
                </Link>
            </div>


            {/* Menu Items */}
            <div className='flex flex-col gap-[6px] lg:px-3'>
                {sidebarItems.map(({ label, icon, children }) => (
                    <SidebarItem key={label} icon={icon} label={label}>
                    {children && (
                        <ul className="flex flex-col gap-1 relative text-[var(--Heading)] border-l border-black mt-1 ps-1 ms-1">
                            {children.map((child, i) => {
                                return(
                                    <li
                                        key={i}
                                        className="w-[85%] xl:py-3 px-2 rounded-xl py-2 ml-3 hover:bg-[#E7EEEC] hover:text-[var(--Primary)] cursor-pointer flex items-center"
                                        onClick={() => router.push(child.route)}
                                    >
                                        <hr className='w-3 absolute left-0' />
                                        {child.title}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                    </SidebarItem>
                ))}
            </div>

            {/* Bottom Profile */}
            <div className="pt-3 lg:px-3 flex flex-col gap-2 mt-auto">
                <Link href={'/profileSetting'} className="flex items-center gap-3 p-3 cursor-pointer">
                    <Image
                        src="/profile.png"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <p style={{ fontSize: 'var(--P2-size)', fontWeight: 'var(--P2-weight)', color: 'var(--Heading)' }}>Jhon Doe</p>
                        <p className="text-sm" style={{ color: 'var(--Paragraph)', fontSize: 'var(--S1-size)' }}>Admin Manager</p>
                    </div>
                </Link>
                <div className='p-3'>
                    <button className="flex items-center gap-2 text-red-500 text-sm cursor-pointer">
                    <span
                        dangerouslySetInnerHTML={{ __html: icons.logout }}
                        className="inline-block w-5 h-5 group-hover:text-[var(--Primary)] text-[var(--Heading)]"
                    /> <p>Logout</p>
                    </button>
                </div>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
