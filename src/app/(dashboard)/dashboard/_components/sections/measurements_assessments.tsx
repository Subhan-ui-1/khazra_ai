import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie } from 'recharts';
import { Users, Target, TrendingUp, AlertCircle, CheckCircle, FileText, Settings, ChevronRight, ChevronDown, Edit3, Save, Eye, Filter } from 'lucide-react';

type AssessmentType = 'impactAssessment' | 'financialAssessment';


const MaterialityAssessmentEngine = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [assessmentMode, setAssessmentMode] = useState('overview'); // 'overview', 'assess', 'results'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'assessed', 'material', 'non-material'
    const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'Environmental', 'Economic', 'Social', 'Governance'
    const [expandedSections, setExpandedSections] = useState({});

  // Comprehensive topic database with assessment states - all 40 topics from the provided list
    const [topics, setTopics] = useState([
        // Environmental Topics (1-10)
        {
        id: 1,
        name: "Climate Change (GHG Emissions)",
        griStandard: "GRI 305",
        ifrsAlignment: "IFRS S2",
        disclosureFramework: "GRI 305, IFRS S2, TCFD",
        sector: "All Sectors",
        category: "Environmental",
        description: "Direct and indirect greenhouse gas emissions and climate-related impacts",
        impactAssessment: {
            scale: 9, scope: 8, irremediableCharacter: 7, likelihood: 9, overallScore: 8.25
        },
        financialAssessment: {
            cashFlowImpact: 9, accessToFinance: 8, costOfCapital: 8, timeHorizon: 9, overallScore: 8.5
        },
        stakeholderConcern: 9, assessmentComplete: true, lastAssessed: "2025-01-15", assessedBy: "Sustainability Team",
        rationale: "High regulatory focus, significant operational impact, strong investor interest"
        },
        {
        id: 2,
        name: "Energy Consumption & Efficiency",
        griStandard: "GRI 302",
        ifrsAlignment: "IFRS S2",
        disclosureFramework: "GRI 302, IFRS S2",
        sector: "All Sectors",
        category: "Environmental",
        description: "Energy consumption, efficiency, and transition to renewables",
        impactAssessment: {
            scale: 7, scope: 6, irremediableCharacter: 4, likelihood: 8, overallScore: 6.25
        },
        financialAssessment: {
            cashFlowImpact: 7, accessToFinance: 6, costOfCapital: 6, timeHorizon: 8, overallScore: 6.75
        },
        stakeholderConcern: 7, assessmentComplete: true, lastAssessed: "2025-01-10", assessedBy: "Operations Team",
        rationale: "Direct cost implications, regulatory requirements, efficiency opportunities"
        },
        {
        id: 3,
        name: "Water Use & Management",
        griStandard: "GRI 303",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 303, IFRS S1",
        sector: "Manufacturing",
        category: "Environmental",
        description: "Water consumption, discharge, and watershed impacts",
        impactAssessment: { scale: 6, scope: 5, irremediableCharacter: 6, likelihood: 7, overallScore: 6.0 },
        financialAssessment: { cashFlowImpact: 5, accessToFinance: 4, costOfCapital: 3, timeHorizon: 6, overallScore: 4.5 },
        stakeholderConcern: 6, assessmentComplete: true, lastAssessed: "2025-01-08", assessedBy: "Environmental Team",
        rationale: "Regional water stress, local community concerns, moderate financial impact"
        },
        {
        id: 4,
        name: "Waste Management",
        griStandard: "GRI 306",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 306, IFRS S1",
        sector: "All Sectors",
        category: "Environmental",
        description: "Waste generation, management, and circular economy practices",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 5,
        name: "Biodiversity & Land Use",
        griStandard: "GRI 304",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 304, IFRS S1, TNFD",
        sector: "Agriculture, Mining",
        category: "Environmental",
        description: "Biodiversity impacts, land use, and ecosystem services",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 6,
        name: "Pollution (Air, Water, Soil)",
        griStandard: "GRI 305, 306",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 305, GRI 306, IFRS S1",
        sector: "All Sectors",
        category: "Environmental",
        description: "Pollution prevention, control, and environmental impact management",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 7,
        name: "Circular Economy & Resource Use",
        griStandard: "GRI 301",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 301, IFRS S1",
        sector: "All Sectors",
        category: "Environmental",
        description: "Resource efficiency, circular economy principles, and material use",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 8,
        name: "Climate Adaptation & Resilience",
        griStandard: "GRI 201-2",
        ifrsAlignment: "IFRS S2",
        disclosureFramework: "GRI 201-2, IFRS S2, TCFD",
        sector: "All Sectors",
        category: "Environmental",
        description: "Climate adaptation strategies and business resilience",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 9,
        name: "Environmental Compliance",
        griStandard: "GRI 307",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 307, IFRS S1",
        sector: "All Sectors",
        category: "Environmental",
        description: "Compliance with environmental laws and regulations",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 10,
        name: "Emissions in Supply Chain",
        griStandard: "GRI 305",
        ifrsAlignment: "IFRS S2",
        disclosureFramework: "GRI 305 (Scope 3), IFRS S2",
        sector: "All Sectors",
        category: "Environmental",
        description: "Supply chain emissions and value chain sustainability",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        // Economic Topics (11-20)
        {
        id: 11,
        name: "Economic Value Distribution",
        griStandard: "GRI 201",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 201, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Economic value generation, distribution, and stakeholder value creation",
        impactAssessment: { scale: 5, scope: 4, irremediableCharacter: 2, likelihood: 8, overallScore: 4.75 },
        financialAssessment: { cashFlowImpact: 9, accessToFinance: 8, costOfCapital: 7, timeHorizon: 9, overallScore: 8.25 },
        stakeholderConcern: 9, assessmentComplete: true, lastAssessed: "2025-01-12", assessedBy: "Finance Team",
        rationale: "Core business performance, directly relevant to all financial stakeholders"
        },
        {
        id: 12,
        name: "Innovation & Green Technology",
        griStandard: "GRI 201",
        ifrsAlignment: "IFRS S1/S2",
        disclosureFramework: "GRI 201, IFRS S1, IFRS S2",
        sector: "All Sectors",
        category: "Economic",
        description: "Investment in sustainable innovation and green technology development",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 13,
        name: "Responsible Supply Chain",
        griStandard: "GRI 204, 308, 414",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 204, GRI 308, GRI 414, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Supply chain sustainability, responsible procurement, and supplier assessment",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 14,
        name: "Tax Transparency & Fairness",
        griStandard: "GRI 207",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 207, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Tax strategy, transparency, and fair tax practices",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 15,
        name: "Anti-Corruption & Fair Competition",
        griStandard: "GRI 205, 206",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 205, GRI 206, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Anti-corruption measures, fair competition, and business integrity",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 16,
        name: "Infrastructure Investment",
        griStandard: "GRI 203",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 203, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Infrastructure development and indirect economic impacts",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 17,
        name: "Product Lifecycle Sustainability",
        griStandard: "GRI 301, 416, 417",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 301, GRI 416, GRI 417, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Sustainable product design, lifecycle assessment, and product responsibility",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 18,
        name: "Financial Sustainability",
        griStandard: "GRI 201",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 201, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Long-term financial viability and sustainable business models",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 19,
        name: "Local Economic Impact",
        griStandard: "GRI 203, 204",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 203, GRI 204, IFRS S1",
        sector: "All Sectors",
        category: "Economic",
        description: "Local economic development and community economic impact",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 20,
        name: "Cost of Environmental Risk",
        griStandard: "GRI 201-2",
        ifrsAlignment: "IFRS S1/S2",
        disclosureFramework: "GRI 201-2, IFRS S1, IFRS S2, TCFD",
        sector: "All Sectors",
        category: "Economic",
        description: "Financial implications of environmental risks and climate change",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        // Social Topics (21-30)
        {
        id: 21,
        name: "Human Rights & Labor Rights",
        griStandard: "GRI 406, 407, 408, 409",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 406, GRI 407, GRI 408, GRI 409, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Human rights protection, labor rights, and fundamental freedoms",
        impactAssessment: { scale: 8, scope: 7, irremediableCharacter: 5, likelihood: 6, overallScore: 6.5 },
        financialAssessment: { cashFlowImpact: 6, accessToFinance: 4, costOfCapital: 5, timeHorizon: 7, overallScore: 5.5 },
        stakeholderConcern: 8, assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 22,
        name: "Diversity, Equity & Inclusion",
        griStandard: "GRI 405",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 405, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Workplace diversity, equity, inclusion, and non-discrimination",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 23,
        name: "Occupational Health & Safety",
        griStandard: "GRI 403",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 403, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Workplace health and safety management and performance",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 24,
        name: "Employee Training & Development",
        griStandard: "GRI 404",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 404, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Employee development, training, and career advancement",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 25,
        name: "Community Engagement & Impact",
        griStandard: "GRI 413",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 413, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Community relations, engagement, and local impact management",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 26,
        name: "Customer Health & Product Safety",
        griStandard: "GRI 416, 417",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 416, GRI 417, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Product safety, customer health, and responsible marketing",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 27,
        name: "Access to Essential Services",
        griStandard: "GRI 203",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 203, IFRS S1",
        sector: "Utilities, Healthcare",
        category: "Social",
        description: "Access to essential services and social infrastructure",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 28,
        name: "Digital Inclusion & Data Privacy",
        griStandard: "GRI 418",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 418, IFRS S1",
        sector: "Technology",
        category: "Social",
        description: "Digital inclusion, data privacy, and cybersecurity",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 29,
        name: "Fair Wages & Social Protection",
        griStandard: "GRI 202, 401",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 202, GRI 401, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Fair compensation, benefits, and social protection",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 30,
        name: "Social License to Operate",
        griStandard: "GRI 413",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 413, IFRS S1",
        sector: "All Sectors",
        category: "Social",
        description: "Social acceptance and legitimacy of business operations",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        // Governance Topics (31-40)
        {
        id: 31,
        name: "ESG Governance & Oversight",
        griStandard: "GRI 2-9 to 2-11",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 2-9, GRI 2-10, GRI 2-11, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "ESG governance structure, oversight, and management",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 32,
        name: "Board Diversity & Effectiveness",
        griStandard: "GRI 405",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 405, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Board composition, diversity, and effectiveness",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 33,
        name: "Executive Remuneration & ESG",
        griStandard: "GRI 2-19 to 2-21",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 2-19, GRI 2-20, GRI 2-21, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Executive compensation and ESG performance linkage",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 34,
        name: "Business Ethics & Integrity",
        griStandard: "GRI 2-23 to 2-27",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 2-23, GRI 2-24, GRI 2-25, GRI 2-26, GRI 2-27, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Business conduct, ethics, and integrity management",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 35,
        name: "Transparency & Sustainability Reporting",
        griStandard: "GRI 2-3",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 2-3, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Reporting transparency, disclosure quality, and stakeholder communication",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 36,
        name: "Stakeholder Engagement & Rights",
        griStandard: "GRI 2-29",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 2-29, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Stakeholder engagement processes and stakeholder rights",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 37,
        name: "Risk Management (including ESG)",
        griStandard: "GRI 2-12",
        ifrsAlignment: "IFRS S1/S2",
        disclosureFramework: "GRI 2-12, IFRS S1, IFRS S2",
        sector: "All Sectors",
        category: "Governance",
        description: "Enterprise risk management including ESG risks",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 38,
        name: "Political Involvement & Lobbying",
        griStandard: "GRI 415",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 415, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Political contributions, lobbying activities, and public policy engagement",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 39,
        name: "Compliance with Laws & Standards",
        griStandard: "GRI 2-27",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 2-27, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Legal compliance and adherence to international standards",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        },
        {
        id: 40,
        name: "Cybersecurity & Information Governance",
        griStandard: "GRI 418",
        ifrsAlignment: "IFRS S1",
        disclosureFramework: "GRI 418, IFRS S1",
        sector: "All Sectors",
        category: "Governance",
        description: "Information security, cybersecurity, and data governance",
        impactAssessment: null, financialAssessment: null, stakeholderConcern: 0,
        assessmentComplete: false, lastAssessed: null, assessedBy: null, rationale: ""
        }
    ]);

    const calculateMaterialityLevel = (topic: { id: number; name: string; griStandard: string; ifrsAlignment: string; disclosureFramework: string; sector: string; category: string; description: string; impactAssessment: { scale: number; scope: number; irremediableCharacter: number; likelihood: number; overallScore: number; }; financialAssessment: { cashFlowImpact: number; accessToFinance: number; costOfCapital: number; timeHorizon: number; overallScore: number; }; stakeholderConcern: number; assessmentComplete: boolean; lastAssessed: string; assessedBy: string; rationale: string; } | { id: number; name: string; griStandard: string; ifrsAlignment: string; disclosureFramework: string; sector: string; category: string; description: string; impactAssessment: null; financialAssessment: null; stakeholderConcern: number; assessmentComplete: boolean; lastAssessed: null; assessedBy: null; rationale: string; } | { id: number; name: string; griStandard: string; ifrsAlignment: string; disclosureFramework: string; sector: string; category: string; description: string; impactAssessment: { scale: number; scope: number; irremediableCharacter: number; likelihood: number; overallScore: number; }; financialAssessment: { cashFlowImpact: number; accessToFinance: number; costOfCapital: number; timeHorizon: number; overallScore: number; }; stakeholderConcern: number; assessmentComplete: boolean; lastAssessed: null; assessedBy: null; rationale: string; }) => {
        if (!topic.assessmentComplete) return { level: "Not Assessed", color: "bg-gray-400", priority: 0 };
        
        const impactScore = topic.impactAssessment?.overallScore || 0;
        const financialScore = topic.financialAssessment?.overallScore || 0;
        const maxScore = Math.max(impactScore, financialScore);
        
        if (maxScore >= 7) return { level: "High Material", color: "bg-red-500", priority: 3 };
        if (maxScore >= 5) return { level: "Medium Material", color: "bg-yellow-500", priority: 2 };
        if (maxScore >= 3) return { level: "Low Material", color: "bg-blue-500", priority: 1 };
        return { level: "Not Material", color: "bg-gray-400", priority: 0 };
    };

    const updateTopicAssessment = (topicId: number | null, assessmentType: string, criteria: string, value: number) => {
        setTopics(prev => prev.map(topic => {
        if (topic.id === topicId) {
            const updatedAssessment = {
            ...(topic as any)[assessmentType],
            [criteria]: value
            };
            
            // Calculate overall score
            const scores = Object.values(updatedAssessment).filter(v => typeof v === 'number');
            updatedAssessment.overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            
            return {
            ...topic,
            [assessmentType]: updatedAssessment
            };
        }
        return topic;
        }));
    };

    const completeTopicAssessment = (topicId: number | null, rationale: string) => {
        setTopics(prev => prev.map(topic => 
        topic.id === topicId 
            ? { 
                ...topic, 
                assessmentComplete: true,
                lastAssessed: new Date().toISOString().split('T')[0],
                assessedBy: "Current User",
                rationale
            }
            : topic
        ));
    };

  const filteredTopics = topics.filter(topic => {
    // Filter by status
    let statusMatch = true;
    switch (filterStatus) {
      case 'assessed': statusMatch = topic.assessmentComplete; break;
      case 'material': 
        const matLevel = calculateMaterialityLevel(topic);
        statusMatch = matLevel.priority > 0; break;
      case 'non-material':
        const nonMatLevel = calculateMaterialityLevel(topic);
        statusMatch = topic.assessmentComplete && nonMatLevel.priority === 0; break;
      default: statusMatch = true;
    }
    
    // Filter by category
    const categoryMatch = filterCategory === 'all' || topic.category === filterCategory;
    
    return statusMatch && categoryMatch;
  });

  const materialTopics = topics.filter(topic => {
    const matLevel = calculateMaterialityLevel(topic);
    return matLevel.priority > 0;
  });

  const assessedTopics = topics.filter(topic => topic.assessmentComplete);

  const TopicOverview = () => (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-600">{topics.length}</div>
          <div className="text-sm text-gray-600">Total Topics</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-green-600">{assessedTopics.length}</div>
          <div className="text-sm text-gray-600">Assessed</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-red-600">{materialTopics.length}</div>
          <div className="text-sm text-gray-600">Material Topics</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-purple-600">
            {Math.round((assessedTopics.length / topics.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Progress</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Environmental', 'Economic', 'Social', 'Governance'].map(category => {
          const categoryTopics = topics.filter(t => t.category === category);
          const categoryAssessed = categoryTopics.filter(t => t.assessmentComplete);
          const categoryMaterial = categoryTopics.filter(t => calculateMaterialityLevel(t).priority > 0);
          
          return (
            <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-center mb-2">{category}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{categoryTopics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assessed:</span>
                  <span className="font-medium text-green-600">{categoryAssessed.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="font-medium text-red-600">{categoryMaterial.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <Filter size={16} className="text-gray-500" />
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Topics</option>
              <option value="assessed">Assessed Only</option>
              <option value="material">Material Topics</option>
              <option value="non-material">Non-Material Topics</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Category:</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Categories</option>
              <option value="Environmental">Environmental</option>
              <option value="Economic">Economic</option>
              <option value="Social">Social</option>
              <option value="Governance">Governance</option>
            </select>
          </div>
          
          <span className="text-sm text-gray-600">
            Showing {filteredTopics.length} of {topics.length} topics
          </span>
        </div>
      </div>

      {/* Topics List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Material Topics Assessment</h3>
        </div>
        <div className="divide-y">
          {filteredTopics.map((topic) => {
            const materiality = calculateMaterialityLevel(topic);
            return (
              <div key={topic.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{topic.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs text-white ${materiality.color}`}>
                        {materiality.level}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{topic.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span><strong>Frameworks:</strong> {topic.disclosureFramework}</span>
                      <span><strong>Sector:</strong> {topic.sector}</span>
                      {topic.lastAssessed && (
                        <span><strong>Last assessed:</strong> {topic.lastAssessed}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {topic.assessmentComplete && (
                      <button
                        onClick={() => {
                          setSelectedTopic(topic.id);
                          setAssessmentMode('results');
                        }}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                      >
                        <Eye size={14} className="inline mr-1" />
                        View
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setAssessmentMode('assess');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Edit3 size={14} className="inline mr-1" />
                      {topic.assessmentComplete ? 'Edit' : 'Assess'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TopicAssessment = () => {
    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic) return null;

    const [localRationale, setLocalRationale] = useState(topic.rationale || '');

    const impactCriteria = [
      { key: 'scale', name: 'Scale', description: 'How significant is the impact?' },
      { key: 'scope', name: 'Scope', description: 'How widespread is the impact?' },
      { key: 'irremediableCharacter', name: 'Irremediable Character', description: 'How difficult to counteract?' },
      { key: 'likelihood', name: 'Likelihood', description: 'Probability of occurrence?' }
    ];

    const financialCriteria = [
      { key: 'cashFlowImpact', name: 'Cash Flow Impact', description: 'Effect on future cash flows' },
      { key: 'accessToFinance', name: 'Access to Finance', description: 'Impact on financing availability' },
      { key: 'costOfCapital', name: 'Cost of Capital', description: 'Effect on capital costs' },
      { key: 'timeHorizon', name: 'Time Horizon', description: 'Short, medium, long-term effects' }
    ];

    return (
      <div className="space-y-6">
        {/* Topic Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{topic.name}</h2>
              <p className="text-gray-600 mt-1">{topic.description}</p>
              <div className="flex space-x-4 mt-2">
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">{topic.griStandard}</span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded">{topic.ifrsAlignment}</span>
                <span className="text-sm bg-purple-100 px-2 py-1 rounded text-xs">{topic.category}</span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600"><strong>Disclosure Frameworks:</strong> {topic.disclosureFramework}</span>
              </div>
            </div>
            <button
              onClick={() => setAssessmentMode('overview')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back to Overview
            </button>
          </div>
        </div>

        {/* Dual Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Impact Materiality (GRI) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              Impact Materiality Assessment (GRI)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Assess the organization's most significant impacts on economy, environment, and people
            </p>
            
            <div className="space-y-6">
              {impactCriteria.map((criteria) => (
                <div key={criteria.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">{criteria.name}</label>
                    <span className="text-sm font-bold text-blue-600">
                      {topic.impactAssessment?.[criteria.key] || 0}/10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{criteria.description}</p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={topic.impactAssessment?.[criteria.key] || 0}
                    onChange={(e) => updateTopicAssessment(
                      selectedTopic, 
                      'impactAssessment', 
                      criteria.key, 
                      parseInt(e.target.value)
                    )}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Impact Score:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {topic.impactAssessment?.overallScore?.toFixed(1) || '0.0'}/10
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Materiality (IFRS) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              Financial Materiality Assessment (IFRS)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Assess information that could influence investor and stakeholder decisions
            </p>
            
            <div className="space-y-6">
              {financialCriteria.map((criteria) => (
                <div key={criteria.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">{criteria.name}</label>
                    <span className="text-sm font-bold text-green-600">
                      {topic.financialAssessment?.[criteria.key] || 0}/10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{criteria.description}</p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={topic.financialAssessment?.[criteria.key] || 0}
                    onChange={(e) => updateTopicAssessment(
                      selectedTopic, 
                      'financialAssessment', 
                      criteria.key, 
                      parseInt(e.target.value)
                    )}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Financial Score:</span>
                  <span className="text-lg font-bold text-green-600">
                    {topic.financialAssessment?.overallScore?.toFixed(1) || '0.0'}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Rationale */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Assessment Rationale</h3>
          <textarea
            value={localRationale}
            onChange={(e) => setLocalRationale(e.target.value)}
            placeholder="Provide rationale for this materiality assessment, including key factors considered, stakeholder input, and decision logic..."
            className="w-full h-24 p-3 border rounded-lg resize-none"
          />
        </div>

        {/* Materiality Result */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Materiality Determination</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {topic.impactAssessment?.overallScore?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Impact Score (GRI)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {topic.financialAssessment?.overallScore?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Financial Score (IFRS)</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${calculateMaterialityLevel(topic).color.replace('bg-', 'text-').replace('-500', '-600')}`}>
                {calculateMaterialityLevel(topic).level}
              </div>
              <div className="text-sm text-gray-600">Overall Result</div>
            </div>
          </div>
        </div>

        {/* Save Assessment */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setAssessmentMode('overview')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              completeTopicAssessment(selectedTopic, localRationale);
              setAssessmentMode('results');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save size={16} className="inline mr-2" />
            Save Assessment
          </button>
        </div>
      </div>
    );
  };

  const TopicResults = () => {
    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic || !topic.assessmentComplete) return null;

    const materiality = calculateMaterialityLevel(topic);

    return (
      <div className="space-y-6">
        {/* Topic Results Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{topic.name}</h2>
              <div className={`inline-block px-3 py-1 rounded text-white text-sm mt-2 ${materiality.color}`}>
                {materiality.level}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setAssessmentMode('assess')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Assessment
              </button>
              <button
                onClick={() => setAssessmentMode('overview')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Back to Overview
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Impact Materiality (GRI)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Scale:</span>
                <span className="font-medium">{topic.impactAssessment.scale}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Scope:</span>
                <span className="font-medium">{topic.impactAssessment.scope}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Irremediable Character:</span>
                <span className="font-medium">{topic.impactAssessment.irremediableCharacter}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Likelihood:</span>
                <span className="font-medium">{topic.impactAssessment.likelihood}/10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score:</span>
                <span className="text-blue-600">{topic.impactAssessment.overallScore.toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Financial Materiality (IFRS)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cash Flow Impact:</span>
                <span className="font-medium">{topic.financialAssessment.cashFlowImpact}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Access to Finance:</span>
                <span className="font-medium">{topic.financialAssessment.accessToFinance}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Cost of Capital:</span>
                <span className="font-medium">{topic.financialAssessment.costOfCapital}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Time Horizon:</span>
                <span className="font-medium">{topic.financialAssessment.timeHorizon}/10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score:</span>
                <span className="text-green-600">{topic.financialAssessment.overallScore.toFixed(1)}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Rationale */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Assessment Rationale</h3>
          <p className="text-gray-700">{topic.rationale}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Assessed by: {topic.assessedBy}</p>
            <p>Last assessed: {topic.lastAssessed}</p>
          </div>
        </div>

        {/* Reporting Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">GRI Reporting Requirements</h3>
            {materiality.priority > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span>Material topic - requires full GRI disclosures</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p><strong>Required disclosures:</strong> {topic.disclosureFramework}</p>
                  <p>Must report all disclosures for this material topic</p>
                  <p>Include in GRI Content Index</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <AlertCircle size={16} className="mr-2" />
                <span>Not material - no specific GRI reporting required</span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">IFRS S1/S2 Reporting Requirements</h3>
            {materiality.priority > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span>Material topic - requires IFRS disclosures</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p><strong>Required frameworks:</strong> {topic.disclosureFramework}</p>
                  <p>Include in sustainability-related financial disclosures</p>
                  <p>Must address governance, strategy, risk management, metrics</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <AlertCircle size={16} className="mr-2" />
                <span>Not material - no specific IFRS reporting required</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MaterialityMatrix = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Materiality Matrix - All Assessed Topics</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="impactScore" 
              name="Impact Materiality (GRI)" 
              domain={[0, 10]}
              label={{ value: 'Impact Materiality (GRI)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="financialScore" 
              name="Financial Materiality (IFRS)" 
              domain={[0, 10]}
              label={{ value: 'Financial Materiality (IFRS)', position: 'insideLeft', angle: -90 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm">Impact: {data.impactScore?.toFixed(1)}</p>
                      <p className="text-sm">Financial: {data.financialScore?.toFixed(1)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              name="Topics" 
              data={assessedTopics.map(topic => ({
                ...topic,
                impactScore: topic.impactAssessment?.overallScore || 0,
                financialScore: topic.financialAssessment?.overallScore || 0
              }))} 
              fill="#3B82F6"
            >
              {assessedTopics.map((topic, index) => {
                const materiality = calculateMaterialityLevel(topic);
                let color = '#9CA3AF'; // gray
                if (materiality.color.includes('red')) color = '#EF4444';
                else if (materiality.color.includes('yellow')) color = '#F59E0B';
                else if (materiality.color.includes('blue')) color = '#3B82F6';
                
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Topic-Based Materiality Assessment Engine
          </h1>
          <p className="text-gray-600">
            Individual topic assessment with dual materiality for GRI Standards and IFRS S1/S2 alignment
          </p>
        </div>

        {assessmentMode === 'overview' && (
          <>
            <TopicOverview />
            {assessedTopics.length > 0 && (
              <div className="mt-8">
                <MaterialityMatrix />
              </div>
            )}
          </>
        )}

        {assessmentMode === 'assess' && <TopicAssessment />}
        {assessmentMode === 'results' && <TopicResults />}
      </div>
    </div>
  );
};

export default MaterialityAssessmentEngine;