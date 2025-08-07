'use client';

import { Bubble } from 'react-chartjs-2';
import {Chart as ChartJS,Tooltip,Title,Legend,LinearScale,PointElement,} from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { getRequest } from '@/utils/api';
import { Wifi } from 'lucide-react';
import { safeLocalStorage } from '@/utils/localStorage';

ChartJS.register(Tooltip, Title, Legend, LinearScale, PointElement);

interface Topic {
    id: string;
    name: string;
    griStandard?: string;
    ifrsAlignment?: string;
    disclosureFramework?: string;
    assessmentComplete?: boolean;
    impactAssessment?: { overallScore?: number };
    financialAssessment?: { overallScore?: number };
    [key: string]: any; // to avoid further key mismatch errors
}

interface BubbleChartProps {
    assessedTopics: Topic[];
    calculateMaterialityLevel: (topic: Topic) => { color: string };
}
const getToken = ()=>{
    const token = JSON.parse(safeLocalStorage.getItem('tokens') || '{}')
    return token?.accessToken
}

export default function BubbleChart({
    assessedTopics,
    calculateMaterialityLevel,
}: BubbleChartProps) {
    const [datas, setData] = useState<any>(null);
    useEffect(()=>{
        (async()=>{
            const response = await getRequest('reporting/getReporting',getToken())
            if(response.success){
                setData(response.reporting)
            }
        })()
    },[])
    console.log(datas)
    const data = useMemo(() => {
        return {
            datasets: assessedTopics.map((topic) => {
                const x = topic.impactAssessment?.overallScore || 0;
                const y = topic.financialAssessment?.overallScore || 0;

                const topicName = topic.name;
                const materiality = calculateMaterialityLevel(topic);

                let color = '#9CA3AF'; // default gray
                if (materiality.color.includes('red')) color = '#ef4444ad';
                else if (materiality.color.includes('yellow')) color = '#f6b139c8';
                else if (materiality.color.includes('blue')) color = '#3b83f6b7';

                return {
                    label: topicName,
                    data: [{ x, y, r:10, topicName }],
                    backgroundColor: color,
                    borderColor: color,
                };
            }),
        };
    }, [assessedTopics, calculateMaterialityLevel]);

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const { x, y, topicName } = context.raw;
                        return `${topicName}: Impact ${x.toFixed(1)}, Financial ${y.toFixed(1)}`;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                min: 0,
                max: 20,
                title: {
                    display: true,
                    text: 'Impact Materiality (GRI)',
                },
            },
            y: {
                min: 0,
                max: 20,
                title: {
                    display: true,
                    text: 'Financial Materiality (IFRS)',
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Materiality Matrix - All Assessed Topics</h3>
            <Bubble data={data} options={options} />
        </div>
    );
}
