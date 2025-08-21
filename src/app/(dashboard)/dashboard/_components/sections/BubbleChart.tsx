'use client';

import { useEffect, useMemo, useState } from 'react';
import { getRequest } from '@/utils/api';
import { safeLocalStorage } from '@/utils/localStorage';

interface Topic {
    id: string;
    name: string;
    griStandard?: string;
    ifrsAlignment?: string;
    disclosureFramework?: string;
    assessmentComplete?: boolean;
    impactAssessment?: { overallScore?: number };
    financialAssessment?: { overallScore?: number };
    [key: string]: any;
}

interface BubbleChartProps {
    assessedTopics: Topic[];
    calculateMaterialityLevel: (topic: Topic) => { color: string };
}

const getToken = () => {
    const token = JSON.parse(safeLocalStorage.getItem('tokens') || '{}')
    return token?.accessToken
}

export default function BubbleChart({
    calculateMaterialityLevel,
}: BubbleChartProps) {
    const [datas, setData] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const response = await getRequest('reporting/getReporting', getToken());
            if (response.success) {
                setData(response.reporting);
            }
        })();
    }, []);

    const chartTopics = useMemo(() => {
        if (!datas) return [];
        return datas.map((item: any, index: number) => ({
            id: index + 1,
            name: item.topicName,
            category: item.category || 'Environmental',
            impactAssessment: { overallScore: item.impactMateriality?.overallImpactScore ?? 0 },
            financialAssessment: { overallScore: item.financialMateriality?.overallFinancialScore ?? 0 },
        }));
    }, [datas]);

    const materialityData = useMemo(() => {
        if (chartTopics.length === 0) {
            return [
                { id: 1, name: "GHG Emissions", category: "Environmental", x: 4.2, y: 4.8 },
                { id: 2, name: "Air Quality", category: "Environmental", x: 3.8, y: 4.5 },
                { id: 3, name: "Waste & Hazardous Materials", category: "Environmental", x: 2.1, y: 2.8 },
                { id: 4, name: "Employee Health & Safety", category: "Social", x: 3.5, y: 3.2 },
                { id: 5, name: "Employee Engagement, Diversity, Inclusion", category: "Social", x: 3.2, y: 3.8 },
                { id: 6, name: "Business Ethics", category: "Governance", x: 4.6, y: 4.3 },
            ];
        }

        return chartTopics.map((topic: any) => ({
            id: topic.id,
            name: topic.name,
            category: topic.category,
            x: Math.min(5, Math.max(1, (topic.impactAssessment?.overallScore || 0) / 4)),
            y: Math.min(5, Math.max(1, (topic.financialAssessment?.overallScore || 0) / 4)),
        }));
    }, [chartTopics]);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Environmental':
                return '#0D9488';
            case 'Social':
                return '#F59E0B';
            case 'Governance':
                return '#6366F1';
            default:
                return '#9CA3AF';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Environmental':
                return '🌱';
            case 'Social':
                return '👥';
            case 'Governance':
                return '⚖️';
            default:
                return '📊';
        }
    };

    return (
        <div className="bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 p-8 rounded-2xl shadow-xl border border-gray-200/70 backdrop-blur-sm">
            {/* Header with enhanced styling */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-500/20 mb-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">Live Assessment</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2">
                    Materiality Matrix
                </h3>
                <p className="text-gray-600 text-lg">
                    Assessment Period 2025 • Frameworks: GRI, SASB, TCFD
                </p>
            </div>

            {/* Enhanced Chart Area */}
            <div className="relative w-full h-[500px] bg-gradient-to-br from-white via-gray-50/80 to-emerald-50/60 border-2 border-gray-200/60 rounded-2xl p-6 shadow-inner overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #0D9488 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>

                {/* Y-axis with numerical labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                    {[5, 4, 3, 2, 1].map((num) => (
                        <div key={`y-${num}`} className="flex items-center h-1/5">
                            <div className="w-4 h-px bg-gray-300 mr-2"></div>
                            <span className="text-xs font-semibold text-gray-600 bg-white/80 px-1 rounded-md">{num}</span>
                        </div>
                    ))}
                </div>

                {/* X-axis with numerical labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div key={`x-${num}`} className="flex flex-col items-center" style={{ width: '20%' }}>
                            <div className="h-4 w-px bg-gray-300 mb-1"></div>
                            <span className="text-xs font-semibold text-gray-600 bg-white/80 px-1 rounded-md">{num}</span>
                        </div>
                    ))}
                </div>

                {/* Enhanced grid lines */}
                <div className="absolute inset-0 pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div 
                            key={`v-${i}`} 
                            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" 
                            style={{ left: `${(i / 5) * 100}%` }} 
                        />
                    ))}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div 
                            key={`h-${i}`} 
                            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" 
                            style={{ top: `${(i / 5) * 100}%` }} 
                        />
                    ))}
                </div>

                {/* Enhanced color-coded regions with gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Very High Importance (top-right) */}
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/15 to-teal-400/10 rounded-tl-2xl" />
                    {/* High Importance (middle curved) */}
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/10 to-teal-400/5 rounded-2xl" />
                    {/* Low/Medium Importance (bottom-left) */}
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-emerald-400/5 to-teal-400/3 rounded-tr-2xl" />
                </div>

                {/* Enhanced data points with category-specific styling */}
                {materialityData.map((point: { id: number; name: string; category: string; x: number; y: number }) => {
                    const categoryColor = getCategoryColor(point.category);
                    return (
                        <div
                            key={point.id}
                            className="absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group"
                            style={{
                                left: `${(point.x / 5) * 100}%`,
                                top: `${(5 - point.y) / 5 * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                width: '3.5rem',
                                height: '3.5rem',
                                background: `radial-gradient(circle at 30% 30%, white, ${categoryColor}40)`,
                                boxShadow: `0 4px 12px ${categoryColor}30, inset 0 1px 3px white`
                            }}
                            title={`${point.name}: Impact ${point.x.toFixed(1)}, Stakeholder ${point.y.toFixed(1)}`}
                        >
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:scale-110"
                                style={{ 
                                    backgroundColor: categoryColor,
                                    boxShadow: `0 2px 8px ${categoryColor}80`
                                }}
                            >
                                {point.id}
                            </div>
                            
                            {/* Enhanced hover tooltip */}
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-2">
                                    <span>{getCategoryIcon(point.category)}</span>
                                    <span>{point.name}</span>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Axis arrows */}
                <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </div>
                </div>
                <div className="absolute bottom-2 right-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>

                {/* Axis titles */}
                <div className="absolute -left-20 top-1/2 transform -rotate-90 origin-center text-sm font-semibold text-gray-700">
                    Importance to Stakeholders
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
                    Business Impact
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-emerald-400/30 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-teal-400/30 rounded-full"></div>
            </div>

            {/* Enhanced legend */}
            <div className="mt-8 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/60">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Materiality Levels</h4>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400/25 to-teal-400/20 rounded-lg"></div>
                            <span className="text-sm font-medium text-gray-700">Very High Importance</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400/20 to-teal-400/15 rounded-lg"></div>
                            <span className="text-sm font-medium text-gray-700">High Importance</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400/15 to-teal-400/10 rounded-lg"></div>
                            <span className="text-sm font-medium text-gray-700">Low/Medium Importance</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Topic Categories</h4>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-sm text-gray-700">Environmental</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-sm text-gray-700">Social</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                <span className="text-sm text-gray-700">Governance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}