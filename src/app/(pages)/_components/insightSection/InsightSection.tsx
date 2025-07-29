import Image from 'next/image';
import InsightCard from "@/app/(pages)/_components/insightsCard/InsightsCard";

interface InsightData {
    title: string;
    description: string;
    barData: { name: string; value: number }[];
    donutData: { name: string; value: number }[];
}

interface SectionProps {
    tag: string;
    tagIcon: string;
    heading: string;
    subheading: string;
    insights: InsightData[];
    btnColor: string;
    btnBgColor: string;
    btnBorderColor: string;
    bgColor: string;
    textColor: string;
    hoverColor: string;
    hoverBgColor: string;
}

export default function InsightSection({
    tag,
    tagIcon,
    heading,
    subheading,
    insights,
    btnColor,
    btnBgColor,
    btnBorderColor,
    bgColor,
    textColor,
    hoverColor,
    hoverBgColor,
}: SectionProps) {
    return (
        <section className="w-full flex justify-center items-center" style={{ backgroundColor: bgColor, color: textColor }}>
            <div className='lg:py-[60px] xl:px-[170px] lg:px-[60px] md:p-[40px] p-4 max-w-[1440px] w-full text-center'>
                <button className="sm:mb-4 inline-flex sm:gap-3 gap-1 lg:px-6 lg:py-3 p-2 rounded-full xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px] font-medium cursor-default hover:scale-105 hover:cursor-pointer duration-200 transition" style={{ background: btnBgColor, color: btnColor, border: `1.5px solid ${btnBorderColor}`}}>
                    <Image src={tagIcon} alt={`${tag} icon`} width={20} height={10} className=''/> {tag}
                </button>
                <div className='max-w-[1040px] spave-y-4 my-10'>
                    <h2 style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)' }}>{heading}</h2>
                    <p style={{ fontSize: 'var(--P1-size)', lineHeight: 'var(--P1-line-height)' }}>{subheading}</p>
                </div>

                <div className="flex xl:flex-nowrap flex-wrap gap-4 justify-center">
                    {insights.map((data, idx) => (
                        <InsightCard current={0} previous={0} timeAgo={''} key={idx} {...data} cardBgColor={bgColor} cardTextColor={textColor} btnBorder={`1.5px solid ${textColor}`} btnHoverBgColor={hoverBgColor} btnHoverColor={hoverColor}/>
                    ))}
                </div>
            </div>
        </section>
    );
}