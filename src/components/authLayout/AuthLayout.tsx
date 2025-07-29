// components/layouts/AuthLayout.tsx
import Image from "next/image";

interface AuthLayoutProps {
    heading: string;
    description?: string;
    children: React.ReactNode;
    bottomSlot?: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
}

const AuthLayout = ({
    heading,
    description,
    children,
    bottomSlot,
    imageSrc,
    imageAlt = "Logo",
}: AuthLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-6">
            <div className="w-full max-w-[608px] mx-auto md:py-8">
                {/* Logo/Image (only if provided) */}
                {imageSrc && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-black rounded-full p-3 flex justify-center items-center">
                            <Image src={imageSrc} alt={imageAlt} width={24} height={24} />
                        </div>
                    </div>
                )}

                {/* Heading */}
                <h2
                    className="text-center font-semibold text-black mb-1"
                    style={{
                        fontSize: "var(--H3-size)",
                        fontWeight: "var(--H3-weight)",
                    }}
                >
                    {heading}
                </h2>

                {/* Description */}
                {description && (
                    <p
                        className="text-center mb-6"
                        style={{ fontSize: "var(--P1-size)", color: "var(--Paragraph)" }}
                    >
                        {description}
                    </p>
                )}

                {/* Form or Buttons */}
                <div>{children}</div>
            </div>

            {/* Bottom Disclaimer or Links */}
            {bottomSlot && (
                <div className="max-w-[798px] w-full py-5 mt-6">{bottomSlot}</div>
            )}
        </div>
    );
};

export default AuthLayout;
