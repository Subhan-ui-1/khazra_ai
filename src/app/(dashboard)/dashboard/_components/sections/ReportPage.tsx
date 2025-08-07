'use client';

import React, { useState, useRef } from 'react';
import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

interface ReportProps {
    data: {
        name: string;
        industry: string;
        location: string;
        year: string;
        revenue: number;
        emissions: number;
        goal: string;
        contact: string;
        type: string;
    };
    onEdit: () => void;
    onClose: () => void;
    viewMode: 'full' | 'half';
}

export default function ReportParagraph({ data, onEdit, onClose, viewMode }: ReportProps) {
    const [editMode, setEditMode] = useState(false);
    const [customText, setCustomText] = useState<string>(() =>
        generateReport(data)
    );
    const reportRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
        setEditMode(false);
        // Save to backend if needed
    };

    const handleDownloadPDF = async () => {
        if (reportRef.current && typeof window !== 'undefined') {
            try {
                const html2pdf = (await import('html2pdf.js')).default;
                html2pdf().from(reportRef.current).set({
                    margin: 10,
                    filename: 'sustainability-report.pdf',
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                }).save();
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-white shadow-lg rounded-lg p-8 overflow-auto">
            {/* Top Left - Edit/Save */}
            <div className="absolute top-4 left-4 z-10">
                {editMode ? (
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* ❌ Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
                aria-label="Close"
            >
                ×
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-6 text-center">
                Sustainability Report
            </h2>

            {/* Report Content */}
            <div ref={reportRef} className="w-full">
                {editMode ? (
                    <Editor
                        value={customText}
                        onTextChange={(e) => setCustomText(e.htmlValue ?? '')}
                        style={{ height: '400px' }}
                        className="w-full"
                    />
                ) : (
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: customText }}
                    />
                )}
            </div>

            {/* Bottom Left - Save & Download PDF */}
            <div className="absolute bottom-4 left-4 z-10">
                <button
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleDownloadPDF}
                >
                    Save & Download
                </button>
            </div>
        </div>
    );
}

// Generate default report text
function generateReport(data: ReportProps['data']): string {
    return `
        <p>In <strong>${data.year}</strong>, <strong>${data.name}</strong>, a leader in the <strong>${data.industry}</strong> industry based in <strong>${data.location}</strong>, reported a total revenue of <strong>$${data.revenue.toLocaleString()}</strong> and emissions of <strong>${data.emissions} tons</strong>.</p>
        <p>Their sustainability goal is: <em>${data.goal}</em>.</p>
        <p>To achieve this, ${data.name} collaborates with partners across the value chain and actively contributes to building resilient and climate-conscious systems.</p>
        <p>If you'd like to reach out, contact them at <strong>${data.contact}</strong>.</p>
    `;
}
