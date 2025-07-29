'use client';
import FormInput from '@/components/formInput/FormInput';
import Image from 'next/image';
import { useState } from 'react';

const SecurityTab = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('1234567891234');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const togglePasswordEdit = () => setIsEditingPassword(prev => !prev);
    return (
        <div className="space-y-6 py-3 flex flex-col justify-between w-full">
            <div className='flex flex-col gap-3'>
                {/* Section Header */}
                <div className='border border-[var(--Outline)] p-3 rounded-xl flex flex-col gap-3'>
                    <div className='border-b border-[var(--Outline)] py-2'>
                        <h2 className="text-[20px] font-bold text-[var(--Heading)]">Security</h2>
                    </div>

                    {/* Change Password Section */}
                    <div className="flex flex-col sm:gap-8 gap-6">
                        <div className="flex justify-between items-center sm:mb-4">
                            <div className='flex flex-col gap-[6px] max-w-2/3'>
                                <p className="text-[var(--Heading)] sm:text-[20px] text-[18px] mb-1" style={{fontWeight: 'var(--H3-weight)'}}>Change Password</p>
                                <p className="text-[var(--Paragraph)] text-sm">
                                Update your password associated with your account
                                </p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 border rounded-md text-[var(--Heading)] text-sm cursor-pointer" onClick={togglePasswordEdit}>
                                <Image alt='edit' src={'/Edit.png'} width={16} height={16}/> {isEditingPassword ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        <FormInput
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Your password"
                            required
                            readOnly={!isEditingPassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2-Step Verification Section */}
                <div className="border border-[var(--Outline)] rounded-xl p-4 flex items-center justify-between">
                    <div className='max-w-2/3'>
                        <p className="text-[var(--Heading)] font-semibold text-[16px] mb-1">2-Step Verification</p>
                        <p className="text-[var(--Paragraph)] text-sm">
                            Add a security layer to your account during login
                        </p>
                    </div>
                    {/* Toggle switch - placeholder */}
                    <div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer dark:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--Heading)]" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="border border-[var(--Outline)] rounded-xl p-4 flex sm:flex-row flex-col sm:items-center sm:justify-between max-sm:gap-3">
                <div className='sm:max-w-2/3'>
                    <p className="text-[var(--Heading)] font-semibold text-[16px] mb-1">Delete your data and account</p>
                    <p className="text-[var(--Paragraph)] text-sm">
                        Permanently delete your data and everything associated with your account
                    </p>
                </div>
                <button className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition max-h-[40px] cursor-pointer">
                Delete Account
                </button>
            </div>
        </div>
    );
};

export default SecurityTab;
