'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const navTabs = ["Product", "Solutions", "Pricing", "Partners", "Clients", "Resources"];

const Navbar = () => {
    const router = useRouter();
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleNavigate = (route: string) => {
        setIsMobileOpen(false); // close mobile nav
        setTimeout(() => {
        router.push(route);
        }, 500);
    };

    return (
        <div className="w-full shadow-xl flex justify-center items-center">
        <div className="flex justify-between items-center max-w-[1440px] w-full xl:h-[88px] h-auto px-3 lg:px-5 py-4">

            {/* Logo */}
            <Link href='/' className='xl:w-[147px] lg:w-[127px] w-[97px] h-[16px] lg:h-[26px] flex items-center'>
                <Image
                    src={'/Logo.svg'}
                    alt="khazra logo"
                    height={26}
                    width={147}
                />
            </Link>

            {/* Desktop Nav */}
            <div className='hidden md:flex'>
                <ul className="flex list-none xl:space-x-4">
                    {navTabs.map((tab, index) => (
                    <li
                        key={index}
                        className="md:p-2 lg:px-3 lg:py-2 xl:px-5 xl:py-4 lg:text-base text-sm cursor-pointer hover:text-[var(--Primary)]"
                    >
                        {tab}
                    </li>
                    ))}
                </ul>
            </div>

            {/* Buttons */}
            <div className="flex items-center xl:text-xl lg:text-lg text-sm">
                <button className="hidden md:flex cursor-pointer p-2 xl:p-3 mr-3 hover:bg-black hover:text-white transition duration-200 rounded-lg" onClick={() => handleNavigate('/login')}>Login</button>
                <button
                    className="hidden md:flex rounded-lg p-2 lg:py-2 lg:px-6 xl:py-3 xl:px-6 border border-black cursor-pointer bg-[var(--Heading)] text-white hover:bg-transparent hover:text-black"
                    // style={{ backgroundColor: 'var(--Heading)', color: 'var(--Placeholder)' }}
                    onClick={() => handleNavigate('/contactUs')}
                >
                    Book a Demo
                </button>
                <button type="button" className="md:hidden ms-3" onClick={() => setIsMobileOpen(true)}>
                    <RxHamburgerMenu size={25} />
                </button>
            </div>
        </div>

        {/* Mobile Menu */}
        <div
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        />

        {/* Mobile Menu with Slide Animation */}
        <div
            className={`
                fixed top-0 left-0 w-[80%] max-w-[300px] h-full bg-white z-[999] p-5
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            <div className="flex justify-between items-center mb-6">
                <Link href='/'>
                <Image src="/Logo.svg" alt="khazra logo" height={20} width={100} />
                </Link>
                <button onClick={() => setIsMobileOpen(false)}>
                <IoClose size={24} />
                </button>
            </div>

            <ul className="flex flex-col gap-4 text-base">
                {navTabs.map((tab, i) => (
                <li key={i} className="cursor-pointer hover:text-[var(--Primary)]" onClick={() => handleNavigate('/')}>
                    {tab}
                </li>
                ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
                <button
                onClick={() => handleNavigate('/login')}
                className="border border-black py-2 rounded-md"
                >
                Login
                </button>
                <button
                    onClick={() => handleNavigate('/contactUs')}
                    className="bg-[var(--Heading)] text-[var(--Placeholder)] py-3 rounded-md hover:border-2 hover:bg-white hover:text-black"
                >
                    Book a Demo
                </button>
            </div>
        </div>


        {/* Loading Screen */}
        {loadingScreen && (
            <div className="fixed inset-0 z-[999] backdrop-blur-sm bg-black/40 flex items-center justify-center">
                <DotLottieReact
                    src="https://lottie.host/3285712b-b88e-4d25-b560-0792e2ac5457/ciHZUebQPG.lottie"
                    autoplay
                    loop
                    style={{ width: 150, height: 150 }}
                />
            </div>
        )}
        </div>
    );
};

export default Navbar;
