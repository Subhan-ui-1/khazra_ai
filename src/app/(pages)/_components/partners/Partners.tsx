"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import HorizontalMarquee from "../horizontalScroll/HorizontalScroll";

import { icons } from "@/components/icons/icons";

const brandsOne = [
  { svg: icons.zic, alttext: "zic logo" },
  { svg: icons.sadaqat, alttext: "sadaqat" },
  { svg: icons.Noon, alttext: "Noon Sugar Mills" },
  { svg: icons.Maple, alttext: "Maple Leaf Cement" },
  { svg: icons.SheikhoSteel, alttext: "Sheikho Steel" },
  { svg: icons.Toyota, alttext: "Toyota" },
  { svg: icons.PrimeGlobal, alttext: "PrimeGlobal" },
];

// const brandsOne = [
//     { svg: Zic, alttext: "zic oil" },
//     { svg: Sadaqat, alttext: "Sadaqat Mills" },
//     { svg: Noon, alttext: "Noon Sugar Mills" },
//     { svg: Maple, alttext: "Maple Leaf" },
//     { svg: SheikhoSteel, alttext: "Sheikho Steel Mills" },
//     { svg: Toyota, alttext: "Toyota" },
//     { svg: PrimeGlobal, alttext: "Prime Global" },
// ];

const progressSections = [
  {
    title: "AI Enabled Chatbot",
    description:
      "Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.",
    image: "/chatbotai.jpg",
  },
  {
    title: "Greenhouse Gas (GHG) Management",
    description:
      "Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.",
    image: "/ghg.jpg",
  },
  {
    title: "Carbon Accounting",
    description:
      "Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.",
    image: "/carbon.jpg",
  },
  {
    title: "Target Setting & Decarbonization",
    description:
      "Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.",
    image: "/target.jpg",
  },
  {
    title: "Sustainability Reporting",
    description:
      "Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.",
    image: "/reporting.jpg",
  },
  {
    title: "ESG Key Performance Indicators",
    description:
      "Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.",
    image: "/performance.jpg",
  },
  // {
  //     title: 'Science–Based Targets initiative (SBTI)',
  //     description: 'Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.',
  //     image: '/imagePlaceholder.png',
  // },
  // {
  //     title: 'Corporate Sustainability (CSRD)',
  //     description: 'Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.',
  //     image: '/imagePlaceholder.png',
  // },
  // {
  //     title: 'Suppliers',
  //     description: 'Gases that trap heat in the atmosphere, contributing to climate change. Key ones include CO₂, CH₄, and N₂O.',
  //     image: '/imagePlaceholder.png',
  // },
];

export default function Page() {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSection((prev) => (prev + 1) % progressSections.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentSection]);

  return (
    <div className="max-w-[1440px] w-full flex flex-col justify-center items-center md:py-12 pb-12 relative">
      <div className="flex items-center justify-center sm:w-[80%] w-full mt-0.5 mx-auto">
        <hr className="flex-grow border-t border-[var(--Outline)]" />
        <span
          className="px-4 text-center text-wrap"
          style={{
            backgroundColor: "var(--Background)",
            color: "var(--Paragraph)",
            fontSize: "var(--P1-size)",
          }}
        >
          Trusted by hundreds of B2B software platforms
        </span>
        <hr className="flex-grow border-t border-[var(--Outline)]" />
      </div>

      {/* Logos */}
      <HorizontalMarquee
        brands={brandsOne}
        bgColor="var(--Placeholder)"
        textColor="var(--Heading)"
      />
      {/* <HorizontalMarquee bgColor="var(--Placeholder)" textColor="var(--Heading)" /> */}

      {/* Main Card */}
      <div className="flex flex-col md:flex-row gap-4 rounded-4xl p-4 md:p-6 bg-[#E6EBE9] max-w-[1392px] w-full items-stretch">
        {/* Left Panel */}
        <div className="flex flex-col space-y-5 w-full lg:max-w-[420px] lg:w-full md:max-w-[320px] max-h-[600px] overflow-y-scroll">
          {progressSections.map((section, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 md:p-6 transition-opacity duration-500 ease-in-out"
              style={{ backgroundColor: "var(--Placeholder)" }}
            >
              <h3
                className="mb-2 text-[18px] lg:text-[24px] md:text-[20px]"
                style={{
                  color: "var(--Heading)",
                  fontWeight: "var(--H1-weight)",
                  lineHeight: "var(--P1-line-height)",
                }}
              >
                {section.title}
              </h3>
              {section.description && i === currentSection && (
                <p
                  className="opacity-100 transition-opacity duration-300 text-[14px] md:text-[var(--P1-size)]"
                  style={{
                    color: "var(--Heading)",
                    lineHeight: "var(--S1-line-height)",
                  }}
                >
                  {section.description}
                </p>
              )}
              {i === currentSection && (
                <div
                  className="mt-3 h-1 w-full overflow-hidden relative rounded"
                  style={{ backgroundColor: "var(--Outline)" }}
                >
                  <div
                    className="absolute top-0 left-0 h-1 animate-fill-bar"
                    style={{
                      animationDuration: "3s",
                      animationTimingFunction: "linear",
                      animationFillMode: "forwards",
                      backgroundColor: "var(--Primary)",
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div
          className="flex-1 flex items-center justify-center rounded-3xl relative p-3 w-full lg:w-[880px] md:w-[780px] lg:h-[600px]"
          style={{ backgroundColor: "var(--Placeholder)" }}
        >
          <Image
            src={progressSections[currentSection].image}
            className="rounded-3xl w-full h-full object-contain transition-opacity duration-500"
            alt={progressSections[currentSection].title}
            width={880}
            height={801}
          />
        </div>
      </div>
    </div>
  );
}
