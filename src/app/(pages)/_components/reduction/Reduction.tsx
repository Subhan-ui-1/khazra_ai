'use client';

import InsightSection from "../insightSection/InsightSection";
    const insights = [
        {
            title: "CSRD",
            description: "CSRD-compliant and EFRAG-aligned report automatically generated with comprehensive ESRS data",
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
            title: "International Frameworks",
            description: "Comprehensive and compliant reports for various frameworks -- CDP, CBAM, EPD, SASB and ISSB to name a few -- automatically generated.",
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

    export default function ReductionSection() {
    return (
        <InsightSection
            tag="Reduction"
            tagIcon="/coordinate-01.svg"
            heading="Data-Driven Solutions for a Greener Tomorrow."
            subheading="Leverage powerful analytics to understand your carbon footprint and take meaningful steps towards sustainability."
            insights={insights}
            btnColor="var(--Primary)"
            btnBgColor="var(--Placeholder)"
            btnBorderColor="var(--Primary)"
            bgColor="#E2F5D5"
            textColor="var(--Heading)"
            hoverColor="var(--Primary)"
            hoverBgColor="#fff"
        />
    );
}