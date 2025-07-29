"use client";

import InsightSection from "@/app/(pages)/_components/insightSection/InsightSection";
const insights = [
  {
    title: "GHG Assessment",
    description:
      "Fully-compliant GHG reports on Scope 1, 2 and 3 emissions based on robust analyses & automated analytics",
    barData: [
      { name: "A", value: 82 },
      { name: "B", value: 92 },
      { name: "C", value: 72 },
      { name: "C", value: 62 },
      { name: "C", value: 52 },
    ],
    donutData: [
      { name: "A", value: 82 },
      { name: "B", value: 92 },
      { name: "C", value: 72 },
      { name: "C", value: 62 },
      { name: "C", value: 52 },
    ],
    current: 52,
    previous: 80,
    timeAgo: "2 years ago",
  },
  {
    title: "Life Cycle Analysis",
    description:
      "Accurate Scope 1, 2, and 3 emissions reports powered by life cycle assessment and automated, standards-based analytics.",
    barData: [
      { name: "A", value: 120 },
      { name: "B", value: 115 },
      { name: "C", value: 110 },
      { name: "C", value: 102 },
      { name: "C", value: 92 },
    ],
    donutData: [
      { name: "A", value: 120 },
      { name: "B", value: 115 },
      { name: "C", value: 110 },
      { name: "C", value: 102 },
      { name: "C", value: 92 },
    ],
    current: 92,
    previous: 120,
    timeAgo: "2 years ago",
  },
  {
    title: "Sustainable Procurement",
    description:
      "Track and assess supplier emissions, risks, and sustainability metrics to make smarter, low-carbon procurement decisions.",
    barData: [
      { name: "A", value: 50 },
      { name: "B", value: 45 },
      { name: "C", value: 42 },
      { name: "C", value: 40 },
      { name: "C", value: 38 },
    ],
    donutData: [
      { name: "A", value: 50 },
      { name: "B", value: 45 },
      { name: "C", value: 42 },
      { name: "C", value: 40 },
      { name: "C", value: 38 },
    ],
    current: 38,
    previous: 50,
    timeAgo: "2 years ago",
  },
];

export default function MeasurementSection() {
  return (
    // <section className="w-full flex justify-center items-center" style={{backgroundColor: 'var(--Primary)', color: 'var(--Placeholder)'}}>
    //     <div className='py-[60px] px-[200px] max-w-[1440px] w-full text-center'>
    //         <p className="mb-4 inline-flex gap-3 px-6 py-3 rounded-full text-sm font-medium" style={{background: 'var(--Secondary)', color: 'var(--Primary)'}}>
    //             <Image src={'/coordinate-01.svg'} alt='measurements icon' width={20} height={10}/> Measurements
    //         </p>
    //         <div className='max-w-[1040px] gap-y-4 my-10'>
    //             <h2 style={{fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)'}}>
    //                 Science-Backed Calculations for a Greener Future.
    //             </h2>
    //             <p style={{fontSize: 'var(--P1-size)', lineHeight: 'var(--P1-line-height)'}}>
    //                 Our platform ensures every carbon calculation is rooted in scientific accuracy, empowering your business to make informed decisions toward sustainability with absolute confidence.
    //             </p>
    //         </div>

    //         <div className="flex gap-4">
    //             {insights.map((data, idx) => (
    //                 <InsightCard key={idx} {...data} />
    //             ))}
    //         </div>
    //     </div>
    // </section>

    <InsightSection
      tag="Measurements"
      tagIcon="/coordinate-01.svg"
      heading="Science-Backed Calculations for a Greener Future."
      subheading="Our platform ensures every carbon calculation is rooted in scientific accuracy, empowering your business to make informed decisions toward sustainability with absolute confidence."
      btnColor="var(--Primary)"
      btnBgColor="var(--Secondary)"
      btnBorderColor="var(--Secondary)"
      insights={insights}
      bgColor="var(--Primary)"
      textColor="var(--Placeholder)"
      hoverColor="var(--Primary)"
      hoverBgColor="#fff"
    />
  );
}
