import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-[#353636] text-white p-6 rounded-xl flex flex-col space-y-6">
            <div className="text-2xl text-black bg-white max-w-[46px] w-full h-[46px] p-3 flex justify-center items-center rounded-xl">{icon}</div>
            <h4 className="font-semibold xl:text-[24px] lg:text-[22px] md:text-[20px] text-[18px] mb-3">{title}</h4>
            <p className="text-gray-300" style={{fontSize: 'var(--P1-size)'}}>{description}</p>
        </div>
    );
}
