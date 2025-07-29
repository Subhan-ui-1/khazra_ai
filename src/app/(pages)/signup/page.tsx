'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FormInput from '@/components/formInput/FormInput';
import { Chart as ChartJS, ArcElement, LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

ChartJS.register(ArcElement, LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

const COLORS = {
    primary: '#0D5942',
    Outline: '#969998'
};

const analyticsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [1, 2, 5, 3, 2, 3, 4],
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primary,
        },
        {
            label: 'Dataset 2',
            data: [4, 5, 3, 1, 3, 0, 1, 2],
            borderColor: COLORS.Outline,
            backgroundColor: COLORS.Outline,
        },
    ],
    };

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
        type: 'linear' as const,
            min: 0,
            max: 5,
        grid: {
            color: '#E1E5E4',
            drawBorder: false,
        },
        ticks: {
            display: false,
        },
        },
        x: {
        grid: {
            display: false,
        },
        ticks: {
            color: 'var(--Placeholder)',
        },
        },
    },
    elements: {
        line: {
        tension: 0,
        borderWidth: 2,
        },
        point: {
        radius: 0,
        },
    },
    plugins: {
        legend: {
        display: false,
        },
    },
};

const completed = 40;
const remaining = 100 - completed;

const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
        {
        data: [completed, remaining],
        backgroundColor: ['#0D5942', '#E1E5E4'],
        borderWidth: 0,
        cutout: '60%',
        },
    ],
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
        display: false,
        },
        tooltip: {
        enabled: false,
        },
    },
};

const SignupSection = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobPosition, setJobPosition] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState('');
    const [industry, setIndustry] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full mx-auto h-screen">
            <div className="w-full p-4 flex flex-col max-h-[1040px] h-full">
                <form className="w-full mx-auto space-y-3">
                    <div className="flex sm:flex-row flex-col gap-x-4">
                        <FormInput
                            name="firstName"
                            label="First Name"
                            type="text"
                            placeholder="Enter your first name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <FormInput
                            name="lastName"
                            label="Last Name"
                            type="text"
                            placeholder="Enter your last name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="flex sm:flex-row flex-col gap-x-4">
                        <FormInput
                            name="email"
                            label="Work Email"
                            type="email"
                            placeholder="Enter your work email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormInput
                            name="phone"
                            label="Phone Number"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="flex sm:flex-row flex-col gap-4">
                        <div className="relative w-full">
                            <FormInput
                                name="newPassword"
                                label="New Password"
                                type={showPassword.new ? 'text' : 'password'}
                                placeholder="Enter new password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 bottom-3.5 text-gray-500"
                                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                            >
                                {showPassword.new ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                        {/* Confirm Password */}
                        <div className="relative w-full">
                            <FormInput
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showPassword.confirm ? 'text' : 'password'}
                                placeholder="Confirm password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 bottom-3.5 text-gray-500"
                                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                                {showPassword.confirm ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>

                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-x-4 gap-y-2'>
                        <FormInput
                            name="CompanyName"
                            label="Company Name"
                            type="text"
                            placeholder="Enter your Company Name"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />

                        <FormInput
                            name="jobPosition"
                            label="Job Position"
                            type="select"
                            options={['CEO', 'CTO', 'Engineer', 'Designer']}
                            placeholder="Select your job position"
                            required
                            value={jobPosition}
                            onChange={(e) => setJobPosition(e.target.value)}
                        />

                        <FormInput
                            name="NumberOfEmployees"
                            label="Number of Employees"
                            type="select"
                            options={['10', '20', '30', '40', '40+']}
                            placeholder="Select number of employees"
                            required
                            value={numberOfEmployees}
                            onChange={(e) => setNumberOfEmployees(e.target.value)}
                        />

                        <FormInput
                            name="Industry"
                            label="Industry"
                            type="select"
                            options={['Technology', 'Medical', 'Chemical', 'Agriculture']}
                            placeholder="Select industry"
                            required
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                    </div>

                    <label className="flex items-center text-sm space-x-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className='text-[var(--Paragraph)]'>
                        I agree to all <a href="#" className="underline">terms & conditions</a>
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="w-full py-3 text-white rounded-lg text-sm cursor-pointer mt-2"
                        style={{ backgroundColor: 'black' }}
                    >
                        Sign up
                    </button>

                    <p className="text-[var(--P1-size)] text-center mt-2">
                        Already have an account? <a href="/login" className="text-[var(--Primary)] font-medium">Login</a>
                    </p>
                </form>
            </div>

            <div className="w-full bg-[var(--Primary)] p-8 hidden md:flex flex-col space-y-8 justify-center items-center text-white max-h-[1010px] min-h-[700px] h-full relative">
                <div className='absolute top-1 right-0'>
                    <Image src={'/Signup_Mask.svg'} alt='signup_image' width={170} height={150} />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold max-lg:mt-10" style={{ color: 'var(--Placeholder)' }}>Khazra.ai</h2>

                <div className='max-w-[472px] w-full mx-auto relative max-h-[350px] h-full max-lg:mb-28'>
                    <div className="bg-white p-3 rounded-md max-w-[408px] w-full max-h-[260px] h-full">
                        <div className='flex justify-between items-center text-black mb-3 '>
                        <p className='md:text-[15px] text-[12px]'>Analytics</p>
                        <div className='flex p-1 rounded-md' style={{ backgroundColor: 'var(--Background)' }}>
                            {['Weekly', 'Monthly', 'Yearly'].map((label, index) => (
                            <div key={label} className={`md:py-[6px] md:px-3 py-1 px-2 rounded-md ${index === 0 ? 'bg-white' : ''}`}>
                                <p className='md:text-[12px] text-[10px] cursor-pointer' style={{ color: index === 0 ? 'var(--Heading)' : 'var(--Paragraph)' }}>
                                {label}
                                </p>
                            </div>
                            ))}
                        </div>
                        </div>
                        <Line data={analyticsData} options={options} className='bg-white max-h-[190px] h-full' />
                    </div>

                    <div className="md:p-6 p-4 bg-white rounded-[18px] absolute md:top-[135px] top-[155px] right-0 lg:w-[213px] md:w-[190px] w-[160px] h-[160px] md:h-[190px] lg:h-[213px]">
                        <Doughnut data={doughnutData} options={doughnutOptions} className='max-w-[165px] w-full max-h-[165px] h-full' />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-sm text-center w-[35%] h-[35%] flex flex-col justify-center rounded-full shadow-lg" style={{ color: 'var(--Heading)' }}>
                                <p className="text-xs md:text-sm" style={{ color: 'var(--Heading)' }}>Total</p>
                                <p className="font-bold text-base md:text-xl" style={{ color: 'var(--Heading)' }}>
                                {completed}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='max-w-[656px] w-full text-center xl:px-16 flex flex-col space-y-3  max-lg:mb-10'>
                    <p style={{ fontSize: 'var(--H3-size)', fontWeight: 'var(--H2-weight)' }}>Make Sustainability Simple for Your Business.</p>
                    <p className='text-[var(--Placeholder)] leading-[var(--P1-line-height)]' style={{ fontSize: 'var(--P1-size)' }}>Our platform streamlines carbon tracking, reporting, and reduction—so you can focus on what you do best while making a real impact.</p>
                </div>

                <div className='absolute bottom-1 left-0'>
                    <Image src={'/Signup_Mask.svg'} alt='signup_image' width={170} height={150} className='rotate-180' />
                </div>
            </div>
        </div>
    );
};

export default SignupSection;
