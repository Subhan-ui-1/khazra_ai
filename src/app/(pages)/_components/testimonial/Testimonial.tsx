"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "@/components/icons/icons";
const allTestimonials = [
    {
        quote: "Easy onboarding, this is exactly the accounting tool that we were waiting for and Andy is very responsive. 100% recommend",
        name: "Zic Oil",
        role: "CEO",
        svg: icons.zic,
    },
    {
        quote: "Finta saved us in a pinch before the deadline and we're loving the simple, intuitive product interface. Andy was incredibly helpful and responsive on a Friday afternoon.",
        name: "Sadaqat textile limited",
        role: "Manager",
        svg: icons.sadaqat,
    },
    {
        quote: "Expense categorization is fast and accurate; provides the best picture of spending I could possibly imagine. Onboarding was so smooth I legitimately don't know how they did it (did you hack brex?).",
        name: "Noon Sugar Mills",
        role: "CEO",
        svg: icons.Noon,
    },
    {
        quote: "Recommended Finta to a startup founder - she said onboarding was super easy, took less than 10 min to reconcile her expenses for the whole year and onboarding onto tax service was less than 30 minutes.",
        name: "Mapple Leaf Cement",
        role: "CFO",
        svg: icons.Maple,
    },
    {
        quote: "Love how quickly we can close the books now. So much time saved! Recommended Finta to a startup founder - she said onboarding was super easy.",
        name: "Sheikhoo Group of companies",
        role: "VP of Ops",
        svg: icons.SheikhoSteel,
    },
    {
        quote: "The team is amazing and the support is lightning fast. True SaaS spirit! Integrations were seamless and visibility has drastically improved.",
        name: "Toyota Indus Motors Company Limited",
        role: "Product Manager",
        svg: icons.Toyota,
    },
    {
        quote: "Integrations were seamless and visibility has drastically improved. Helped us scale our finances effortlessly across multiple teams.",
        name: "Prime Global",
        role: "Accounting Manager",
        svg: icons.PrimeGlobal,
    },
    {
        quote: "Helped us scale our finances effortlessly across multiple teams. Easy onboarding, this is exactly the accounting tool that we were waiting for and Andy is very responsive. 100% recommend",
        name: "TCFD",
        role: "COO",
        svg: icons.TCFD,
    },
    {
        quote: "No more spreadsheets. This tool is the future of closing books. Helped us scale our finances effortlessly across multiple teams.",
        name: "SBTi",
        role: "Controller",
        svg: icons.SBTi,
    },
    {
        quote: "Literally onboarded in 5 mins. Best experience ever. Great UX, clear reports, and a team that listens. Everything just works. A rare find in finance tools.",
        name: "Kevin Zhang",
        role: "Founder",
        svg: icons.TBWA,
    },
    {
        quote: "Great UX, clear reports, and a team that listens. Everything just works. A rare find in finance tools.",
        name: "Zara Patel",
        role: "Accountant",
        svg: icons.Webflow,

    },
    {
        quote: "Everything just works. A rare find in finance tools. Great UX, clear reports, and a team that listens.",
        name: "Mohammed Ali",
        role: "VP Finance",
        svg: icons.Ogilvy,
    },
];

const Testimonial = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const chunkSize = Math.ceil(allTestimonials.length / 3);
    const firstChunk = allTestimonials.slice(0, chunkSize);
    const secondChunk = allTestimonials.slice(chunkSize, chunkSize * 2);
    const thirdChunk = allTestimonials.slice(chunkSize * 2);

    return (
    <section className="md:py-[60px] sm:py-[40px] py-[30px] max-w-[1040px] w-full mx-auto sm:px-0 px-[16px] text-black">
        <div className="text-center mb-12">
            <button
                className="px-6 py-3 text-sm rounded-full cursor-default hover:scale-105 duration-200 transition ease-in-out"
                style={{
                    backgroundColor: "var(--Outline)",
                    fontSize: "var(--P1-size)",}}>
                Testimonials
            </button>
            <h2
            className="my-10"
            style={{
                fontSize: "var(--H2-size)",
                fontWeight: "var(--H2-weight)",
            }}
            >
            Loved By Closers
            </h2>
        </div>

        <div className="relative h-[680px] overflow-hidden">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#F6F6F6] to-transparent z-10" />

            {/* Columns */}
            <div className="flex gap-3 md:flex-nowrap flex-wrap">
                {isMobile ? (
                    <div className="h-full w-full">
                        <Column direction="up" data={allTestimonials} />
                    </div>
                ) : (
                    <>
                    <div className="h-full">
                        <Column direction="up" data={firstChunk} />
                    </div>
                    <div className="h-full">
                        <Column direction="up" data={secondChunk} />
                    </div>
                    <div className="h-full">
                        <Column direction="up" data={thirdChunk} />
                    </div>
                    </>
                )}
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F6F6F6] to-transparent z-10" />
        </div>
    </section>
    );
};

const Column = ({ direction, data }: { direction: "up" | "down"; data: typeof allTestimonials }) => {
    const duplicatedData = [...data, ...data];

    return (
        <div className="flex-1 overflow-hidden max-w-[1040px] w-full">
            <div
                className={`flex flex-col gap-3 animate-scroll-${direction}`}
                style={{ animationDuration: `${data.length * 5}s` }} // speed control
            >
                {duplicatedData.map((item, index) => (
                    <Card key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

const Card = ({
    quote,
    name,
    role,
    svg,
}: {
    quote: string;
    name: string;
    role: string;
    svg: string;
}) => (
    <div className="bg-white p-6 rounded-[20px] shadow-lg w-full h-full mx-auto">
        <p className="mb-6" style={{fontSize: 'var(--P2-size)', outline: 'var(--Outline)'}}>“{quote}”</p>
        <div className="flex items-center gap-3">
            <div
                className="w-12 h-12 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />

            <div>
                <p className="font-bold text-[18px]">{name}</p>
                <p className="text-[14px]">{role}</p>
            </div>
        </div>
    </div>
);

export default Testimonial;
