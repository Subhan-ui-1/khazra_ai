'use client';

import InsightSection from "@/app/(pages)/_components/insightSection/InsightSection";
    const insights = [
        {
            title: "Decarbonization Strategy",
            description: "Detailed & quantified decarbonization strategy with science-based scenarios aligned with SBTi and CSRD",
            barData: [
            { name: 'A', value: 52 },
            { name: 'B', value: 82 },
            { name: 'C', value: 62 },
            { name: 'C', value: 32 },
            { name: 'C', value: 99 },
            ],
            donutData: [
            { name: 'A', value: 52 },
            { name: 'B', value: 82 },
            { name: 'C', value: 62 },
            { name: 'C', value: 32 },
            { name: 'C', value: 99 },
            ],
            current: 99,
            previous: 52,
            timeAgo: '2 years ago',
        },
        {
            title: "SBTi",
            description: "End-to-end expert-led support and guidance to submit an application with fully compliant requirements covering all scopes, and committing to decarbonization",
            barData: [
            { name: 'A', value: 82 },
            { name: 'B', value: 92 },
            { name: 'C', value: 62 },
            { name: 'C', value: 52 },
            { name: 'C', value: 72 },
            ],
            donutData: [
            { name: 'A', value: 82 },
            { name: 'B', value: 92 },
            { name: 'C', value: 62 },
            { name: 'C', value: 52 },
            { name: 'C', value: 72 },
            ],
            current: 72,
            previous: 82,
            timeAgo: '2 years ago',
        },
    ];

    export default function ComplianceSection() {
    return (
        <InsightSection
            tag="Compliance"
            tagIcon="/coordinate-02.svg"
            heading="Data-Driven Solutions for a Greener Tomorrow."
            subheading="Leverage powerful analytics to understand your carbon footprint and take meaningful steps towards sustainability."
            btnColor="#2821AD"
            btnBgColor="#E7E5FF"
            btnBorderColor="#2821AD"
            insights={insights}
            bgColor="var(--Placeholder)"
            textColor="var(--Heading)"
            hoverColor="#fff"
            hoverBgColor="#000"
        />
    );
}