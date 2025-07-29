'use client';

import AuthLayout from '@/components/authLayout/AuthLayout';
import FormInput from '@/components/formInput/FormInput';
import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AddBoundaryPage() {
    const router = useRouter();
    const [loadingScreen, setLoadingScreen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        organizationId: '687e28a37ba28e3a5bcd9331',
        industry: '',
        businessNature: '',
        baselineYear: '',
        baselineEmissions: '',
        facilityCount: '',
        equipmentCount: ''
    });

    // Dropdown options
    const industryOptions = [
        'Industry',
        'Textile',
        'Chemical Industries',
        'Tech Industries',
        'Medical Industries',
        'Automobile Industries'
    ];

    const businessNatureOptions = [
        'Hybrid',
        'Remote',
        'Onsite'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNavigate = (route: string) => {
        router.push(route);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.industry || !formData.businessNature || !formData.baselineYear || !formData.baselineEmissions) {
            alert('Please fill in all required fields');
            return;
        }

        // Simulate form submission
        setLoadingScreen(true);
        
        // Here you would typically send the data to your API
        const boundaryData = {
            ...formData,
            baselineYear: parseInt(formData.baselineYear),
            baselineEmissions: parseFloat(formData.baselineEmissions),
            facilityCount: parseInt(formData.facilityCount) || 0,
            equipmentCount: parseInt(formData.equipmentCount) || 0
        };

        console.log('Boundary Data:', boundaryData);

        // Simulate API call delay
        setTimeout(() => {
            setLoadingScreen(false);
            // Navigate to dashboard or show success message
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <>
            <Navbar />
            <AuthLayout
                heading="Add Boundary"
                description="Define your organization's operational boundary for emissions tracking and sustainability reporting."
                imageSrc={'/organization.png'}
                bottomSlot={
                    <p className="text-center text-[var(--Paragraph)]" style={{ fontSize: "var(--P1-size)" }}>
                        By creating this boundary, you acknowledge that you have read and understood,
                        and agree to Khazra.ai{" "}
                        <a href="/terms" className="text-[var(--Primary)] cursor-pointer">Terms & Conditions</a> and{" "}
                        <a href="/privacy" className="text-[var(--Primary)] cursor-pointer">Privacy Policy</a>
                    </p>
                }
            >
                {/* Form */}
                <form className="max-w-[600px] w-full mx-auto" onSubmit={handleSubmit}>
                    {/* Industry Dropdown */}
                    <div className="mb-6">
                        <FormInput
                            name="industry"
                            label="Industry"
                            type="select"
                            placeholder="Select your industry"
                            options={industryOptions}
                            required
                            value={formData.industry}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Business Nature Dropdown */}
                    <div className="mb-6">
                        <FormInput
                            name="businessNature"
                            label="Business Nature"
                            type="select"
                            placeholder="Select business nature"
                            options={businessNatureOptions}
                            required
                            value={formData.businessNature}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Baseline Year */}
                    <div className="mb-6">
                        <FormInput
                            name="baselineYear"
                            label="Baseline Year"
                            type="text"
                            placeholder="Enter baseline year (e.g., 2005)"
                            required
                            value={formData.baselineYear}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Baseline Emissions */}
                    <div className="mb-6">
                        <FormInput
                            name="baselineEmissions"
                            label="Baseline Emissions (tCO2e)"
                            type="text"
                            placeholder="Enter baseline emissions"
                            required
                            value={formData.baselineEmissions}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Facility Count */}
                    <div className="mb-6">
                        <FormInput
                            name="facilityCount"
                            label="Number of Facilities"
                            type="text"
                            placeholder="Enter number of facilities (optional)"
                            value={formData.facilityCount}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Equipment Count */}
                    <div className="mb-8">
                        <FormInput
                            name="equipmentCount"
                            label="Number of Equipment"
                            type="text"
                            placeholder="Enter number of equipment (optional)"
                            value={formData.equipmentCount}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full text-[20px] bg-black p-3 rounded-lg hover:opacity-90 cursor-pointer mb-4"
                        style={{ color: 'var(--Placeholder)'}}
                    >
                        Create Boundary
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={() => handleNavigate('/dashboard')}
                        className="w-full text-[20px] border border-[var(--Outline)] p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        style={{ 
                            color: 'var(--Paragraph)',
                            backgroundColor: 'var(--Placeholder)'
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </AuthLayout>

            {loadingScreen && (
                <div className="fixed inset-0 z-[999] backdrop-blur-sm bg-black/40 flex items-center justify-center">
                    <DotLottieReact
                        src="https://lottie.host/3285712b-b88e-4d25-b560-0792e2ac5457/ciHZUebQPG.lottie"
                        autoplay
                        loop
                        style={{ width: 150, height: 150 }}
                    />
                </div>
            )}
        </>
    );
} 