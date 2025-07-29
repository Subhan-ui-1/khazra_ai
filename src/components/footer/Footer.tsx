'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsFillSendFill } from 'react-icons/bs';

const footerData = [
    {
        title: 'Services',
        items: [
        'Carbon Footprint',
        'Life Cycle Analysis',
        'Sustainable Procurement',
        'CSRD',
        'CBAM',
        'SBTi',
        'Connectors',
        ],
    },
    {
        title: 'About Khazra.ai',
        items: [
        'Why Khazra.ai',
        'Pricing',
        'Our board members',
        'Partners',
        'Data Security',
        'We are Hiring',
        'Referral',
        'FAQ’s',
        ],
    },
    {
        title: 'Resources',
        items: [
        'Leaf (media)',
        'Khazra.ai Blog',
        'Whitepaper',
        'Guides',
        'Legislation Checker',
        'Glossary',
        'Press',
        ],
    },
    {
        title: 'Company',
        items: [
        'About us',
        'Contact us',
        'Careers',
        'Media Kit',
        'Newsletter',
        'Terms & Condition',
        'Privacy Policy',
        ],
    },
];


const Footer = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const handleSend = () => {
        console.log('Sending:', email);
        setEmail(''); // Clear input
    };

    return (
        <div className="pt-[60px] lg:px-[20px] px-4 w-full">
            {/* Hero Section */}
            <section className="max-w-[1440px] w-full mx-auto lg:p-16 md:p-14 sm:p-12 p-5 rounded-xl md:text-center" style={{ backgroundColor: 'var(--Heading)', color: 'var(--Placeholder)', backgroundImage: 'url(https://res.cloudinary.com/dxxymlo0o/image/upload/v1750060433/Frame_yh64aq.svg)', backgroundRepeat: 'no-repeat' }} >
                <h3 className="mb-5" style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)' }}> The Sustainability Solution <br />Built for Ease, Powered for Performance</h3>
                <p className="text-[16px] sm:text-[20px] max-w-[950px] w-full mx-auto" style={{ fontWeight: 'var(--P1-weight)', lineHeight: '--P1-line-height', }}>Compliance can be complex, but Khazra.ai simplifies reporting. Requirements built for now and future-proofed for tomorrow.</p>
                <button onClick={() => router.push('/login')} className="cursor-pointer mt-8 p-3 rounded-lg sm:w-[200px] w-full bg-[#fff] text-[#000] border border-white transition duration-200 hover:bg-[#000] hover:text-[#fff]" style={{fontSize: 'var(--P1-size)'}}>
                Get Started</button>
            </section>

            {/* Newsletter Section */}
            <section className="text-center md:py-[60px] sm:py-[40px] py-[30px] w-full max-w-[1040px] mx-auto">
                <button
                className="px-6 py-3 rounded-full mb-10 hover:scale-105 duration-200 transition ease-in-out"
                style={{
                    backgroundColor: 'var(--Placeholder)',
                    border: '1px solid var(--Heading)',
                    color: 'var(--Heading)',
                    fontSize: 'var(--P1-size)',
                }}
                >
                Stay Informed
                </button>
                <h2 className="mb-4" style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)' }}>
                Stay connected with us
                </h2>
                <p
                className="max-w-[950px] w-full mb-10"
                style={{
                    fontSize: 'var(--P1-size)',
                    lineHeight: 'var(--P2-line-height)',
                    color: 'var(--Paragraph)',
                }}
                >
                Get our free, 5-min bi-monthly newsletter. Trusted by 500k+ leaders to master sustainability and drive
                impactful action across all Environmental, Social, and Governance aspects.
                </p>
                <div className="relative max-w-[460px] mx-auto w-full mb-2">
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 pr-10 rounded bg-white placeholder-[#969998]"
                        style={{ outline: 'var(--Outline)' }}
                    />
                    <BsFillSendFill
                        onClick={handleSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969998] cursor-pointer hover:text-black transition"
                        size={20}
                    />
                </div>
                <p className="mt-2" style={{ fontSize: 'var(--P2-size)', color: 'var(--Disable)' }}>
                We respect your privacy
                </p>
            </section>

            {/* Footer Branding Section */}
            <footer className="text-center md:py-[60px] sm:py-[40px] py-[30px] w-full bg-[var(--Background)]">
                <div className="max-w-[1040px] w-full mx-auto bg-[var(--Placeholder)] rounded-[30px] p-10">
                    <div className="max-w-[266px] w-full mx-auto flex justify-center min-h-14">
                        <Image
                        src="https://res.cloudinary.com/dxxymlo0o/image/upload/v1750056179/Logo_xtif9o.svg"
                        alt="Khazra.ai logo"
                        width={100}
                        height={10}
                        />
                    </div>
                    <p className="max-w-[524px] w-full mx-auto font-bold my-5" style={{ fontSize: 'var(--H3-size)' }}>
                        Seamlessly Built for a <span className="text-[var(--Primary)]">Greener Tomorrow.</span>
                    </p>
                    <div className="flex justify-center gap-2 max-w-[184px] w-full mx-auto max-h-10 h-full">
                        {[
                        {
                            src: 'https://res.cloudinary.com/dxxymlo0o/image/upload/v1750056720/linkedin-01_bav4fq.svg',
                            alt: 'LinkedIn',
                        },
                        {
                            src: 'https://res.cloudinary.com/dxxymlo0o/image/upload/v1750056719/instagram_avdl7v.svg',
                            alt: 'Instagram',
                        },
                        {
                            src: 'https://res.cloudinary.com/dxxymlo0o/image/upload/v1750056720/new-twitter-rectangle_vb5sfu.svg',
                            alt: 'X (Twitter)',
                        },
                        {
                            src: 'https://res.cloudinary.com/dxxymlo0o/image/upload/v1750056719/facebook-01_j9kxab.svg',
                            alt: 'Facebook',
                        },
                        ].map((icon, i) => (
                        <div key={i} className="cursor-pointer w-10 h-10 bg-[var(--Outline)] rounded-lg p-2">
                            <Image src={icon.src} alt={icon.alt} width={24} height={24} />
                        </div>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Footer Links Section */}
            <section className="bg-[var(--Background)] text-[var(--Paragraph)] border-x border-[var(--Outline)] pt-[60px] sm:px-10 px-5 max-w-[1040px] w-full mx-auto">
                <nav className="max-w-7xl mx-auto grid gap-y-6 sm:grid-cols-2 md:grid-cols-4 py-6 border-y border-[var(--Outline)] sm:px-6 md:px-8">
                {footerData.map((col, idx) => (
                    <div
                    key={col.title}
                    className={`
                        flex flex-col
                        ${idx < footerData.length - 1 && 'md:border-r'} 
                        border-[var(--Outline)] 
                        md:pr-6 
                        ${idx !== 0 ? 'md:pl-6' : ''}
                    `}
                    >
                    <h4 className="text-[var(--Heading)] font-bold mb-3">{col.title}</h4>
                    <ul className="space-y-[10px] text-[var(--Paragraph)]">
                        {col.items.map((item, i) => (
                        <li className="cursor-pointer hover:text-[var(--Primary)] transition" key={i}>
                            {item}
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
                </nav>

                <p className="text-center text-[var(--S2-size)] mt-10">
                    © 2024 Khazra.ai, all rights reserved.
                </p>
                <Image
                    src="https://res.cloudinary.com/dxxymlo0o/image/upload/v1750060053/footer_frame_frslr9.svg"
                    alt="Footer graphic"
                    width={960}
                    height={193}
                    className='pb-4'
                />
            </section>
        </div>
    );
};

export default Footer;
