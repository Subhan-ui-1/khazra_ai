'use client';

import { ChangeEvent, FormEvent } from 'react';

type ReportType = 'GRI' | 'IFRS';

export interface ReportFormData {
    name: string;
    industry: string;
    location: string;
    year: string;
    revenue: number | string;
    emissions: number | string;
    goal: string;
    contact: string;
    periodFrequency: string;
    inauguralOrSubsequent: string;
    reportingStandards: string;
    externalAuditorAppointed: string;
    leadershipTitle: string;
    board: string;
    committeeName: string;
    specificTrainingsProvided: string;
    policiesName: string;
    workshopsConducted: string;
    sustainabilityRisksAndOpportunities: string;
    energySource: string;
    sectorIndustryName: string;
    externalConsultants: string;
    benchmarkDetail: string;
    kpis: string;
    dataMonitoringSystems: string;
    ipccAndIea: string;
    physicalRisksScenarios: string;
    selectedBusinessSite: string;
    transitionRiskScenarios: string;
    innovativeFacility: string;
    toolsUsed: string;
    reportingPeriod: string;
    companyName: string;
    departmentsNames: string;
    contactDetails: string;
}

interface ReportModalProps {
    type: ReportType;
    onClose: () => void;
    onSubmit: (data: ReportFormData & { type: ReportType }) => void;
    data: ReportFormData;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isVisible: boolean;
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
];

const TextInput = ({
    label,
    name,
    value,
    onChange,
    required = false,
    type = 'text',
    placeholder = ''
}: {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    type?: string,
    placeholder?: string
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
            required={required}
            placeholder={placeholder}
        />
    </div>
);

const SelectInput = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    placeholder = ''
}: {
    label: string,
    name: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    options: string[],
    required?: boolean,
    placeholder?: string
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-0"
            required={required}
        >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

export default function ReportModal({ type, onClose, onSubmit, data, handleChange }: ReportModalProps) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ ...data, type });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-6 md:p-8 overflow-y-auto max-h-[90vh] relative no-scrollbar">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-6">Generate {type} Report</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextInput label="Period Frequency" name="periodFrequency" value={data.periodFrequency} onChange={handleChange} required />
                        <TextInput label="Inaugural or Subsequent" name="inauguralOrSubsequent" value={data.inauguralOrSubsequent} onChange={handleChange} required />
                        <TextInput label="Reporting Standards" name="reportingStandards" value={data.reportingStandards} onChange={handleChange} required />
                        <TextInput label="External Auditor Appointed" name="externalAuditorAppointed" value={data.externalAuditorAppointed} onChange={handleChange} required />
                        <TextInput label="Leadership Title" name="leadershipTitle" value={data.leadershipTitle} onChange={handleChange} required />
                        <TextInput label="Board" name="board" value={data.board} onChange={handleChange} required />
                        <TextInput label="Committee Name" name="committeeName" value={data.committeeName} onChange={handleChange} required />
                        <TextInput label="Specific Trainings Provided" name="specificTrainingsProvided" value={data.specificTrainingsProvided} onChange={handleChange} required />
                        <TextInput label="Policies Name" name="policiesName" value={data.policiesName} onChange={handleChange} required />
                        <TextInput label="Workshops Conducted" name="workshopsConducted" value={data.workshopsConducted} onChange={handleChange} required />
                        <TextInput label="Sustainability Risks And Opportunities" name="sustainabilityRisksAndOpportunities" value={data.sustainabilityRisksAndOpportunities} onChange={handleChange} required />
                        <TextInput label="Energy Source" name="energySource" value={data.energySource} onChange={handleChange} required />
                        <TextInput label="Sector Industry Name" name="sectorIndustryName" value={data.sectorIndustryName} onChange={handleChange} required />
                        <TextInput label="External Consultants" name="externalConsultants" value={data.externalConsultants} onChange={handleChange} required />
                        <TextInput label="Benchmark Detail" name="benchmarkDetail" value={data.benchmarkDetail} onChange={handleChange} required />
                        <TextInput label="KPIs" name="kpis" value={data.kpis} onChange={handleChange} required />
                        <TextInput label="Data Monitoring Systems" name="dataMonitoringSystems" value={data.dataMonitoringSystems} onChange={handleChange} required />
                        <TextInput label="IPCC and IEA" name="ipccAndIea" value={data.ipccAndIea} onChange={handleChange} required />
                        <TextInput label="Physical Risks Scenarios" name="physicalRisksScenarios" value={data.physicalRisksScenarios} onChange={handleChange} required />
                        <TextInput label="Selected Business Site" name="selectedBusinessSite" value={data.selectedBusinessSite} onChange={handleChange} required />
                        <TextInput label="Transition Risk Scenarios" name="transitionRiskScenarios" value={data.transitionRiskScenarios} onChange={handleChange} required />
                        <TextInput label="Innovative Facility" name="innovativeFacility" value={data.innovativeFacility} onChange={handleChange} required />
                        <TextInput label="Tools Used" name="toolsUsed" value={data.toolsUsed} onChange={handleChange} required />
                        <TextInput label="Reporting Period" name="reportingPeriod" value={data.reportingPeriod} onChange={handleChange} required />
                        <TextInput label="Company Name" name="companyName" value={data.companyName} onChange={handleChange} required />
                        <TextInput label="Departments Names" name="departmentsNames" value={data.departmentsNames} onChange={handleChange} required />
                        <TextInput label="Contact Details" name="contactDetails" value={data.contactDetails} onChange={handleChange} required />
                        <SelectInput label="Industry" name="industry" value={data.industry} onChange={handleChange} options={industries} required />
                    </div>

                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                            Generate Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
