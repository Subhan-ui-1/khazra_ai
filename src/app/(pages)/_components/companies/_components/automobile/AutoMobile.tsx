import FeatureCard from "../common/FeatureCard";
import TwoColumnLayout from "../common/TwoColumnLayout";
import { Icons } from "../common/Icons";
import HighlightBox from "../common/HighlightBox";

export default function AutoMobile(){
    const leftContent = (
        <div className="flex flex-col justify-between h-full" style={{ color: 'var(--Placeholder)' }}>
            <div className="flex flex-col space-y-3">
                <h2 style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)' }}>
                    Accelerate Your AutoMobile Strategy for Immediate Impact
                </h2>
                <p style={{ fontSize: 'var(--P2-size)', fontWeight: 'var(--P2-weight)'}}>
                    Save time on paperwork, and focus on what really matters.
                    Accelerating your climate impact with ease. Discover our best offer
                </p>
                <div className="space-y-4 mt-5">
                    <HighlightBox
                        value="80%"
                        description="Reduction potential in hours with Khazra.ai"
                    />
                    <HighlightBox
                        value="80%"
                        description="10% Less expensive than other platforms."
                    />
                </div>
            </div>
            <button className="mt-4 w-full px-5 py-3 text-white rounded-md hover:bg-white hover:text-black transition cursor-pointer" style={{fontSize: 'var(--P1-size)', border: '1px solid var(--Placeholder)'}}>
                Learn more
            </button>
        </div>
    );

    const rightContent = (
        <div className="flex flex-col gap-[10px]">
            <FeatureCard
                icon={Icons.clipboard}
                title="Avoid Manual Work"
                description="Khazra streamlines data collection with automatic emission factor matching, precise analytics, and expert-verified reports."
            />
            <FeatureCard
                icon={Icons.chart}
                title="A Platform Adapted to Your Needs"
                description="Khazra Climate Suite supports any climate goal with an easy-to-use platform and customized dashboards for year-on-year comparisons."
            />
            <FeatureCard
                icon={Icons.support}
                title="Support at Every Level"
                description="Get access to online support & project managers that will help you through your journey, as well as our Khazra.ai Academy to increase autonomy & expertise."
            />
        </div>
    );

    return (
        <div className="mt-10">
            <TwoColumnLayout left={leftContent} right={rightContent} />
        </div>
    );
}