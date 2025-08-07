// app/report-generation/page.tsx
// 'use client';

import { useState } from 'react';
import ReportModal from './ReportModal';
import Report from './ReportPage';

export interface ReportFormData  {
    industry: string;
    year: string;
    value1: number;
    value2: number;
    value3: number;
    value4: number;
    value5: number;
    value6: number;
}

export default function ReportGeneration() {
    const [type, setType] = useState<'SBTi' | 'IFRSSi' | null>(null);
    const [reportData, setReportData] = useState<FormData | null>(null);

    return (
        <div className="h-screen p-4 relative">
            <h1 className="text-3xl font-bold mb-6">Report Generation</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">SBTi</h2>
                    <p className="text-sm text-gray-600">
                        Science Based Targets initiative helps companies to set emission reduction targets in line with climate science.
                    </p>
                    <button
                        className="mt-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => setType('SBTi')}
                    >
                        Generate Report
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">IFRSSi</h2>
                    <p className="text-sm text-gray-600">
                        International Financial Reporting Sustainability Standards Initiative provides sustainability disclosure guidance.
                    </p>
                    <button
                        className="mt-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => setType('IFRSSi')}
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            {type && (
                <ReportModal
                    type={type}
                    onClose={() => setType(null)}
                    onSubmit={(data) => {
                        setReportData(data);
                        setType(null);
                    } } isVisible={false}                />
            )}

            {reportData && (
                <div className="mt-10">
                    <Report data={reportData} />
                </div>
            )}
        </div>
    );
}
