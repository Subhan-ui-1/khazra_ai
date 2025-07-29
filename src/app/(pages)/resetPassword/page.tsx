'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import AuthLayout from '@/components/authLayout/AuthLayout';
import FormInput from '@/components/formInput/FormInput';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function ResetPasswordPage() {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');

        // Simulate password reset
        setTimeout(() => {
            setStep('success');
        }, 800);
    };

    return (
        <>
            <Navbar />
            <div className='w-full max-w-[700px] mx-auto flex flex-col justify-center items-center'>
            {step === 'form' ? (
                <AuthLayout
                    heading="Reset Password"
                    description="Create a new password to securely access your account."
                    imageSrc="/lock.png"
                >
                    <form onSubmit={handleSubmit} className="space-y-5 max-w-[500px] w-full mx-auto">

                        {/* New Password */}
                        <div className="relative">
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
                        <div className="relative">
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
                            {/* Error message */}
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}

                        <button
                            type="submit"
                            className="w-full bg-black p-3 rounded-lg hover:opacity-90 text-white cursor-pointer"
                        >
                            Change Password
                        </button>
                    </form>
                </AuthLayout>
            ) : (
                <div className='w-full flex flex-col items-center py-8'>
                    <Image src="/success-reset.png" alt="Success" width={250} height={250} className='xl:w-[250px] xl:h-[250px] lg:h-[220px] lg:w-[220px] md:w-[200px] md:h-[200px] w-[160px] h-[160px]'/>
                    <AuthLayout
                        heading="Password reset Successfully"
                        description="Your password has been updated. You can now log in with your new credentials."
                    >
                        <div className="flex flex-col items-center justify-center mt-8 space-y-6">
                            <button
                                onClick={() => router.push('/')}
                                className="bg-black text-white px-[67px] py-3 rounded-lg hover:opacity-90 cursor-pointer"
                            >
                                Go to Home
                            </button>
                        </div>
                    </AuthLayout>
                </div>
            )}
            </div>
        </>
    );
}
