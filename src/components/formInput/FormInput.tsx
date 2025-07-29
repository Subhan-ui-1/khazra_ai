// components/FormInput.tsx
'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";

const countries = [
    { code: '+1', label: 'US', flag: '/us-flag.svg' },
    { code: '+44', label: 'UK', flag: '/us-flag.svg' },
    { code: '+92', label: 'PK', flag: '/us-flag.svg' },
];

type FormInputProps = {
    label?: string;
    type?: 'text' | 'email' | 'textarea' | 'select' | 'tel' | 'password';
    name: string;
    placeholder?: string;
    iconSrc?: string;
    options?: string[]; 
    required?: boolean;
    flag?: string;
    fullWidth?: boolean;
    value?: string;
    readOnly?:boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

const FormInput = ({
    label,
    type = 'text',
    name,
    placeholder = '',
    iconSrc,
    options = [],
    required = false,
    flag,
    fullWidth = false,
    value,
    onChange,
    readOnly = false,
}: FormInputProps) => {
    const [selected, setSelected] = useState(countries[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <div className={`flex flex-col w-full`}>
            {label && (
                <label htmlFor={name} className="mb-1" style={{fontSize: 'var(--P2-size)', fontWeight: 'var(--H3-weight))'}}>
                    {label}{required && '*'}
                </label>
            )}

            {/* Phone Input */}
            {type === 'tel' && (
                <div className="relative">
                    <div className="flex border border-[var(--Outline)] rounded-lg overflow-hidden bg-white">
                        {/* Flag & Dropdown */}
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 px-2 py-3 border-r border-[var(--Outline)]"
                            style={{fontSize: 'var(--P2-size)'}}
                        >
                        <Image src={selected.flag} alt={selected.label} width={20} height={14} />
                            <MdKeyboardArrowDown className="w-4 h-4" />
                        </button>

                        {/* Input */}
                        <input
                            type="number" 
                            placeholder="Enter your number"
                            className="flex-1 px-3 py-1.5 outline-none"
                            value={value}
                            onChange={onChange}
                            style={{fontSize: 'var(--P2-size)'}}
                        />
                    </div>

                    {/* Dropdown List */}
                    {showDropdown && (
                        <ul className="absolute z-10 mt-1 w-auto bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto">
                        {countries.map((country) => (
                            <li
                                key={country.code}
                                onClick={() => {
                                    setSelected(country);
                                    setShowDropdown(false);
                                }
                            }
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                            style={{fontSize: 'var(--P2-size)'}}
                            >
                                <Image src={country.flag} alt={country.label} width={18} height={14} />
                                <span className='text-sm'>{country.label}</span>
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
            )}

            {/* Select Input */}
            {type === 'select' && (
                <div className="flex border border-[var(--Outline)] rounded-lg overflow-hidden px-1 bg-white">
                    <select
                        name={name}
                        required={required}
                        className="input outline-0 w-full text-[#969998] py-2.5"
                        style={{fontSize: 'var(--P2-size)'}}
                    >
                        <option className='' value="">{placeholder || 'Select option'}</option>
                        {options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Textarea */}
            {type === 'textarea' && (
                <textarea
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    className="w-full border border-[var(--Outline)] rounded-md px-3 py-2 h-32 outline-none resize-none text-[var(--P2-size)]"
                    value={value}
                    onChange={onChange}
                />
            )}

            {/* Default input types */}
            {(type === 'text' || type === 'email' || type === 'password') && !flag && !options.length && (
                <div className="flex items-center border border-[var(--Outline)] rounded-lg px-3 py-2.5 gap-3 bg-white w-full">
                    {iconSrc && (
                        <img src={iconSrc} className="w-6 h-6 text-[#969998]" alt="icon" />
                    )}
                    <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        className="w-full outline-none text-[var(--P2-size)]"
                        style={{color: 'text-[#969998]'}}
                        value={value}
                        readOnly={readOnly}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
};

export default FormInput;
