'use client';
import React from "react";
import Marquee from "react-fast-marquee";

interface Brand {
    svg: string;
    alttext: string;
}

interface HorizontalMarqueeProps {
    brands: Brand[];
    bgColor?: string;
    textColor?: string;
}

export default function HorizontalMarquee({
    brands,
    bgColor = '',
    textColor = '',
}: HorizontalMarqueeProps) {

    return (
        <div className="w-full overflow-hidden py-8">
        <Marquee speed={70} gradient={false} className="max-w-[1440px] w-full mx-auto">
            <div className="flex">
            {brands.map((brand, index) => (
                <div
                key={index}
                className="md:w-[160px] w-[100px] md:h-[56px] h-[40px] rounded-[12px] px-4 py-4 flex items-center justify-center flex-shrink-0 lg:mx-[46px] md:mx-[36px] sm:mx-[26px] mx-[16px]"
                style={{ backgroundColor: bgColor }}
                >
                <div
                    className="md:w-full w-14 h-[14] flex items-center justify-center"
                    style={{ color: `var(${textColor})` }}
                    dangerouslySetInnerHTML={{ __html: brand.svg }}
                />
                </div>
            ))}
            </div>
        </Marquee>
        </div>
    );
}
