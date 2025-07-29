'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import AuthLayout from '@/components/authLayout/AuthLayout';
import FormInput from '@/components/formInput/FormInput';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            alert('Please enter your email.');
            return;
        }

        setLoading(true);

        // Simulate network delay before navigation
        setTimeout(() => {
            router.push('/verifyCode');
        }, 200);
    };

    return (
        <>
            <Navbar />
            <AuthLayout
                heading="Forgot Password"
                description="No worries—we’ll help you reset it in just a few steps."
                imageSrc="/forgot-password.png"
            >
                <form
                    onSubmit={handleSubmit}
                    className="text-start space-y-8 max-w-[500px] w-full mx-auto"
                >
                    <FormInput
                        name="email"
                        label="Work Email"
                        type="email"
                        placeholder="Enter your work email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black p-3 rounded-lg hover:opacity-90 cursor-pointer text-white"
                        style={{ fontSize: 'var(--P1-size)' }}
                    >
                        {loading ? 'Sending...' : 'Send Code'}
                    </button>
                </form>
            </AuthLayout>
        </>
    );
};

export default ForgotPassword;
