'use client';

import AuthLayout from '@/components/authLayout/AuthLayout';
import FormInput from '@/components/formInput/FormInput';
import Image from 'next/image';
import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleNavigate = (route: string) => {
        // setLoadingScreen(true);
        router.push(route);
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        // Simulate login action
        setLoadingScreen(true);
        router.push('/dashboard/scope1');
    };

    return (
        <>
            <Navbar />
            <AuthLayout
                heading="Welcome Back"
                description="Glad to see you again—let’s continue your sustainability journey."
                imageSrc={'/Login.png'}
                bottomSlot={
                    <p className="text-center text-[var(--Paragraph)]" style={{ fontSize: "var(--P1-size)" }}>
                        By writing Email above, you acknowledge that you have read and understood,
                        and agree to Khazra.ai{" "}
                        <a href="/terms" className="text-[var(--Primary)] cursor-pointer">Terms & Conditions</a> and{" "}
                        <a href="/privacy" className="text-[var(--Primary)] cursor-pointer">Privacy Policy</a>
                    </p>
                }
            >
                {/* Google Login */}
                {/* <button
                    className="w-full flex items-center justify-center border border-[var(--Outline)] rounded-lg py-3 mb-4 gap-2 cursor-pointer"
                    style={{
                        backgroundColor: 'var(--Placeholder)',
                        fontSize: 'var(--P1-size)',
                        fontWeight: 'var(--P1-weight)',
                    }}
                >
                    <Image src="/google.svg" alt="Google" width={32} height={32} className="md:w-[24px] h-auto w-[20px]" />
                    Continue with Google
                </button> */}

                {/* Divider */}
                {/* <div className="flex items-center mb-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-sm text-gray-400">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div> */}

                {/* Form */}
                <form className="max-w-[500px] w-full mx-auto" onSubmit={handleLogin}>
                    {/* Email */}
                    <div className="mb-4">
                        <FormInput
                            name="email"
                            label="Work Email"
                            type="email"
                            placeholder="Enter your work email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <FormInput
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 bottom-3 text-gray-500"
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="accent-black" />
                            Remember me
                        </label>
                        <button
                            type="button"
                            onClick={() => handleNavigate('/forgetPassword')}
                            className="text-[#0D5942] font-medium cursor-pointer"
                            style={{fontSize: 'var(--P2-size)'}}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full text-[20px] bg-black p-3 rounded-lg hover:opacity-90 cursor-pointer"
                        style={{ color: 'var(--Placeholder)'}}
                    >
                        Login
                    </button>

                    {/* Signup redirect */}
                    <p className="text-center mt-3" style={{ fontSize: 'var(--P2-size)', color: 'var(--Paragraph)' }}>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => handleNavigate('/signup')}
                            className="text-[#0D5942] cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>
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
