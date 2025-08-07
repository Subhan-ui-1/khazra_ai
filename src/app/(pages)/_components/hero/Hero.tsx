'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
    const router = useRouter();
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const avatars = [
        { src: '/Avatar_1.svg', alt: 'User 1' },
        { src: '/Avatar_2.svg', alt: 'User 2' },
        { src: '/Avatar_3.svg', alt: 'User 3' },
        { src: '/Avatar_4.svg', alt: 'User 4' },
    ];

    const buttons = [
        {
            name: 'Book a Demo',
            bg: 'var(--Primary)',
            borderColor: 'var(--Primary)',
            textColor: 'var(--Placeholder)',
            hoverBg: 'var(--Background)',
            hoverBorderColor: 'var(--Heading)',
            hoverTextColor: 'var(--Heading)',
            action: () => {
                setLoadingScreen(true);
                router.push('/contactUs');
            },
        },
        {
            name: 'Carbon Calculator',
            bg: 'var(--Background)',
            borderColor: 'var(--Heading)',
            textColor: 'var(--Heading)',
            hoverBg: 'var(--Primary)',
            hoverBorderColor: 'var(--Background)',
            hoverTextColor: 'var(--Background)',
        },
    ];

    return (
        <div className="max-w-[1440px] w-full px-4 md:px-8 lg:px-16 flex flex-col justify-center items-center py-[60px] text-center">
            {/* reviews div */}
            {/* <div
                className="flex flex-col sm:flex-row items-center rounded-full px-4 py-2 space-y-2 sm:space-y-0 sm:space-x-3 border"
                style={{ borderColor: 'var(--Outline)' }}
            > */}
                {/* Avatars */}
                {/* <div className="flex -space-x-2">
                    {avatars.map((avatar, index) => (
                        <Image
                            key={index}
                            src={avatar.src}
                            alt={avatar.alt}
                            width={31}
                            height={31}
                            className="rounded-full"
                        />
                    ))}
                </div> */}

                {/* Text */}
                {/* <p
                    className="text-sm sm:text-base"
                    style={{
                        color: 'var(--Paragraph)',
                        fontSize: 'var(--P2-size)',
                    }}
                >
                    Rated 4.6 on Trustpilot, 4.8 on Capterra, and 4.9 on G2 by our satisfied clients.
                </p>
            </div> */}

            {/* title & description */}
            <div className="max-w-[1040px] w-full my-10 px-2">
                <h1
                    className="font-bold leading-tight"
                    style={{
                        fontSize: 'var(--H1-size)',
                        fontWeight: 'var(--H1-weight)',
                        lineHeight: 'var(--H1-line-height)',
                    }}
                >
                Empower Your Business to Achieve Net Zero
                </h1>
                <p
                    className="pt-6 text-base sm:text-lg md:text-xl"
                    style={{ color: 'var(--Paragraph)', fontSize: 'var(--P1-size)' }}
                >
                    Take control of your environmental impact with our all-in-one platform that empowers you
                    to measure emissions accurately, implement effective reduction strategies, and seamlessly
                    offset your carbon footprint.
                </p>
            </div>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-5">
                {buttons.map((btn, index) => {
                    const isHovered = hoverIndex === index;
                    return(
                        <button
                            key={index}
                            type="button"
                            onClick={btn.action}
                            className="px-6 py-3 rounded-lg cursor-pointer text-sm sm:text-base transition-colors duration-200"
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{
                                backgroundColor: isHovered ? btn.hoverBg : btn.bg,
                                border: `1px solid ${isHovered ? btn.hoverBorderColor : btn.borderColor}`,
                                color: isHovered ? btn.hoverTextColor : btn.textColor,
                            }}
                        >
                            {btn.name}
                        </button>
                    )
                })}
            </div>
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

export default Page;
