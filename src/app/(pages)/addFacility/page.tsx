'use client';

import AuthLayout from '@/components/authLayout/AuthLayout';
import FormInput from '@/components/formInput/FormInput';
import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AddFacilityPage() {
    const router = useRouter();
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

    // Form states
    const [formData, setFormData] = useState({
        facilityId: '',
        facilityName: '',
        fullAddress: '',
        city: '',
        stateProvince: '',
        country: '',
        postalCode: '',
        latitude: 0,
        longitude: 0,
        facilityType: '',
        floorArea: '',
        status: ''
    });

    // Dropdown options
    const facilityTypeOptions = [
        'Office',
        'Warehouse',
        'Manufacturing'
    ];

    const statusOptions = [
        'Active',
        'Inactive',
        'Retired'
    ];

    // Generate facility ID on component mount
    useEffect(() => {
        const generateFacilityId = () => {
            const randomNumber = Math.floor(Math.random() * 900) + 100; // 100-999
            return `FAC_${randomNumber.toString().padStart(3, '0')}`;
        };
        
        setFormData(prev => ({
            ...prev,
            facilityId: generateFacilityId()
        }));

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude
                    }));
                    console.log('Location detected:', { latitude, longitude });
                },
                (error) => {
                    console.log('Location detection failed:', error.message);
                    // Set default coordinates (New York)
                    const defaultLat = 40.28;
                    const defaultLng = 74.6;
                    setLocation({ latitude: defaultLat, longitude: defaultLng });
                    setFormData(prev => ({
                        ...prev,
                        latitude: defaultLat,
                        longitude: defaultLng
                    }));
                    console.log('Using default location:', { latitude: defaultLat, longitude: defaultLng });
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser');
            // Set default coordinates
            const defaultLat = 40.28;
            const defaultLng = 74.6;
            setLocation({ latitude: defaultLat, longitude: defaultLng });
            setFormData(prev => ({
                ...prev,
                latitude: defaultLat,
                longitude: defaultLng
            }));
        }
    }, []);

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
        if (!formData.facilityName || !formData.fullAddress || !formData.city || 
            !formData.stateProvince || !formData.country || !formData.postalCode || 
            !formData.facilityType || !formData.floorArea || !formData.status) {
            alert('Please fill in all required fields');
            return;
        }

        // Simulate form submission
        setLoadingScreen(true);
        
        // Prepare facility data
        const facilityData = {
            ...formData,
            floorArea: parseInt(formData.floorArea),
            latitude: location.latitude,
            longitude: location.longitude
        };

        console.log('Facility Data:', facilityData);

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
                heading="Add Facility"
                description="Register a new facility for emissions tracking and sustainability reporting."
                imageSrc={'/organization.png'}
                bottomSlot={
                    <p className="text-center text-[var(--Paragraph)]" style={{ fontSize: "var(--P1-size)" }}>
                        By creating this facility, you acknowledge that you have read and understood,
                        and agree to Khazra.ai{" "}
                        <a href="/terms" className="text-[var(--Primary)] cursor-pointer">Terms & Conditions</a> and{" "}
                        <a href="/privacy" className="text-[var(--Primary)] cursor-pointer">Privacy Policy</a>
                    </p>
                }
            >
                {/* Form */}
                <form className="max-w-[600px] w-full mx-auto" onSubmit={handleSubmit}>
                    {/* Facility ID (Read-only) */}
                    <div className="mb-6">
                        <FormInput
                            name="facilityId"
                            label="Facility ID"
                            type="text"
                            placeholder="Auto-generated"
                            value={formData.facilityId}
                            readOnly={true}
                        />
                    </div>

                    {/* Facility Name */}
                    <div className="mb-6">
                        <FormInput
                            name="facilityName"
                            label="Facility Name"
                            type="text"
                            placeholder="Enter facility name"
                            required
                            value={formData.facilityName}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Full Address */}
                    <div className="mb-6">
                        <FormInput
                            name="fullAddress"
                            label="Full Address"
                            type="textarea"
                            placeholder="Enter complete address"
                            required
                            value={formData.fullAddress}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* City */}
                    <div className="mb-6">
                        <FormInput
                            name="city"
                            label="City"
                            type="text"
                            placeholder="Enter city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* State/Province */}
                    <div className="mb-6">
                        <FormInput
                            name="stateProvince"
                            label="State/Province"
                            type="text"
                            placeholder="Enter state or province"
                            required
                            value={formData.stateProvince}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Country */}
                    <div className="mb-6">
                        <FormInput
                            name="country"
                            label="Country"
                            type="text"
                            placeholder="Enter country"
                            required
                            value={formData.country}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="mb-6">
                        <FormInput
                            name="postalCode"
                            label="Postal Code"
                            type="text"
                            placeholder="Enter postal code"
                            required
                            value={formData.postalCode}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Floor Area */}
                    <div className="mb-6">
                        <FormInput
                            name="floorArea"
                            label="Floor Area (sq ft)"
                            type="text"
                            placeholder="Enter floor area in square feet"
                            required
                            value={formData.floorArea}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Facility Type Dropdown */}
                    <div className="mb-6">
                        <FormInput
                            name="facilityType"
                            label="Facility Type"
                            type="select"
                            placeholder="Select facility type"
                            options={facilityTypeOptions}
                            required
                            value={formData.facilityType}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div className="mb-8">
                        <FormInput
                            name="status"
                            label="Status"
                            type="select"
                            placeholder="Select status"
                            options={statusOptions}
                            required
                            value={formData.status}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Location Info */}
                    <div className="mb-6 p-4 bg-[var(--Secondary)] rounded-lg">
                        <p className="text-[var(--Primary)] font-medium mb-2" style={{ fontSize: 'var(--P2-size)' }}>
                            📍 Location Information
                        </p>
                        <p className="text-[var(--Paragraph)]" style={{ fontSize: 'var(--S1-size)' }}>
                            Latitude: {location.latitude.toFixed(6)} | Longitude: {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-[var(--Paragraph)] mt-1" style={{ fontSize: 'var(--S1-size)' }}>
                            Location detected automatically from your device
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full text-[20px] bg-black p-3 rounded-lg hover:opacity-90 cursor-pointer mb-4"
                        style={{ color: 'var(--Placeholder)'}}
                    >
                        Create Facility
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