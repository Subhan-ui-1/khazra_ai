'use client';
import { useState } from 'react';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: any) => void;
}

export default function AddEntryModal({ isOpen, onClose, onSave }: AddEntryModalProps) {
    const [formData, setFormData] = useState({
        timestamp: '',
        source: '',
        type: '',
        value: '',
        score: '',
        status: 'Select Status'
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formData);
        onClose();
        setFormData({
        timestamp: '',
        source: '',
        type: '',
        value: '',
        score: '',
        status: 'Processing'
        });
    };

    const placeholders: Record<string, string> = {
        timestamp: 'e.g., 2025-07-31 14:30',
        source: 'e.g., Sensor A / API / Manual',
        type: 'e.g., CO2, CH4, Scope 2, etc.',
        value: 'e.g., 1450',
        score: 'e.g., 85'
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-500/50 overflow-auto no-scrollbar h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-green-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">Add New Data Entry</h2>
                <button
                    onClick={onClose}
                    className="text-green-600 hover:text-red-500 text-3xl leading-none"
                >
                    ×
                </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {['timestamp', 'source', 'type', 'value', 'score'].map((field) => (
                    <div key={field}>
                        <label className="block text-sm text-green-800 font-medium mb-1 capitalize">
                        {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                        type="text"
                        name={field}
                        placeholder={placeholders[field]}
                        value={(formData as any)[field]}
                        onChange={handleChange}
                        required
                        className="w-full border border-green-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />
                    </div>
                    ))}

                    <div className="md:col-span-2">
                    <label className="block text-sm text-green-800 font-medium mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full border border-green-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    >
                        <option value="">Select status</option>
                        <option value="Validated">Validated</option>
                        <option value="Processing">Processing</option>
                        <option value="Review">Review</option>
                    </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-green-100 mt-4">
                    <button
                    type="button"
                    onClick={onClose}
                    className="text-green-800 px-5 py-2 border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="bg-green-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                    >
                    Save Entry
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}
