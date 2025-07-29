'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { useState } from 'react';

export default function ContactUs({ onSuccess }: { onSuccess?: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setIsSubmitting(false);
        setIsSuccess(true);
        onSuccess && onSuccess();

        setTimeout(() => {
            setIsSuccess(false);
            setFormData({ name: '', email: '', message: '' }); 
        }, 4500);
    };

    return (
        <>
            <Navbar/>
                <section className="w-full px-4 lg:py-[60px] md:py-[50px] sm:py-[40px] py-[30px] text-[var(--Paragraph)] border-b-2 border-dashed">
                    <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        {/* Left Side */}
                        <div className="md:max-w-[620px] w-full mx-auto">
                            <button className="bg-[var(--Outline)] text-[var(--Heading)] px-6 py-3 rounded-full font-medium mb-6" style={{ fontSize: 'var(--P1-size)' }}>
                                Contact us
                            </button>
                            <h2 className="text-[var(--Heading)] font-bold mb-4" style={{ fontSize: 'var(--H3-size)' }}>
                                Let's talk, we're here.
                            </h2>
                            <p className="mb-6" style={{ fontSize: 'var(--P1-size)' }}>
                                Questions? Send us a message and we will get back to you soon. <br />
                                For customer support, you may also email
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center bg-[var(--Placeholder)] p-3 rounded-xl shadow-sm gap-3">
                                    <div className="w-12 h-12 bg-[var(--Background)] rounded-lg p-3">
                                        <img src="https://res.cloudinary.com/dxxymlo0o/image/upload/v1750142767/mail_xv9phy.svg" className="w-6 h-6" />
                                    </div>
                                    <a href="mailto:khazrasupport@gmail.com" className="text-[var(--Heading)]" style={{ fontSize: 'var(--P1-size)', fontWeight: 'var(--P1-weight)' }}>
                                        khazrasupport@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm gap-3">
                                    <div className="w-12 h-12 bg-[var(--Background)] rounded-lg p-3">
                                        <img src="https://res.cloudinary.com/dxxymlo0o/image/upload/v1750142767/phone_cnnhmw.svg" className="w-6 h-6" />
                                    </div>
                                    <a href="tel:+9212345678910" className="text-[var(--Heading)]" style={{ fontSize: 'var(--P1-size)', fontWeight: 'var(--P1-weight)' }}>
                                        +9212345678910
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl lg:p-8 md:p-6 p-4 shadow-md space-y-5 md:max-w-[580px] w-full min-h-[560px] h-full mx-auto">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-6 h-full w-full">
                                    <div className="w-40 h-40 flex items-center justify-center mb-10">
                                        <DotLottieReact
                                            src="https://lottie.host/f77d59f9-4c4b-4868-a7f2-943fb46df001/D1RSAP0CJF.lottie"
                                            loop
                                            autoplay
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold gradient-text">Thank you!</h3>
                                    <p className="text-xl text-gray-600 mt-1">We’ll be in touch soon.</p>
                                </div>
                            ) : (
                                <>
                                
                                <div>
                                    <label className="block text-[var(--Heading)] mb-2" style={{ fontSize: 'var(--P1-size)', fontWeight: 'var(--P1-weight)' }}>
                                        Full Name*
                                    </label>
                                    <div className="flex items-center border border-[var(--Outline)] rounded-lg p-3 gap-3">
                                        <img src="https://res.cloudinary.com/dxxymlo0o/image/upload/v1750142767/user_ubiktc.svg" className="w-6 h-6" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name..."
                                            className="w-full outline-none text-[var(--P2-size)]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[var(--Heading)] mb-2" style={{ fontSize: 'var(--P1-size)', fontWeight: 'var(--P1-weight)' }}>
                                        Email*
                                    </label>
                                    <div className="flex items-center border border-[var(--Outline)] rounded-lg p-3 gap-3">
                                        <img src="https://res.cloudinary.com/dxxymlo0o/image/upload/v1750142767/mail_xv9phy.svg" className="w-6 h-6" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email..."
                                            className="w-full outline-none text-[var(--P2-size)]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[var(--Heading)] mb-2" style={{ fontSize: 'var(--P1-size)', fontWeight: 'var(--P1-weight)' }}>
                                        Message*
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Enter your message..."
                                        className="w-full border border-[var(--Outline)] rounded-md px-3 py-2 h-40 outline-none resize-none text-[var(--P2-size)]"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[var(--Heading)] text-[var(--Placeholder)] p-3 w-full rounded-md font-medium cursor-pointer disabled:opacity-70"
                                    style={{ fontSize: 'var(--P1-size)' }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                                </>
                            )}
                            </form>
                    </div>
                </section>
            <Footer/>
        </>
    );
}
