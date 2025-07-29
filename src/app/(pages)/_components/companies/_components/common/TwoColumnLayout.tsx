import { ReactNode } from "react";

interface TwoColumnLayoutProps {
    left: ReactNode;
    right: ReactNode;
}

export default function TwoColumnLayout({ left, right }: TwoColumnLayoutProps) {
    return (
        <div className="flex md:flex-row flex-col gap-[50px] bg-[#292A2A] md:p-8 p-4 lg:rounded-[40px] md:rounded-[30px] rounded-[20px] max-w-[1400px] w-full">
            <div className="md:max-w-[550px] w-full">{left}</div>
            <div className="md:max-w-[736px] w-full grid gap-4">{right}</div>
        </div>
    );
}