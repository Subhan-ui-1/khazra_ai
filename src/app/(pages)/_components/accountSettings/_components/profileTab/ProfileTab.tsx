    'use client';

    import React, { useState, useRef } from 'react';
    import Image from 'next/image';

    const initialData = {
    firstName: 'Jhon',
    lastName: 'Doe',
    email: 'Khazraabc123@gmail.com',
    phone: '(123) 456 789 012',
    company: 'Khazra Carbons',
    position: 'Admin Manager',
    employees: '20',
    industry: 'Fabric Manufacturing',
    };

    const ProfileTab = () => {
        const [isEditingProfile, setIsEditingProfile] = useState(false);
        const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
        const [formData, setFormData] = useState(initialData);
        const [profileImage, setProfileImage] = useState('/profile.png');

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleProfileEdit = () => setIsEditingProfile(prev => !prev);
    const togglePersonalEdit = () => setIsEditingPersonalInfo(prev => !prev);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (isEditingProfile && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setProfileImage(imageURL);
        }
    };

    return (
        <div className="flex">
            <section className="w-full">
                {/* Profile Overview */}
                <div className="py-3">
                    <div className="pb-3">
                        <p className="text-[20px] font-bold">Profile</p>
                    </div>
                    <div className="rounded-xl border border-[var(--Outline)] p-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Image
                                    src={profileImage}
                                    alt="profile"
                                    width={60}
                                    height={60}
                                    className="rounded-full md:w-[60px] md:h-[60px] w-10 h-10 cursor-pointer object-cover"
                                    onClick={handleImageClick}
                                />
                                {isEditingProfile && (
                                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                                        <Image src="/Edit.png" alt="Edit icon" width={14} height={14} className='sm:w-[14px] sm:h-[14px] w-[10px] h-[10px]' />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <p className="xl:text-[24px] lg:text-[22px] md:text-[20px] text-[18px]" style={{
                                    fontWeight: 'var(--H3-weight)',
                                    color: 'var(--Heading)',}}>
                                    {formData.firstName} {formData.lastName}
                                </p>
                                <p style={{fontSize: 'var(--P1-size)',fontWeight: 'var(--S1-weight)',color: 'var(--Paragraph)',}}>
                                    {formData.position}
                                </p>
                            </div>
                        </div>
                        <button
                        className="flex items-center gap-2 border sm:px-3 sm:py-2 p-2 rounded-md text-[var(--Heading)] cursor-pointer"
                        style={{ fontSize: 'var(--P2-size)' }}
                        onClick={toggleProfileEdit}
                        >
                        <Image alt="edit" src="/Edit.png" width={16} height={16} />{' '}
                            {isEditingProfile ? 'Save' : 'Edit'}
                        </button>
                    </div>
                </div>

                {/* Personal Info Section */}
                <div className="rounded-xl border border-[var(--Outline)] p-3 mb-3">
                    <div className="flex justify-between items-center mb-4 sm:gap-0 gap-2">
                        <div className="flex flex-col gap-[6px] max-w-2/3">
                        <h3
                            style={{
                            fontSize: 'var(--P1-size)',
                            fontWeight: 'var(--H3-weight)',
                            color: 'var(--Heading)',
                            }}
                        >
                            Personal Information
                        </h3>
                        <p
                            style={{
                            fontSize: 'var(--P2-size)',
                            color: 'var(--Paragraph)',
                            }}
                        >
                            Keep your profile up to date to ensure accurate insights and communication.
                        </p>
                        </div>
                        <button
                        onClick={togglePersonalEdit}
                        className="max-w-[87px] flex items-center gap-2 border sm:px-3 sm:py-2 p-2 rounded-md text-[var(--Heading)] cursor-pointer"
                        style={{ fontSize: 'var(--P2-size)' }}
                        >
                        <Image alt="edit" src="/Edit.png" width={16} height={16} />{' '}
                        {isEditingPersonalInfo ? 'Save' : 'Edit'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1">
                        {[
                        ['firstName', 'First Name'],
                        ['lastName', 'Last Name'],
                        ['email', 'Work Email'],
                        ['phone', 'Phone Number'],
                        ['company', 'Company Name'],
                        ['position', 'Job Position'],
                        ['employees', 'Number of Employees'],
                        ['industry', 'Industry'],
                        ].map(([key, label]) => (
                        <div key={key} className="sm:px-3">
                            <p className="py-3" style={{ fontSize: 'var(--P2-size)', color: 'var(--Paragraph)' }}>
                            {label}
                            </p>

                            <input
                                type="text"
                                readOnly={!isEditingPersonalInfo}
                                value={formData[key as keyof typeof formData]}
                                onChange={e => handleChange(key, e.target.value)}
                                className={`w-full border px-3 py-2 rounded-md ${
                                    isEditingPersonalInfo
                                    ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--Primary)]'
                                    : 'border-transparent bg-transparent text-[var(--Heading)] cursor-default'
                                }`}
                                style={{
                                    fontSize: 'var(--P2-size)',
                                    fontWeight: 'var(--P1-weight)',
                                    color: 'var(--Heading)',
                                }}
                                />
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfileTab;
