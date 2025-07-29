'use client';

import React, { useState, useEffect, useRef } from 'react';
import AuthLayout from '@/components/authLayout/AuthLayout';
import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';

const VerifyCode = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(59);
    const [otp, setOtp] = useState(Array(5).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // // Redirect when OTP is fully filled
    // useEffect(() => {
    //     if (otp.every(digit => digit !== '')) {
    //         setTimeout(() => {
    //             router.push('/resetPassword');
    //         }, 500); // simulate verify delay
    //     }
    // }, [otp, router]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setOtp(Array(5).fill(''));
            setTimer(59);
            inputRefs.current[0]?.focus();
            // Optional: trigger resend OTP API
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (otp.some(d => d === '')) {
            alert('Please enter the full verification code.');
            return;
        }

        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            router.push('/resetPassword');
        }, 1000);
    };

    return (
        <>
            <Navbar />
            <AuthLayout
                heading="Verification code"
                description="The Confirmation code was sent to the email khazraabc@12***.gmail.com"
                imageSrc="/otp.png"
            >
                <form onSubmit={handleSubmit} className="space-y-6 max-w-[500px] w-full mx-auto">
                    <div className="flex flex-col gap-2 mb-4">
                        <p style={{ fontSize: 'var(--P1-size)' }}>Insert Code *</p>
                        <div className="flex gap-5 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="md:w-[84px] sm:w-[84px] w-[70%] md:h-[50px] h-[50px] text-center text-xl border border-[var(--Outline)] rounded-md bg-white"
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mb-4" style={{ fontSize: 'var(--P1-size)' }}>
                        <p>Time remaining</p>
                        <p className="font-medium" style={{ color: 'var(--Primary)' }}>
                            00:{timer.toString().padStart(2, '0')}
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black p-3 rounded-lg hover:opacity-90 text-white cursor-pointer"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={timer > 0}
                            className={`text-[var(--P1-size)] font-medium ${timer === 0 ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400'}`}
                        >
                            Send Again
                        </button>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

export default VerifyCode;
