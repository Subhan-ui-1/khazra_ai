'use client'

import { useState, ChangeEvent, FormEvent } from 'react'

type ReportType = 'SBTi' | 'IFRSSi'

interface ReportModalProps {
    type: ReportType
    onClose: () => void
    onSubmit: (data: any) => void;
    defaultData?: FormData;
    isVisible: boolean;
}

interface FormData {
    name: string
    industry: string
    location: string
    year: string
    revenue: number | string
    emissions: number | string
    goal: string
    contact: string
}

const industries = [
    'Energy',
    'Manufacturing',
    'Technology',
    'Transportation',
    'Finance',
    'Retail',
    'Healthcare',
    'Agriculture',
]

const generateYearOptions = (start = 2010, end = new Date().getFullYear() + 5) => {
    const years: string[] = []
    for (let y = end; y >= start; y--) {
        years.push(y.toString())
    }
    return years
}

export default function ReportModal({ type, onClose, onSubmit }: ReportModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        industry: '',
        location: '',
        year: '',
        revenue: '',
        emissions: '',
        goal: '',
        contact: '',
    })

    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const parsedValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
        setFormData((prev) => ({ ...prev, [name]: parsedValue }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        onSubmit({ ...formData, type })
        setSubmitting(false)
    }

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-6">Generate {type} Report</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        />
                        </div>

                        {/* Industry */}
                        <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                            Industry *
                        </label>
                        <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        >
                            <option value="">Select Industry</option>
                            {industries.map((ind) => (
                            <option key={ind} value={ind}>
                                {ind}
                            </option>
                            ))}
                        </select>
                        </div>

                        {/* Location */}
                        <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        />
                        </div>

                        {/* Year */}
                        <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                            Year *
                        </label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        >
                            <option value="">Select Year</option>
                            {generateYearOptions().map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                            ))}
                        </select>
                        </div>

                        {/* Revenue */}
                        <div>
                        <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
                            Annual Revenue (in millions) *
                        </label>
                        <input
                            type="number"
                            id="revenue"
                            name="revenue"
                            value={formData.revenue}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        />
                        </div>

                        {/* Emissions */}
                        <div>
                        <label htmlFor="emissions" className="block text-sm font-medium text-gray-700 mb-2">
                            Emissions (in tons CO₂) *
                        </label>
                        <input
                            type="number"
                            id="emissions"
                            name="emissions"
                            value={formData.emissions}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        />
                        </div>

                        {/* Goal */}
                        <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                            Sustainability Goal *
                        </label>
                        <input
                            type="text"
                            id="goal"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        />
                        </div>

                        {/* Contact */}
                        <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Number *
                        </label>
                        <input
                            type="number"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
                            required
                        />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-2">
                        <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200"
                        >
                        Cancel
                        </button>

                        <button
                        type="submit"
                        disabled={submitting}
                        className="bg-green-800 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md flex items-center gap-2"
                        >
                        {submitting ? (
                            <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting...
                            </>
                        ) : (
                            <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Generate Report
                            </>
                        )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
