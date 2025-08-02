import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie } from 'recharts';
import { Users, Target, TrendingUp, AlertCircle, CheckCircle, FileText, Settings, ChevronRight, ChevronDown, Edit3, Save, Eye, Filter, Loader2 } from 'lucide-react';
import { getRequest, postRequest } from '../../../../../utils/api';
import { safeLocalStorage } from '@/utils/localStorage';

// TypeScript interfaces
interface Report {
  _id: string;
  reportName: string;
  reportDescription: string;
  reportCategory: string;
  reportStatus: string;
  frameworks: string;
  sector: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  reports: Report[];
}

// Reporting API interfaces
interface ImpactMateriality {
  scale: number;
  scope: number;
  irremediableCharacter: number;
  likelihood: number;
  overallImpactScore: number;
}

interface FinancialMateriality {
  cashFlowImpact: number;
  accessToFinance: number;
  costOfCapital: number;
  timeHorizon: number;
  overallFinancialScore: number;
}

interface MaterialityDetermination {
  impactScore: number;
  financialScore: number;
  overallResult: string;
}

interface ReportingData {
  reportId: string;
  topicName: string;
  impactMateriality: ImpactMateriality;
  financialMateriality: FinancialMateriality;
  assessmentRationale: string;
  materialityDetermination: MaterialityDetermination;
}

interface ReportingResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface Topic {
  id: number;
  name: string;
  griStandard: string;
  ifrsAlignment: string;
  disclosureFramework: string;
  sector: string;
  category: string;
  description: string;
  impactAssessment: {
    scale: number;
    scope: number;
    irremediableCharacter: number;
    likelihood: number;
    overallScore: number;
  } | null;
  financialAssessment: {
    cashFlowImpact: number;
    accessToFinance: number;
    costOfCapital: number;
    timeHorizon: number;
    overallScore: number;
  } | null;
  stakeholderConcern: number;
  assessmentComplete: boolean;
  lastAssessed: string | null;
  assessedBy: string | null;
  rationale: string;
  reportId?: string; // Add reportId to track which report this topic belongs to
}

interface MaterialityLevel {
  level: string;
  color: string;
  priority: number;
}

const MaterialityAssessmentEngine = () => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [assessmentMode, setAssessmentMode] = useState('overview'); // 'overview', 'assess', 'results'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'assessed', 'material', 'non-material'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'Environmental', 'Economic', 'Social', 'Governance'
  const [expandedSections, setExpandedSections] = useState({});
  
  // API states
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API reports to topics format
  const [topics, setTopics] = useState<Topic[]>([]);

  // Helper function to get token (you may need to adjust this based on your auth implementation)
  const getToken = (): string | undefined => {
    // Implement based on your authentication system
    // For now, returning undefined - adjust as needed
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse = await getRequest('reports/getReports', getToken());
      
      if (response.success) {
        setReports(response.reports);
        
        // Convert API reports to topics format
        const convertedTopics: Topic[] = response.reports.map((report, index) => {
          // Determine if assessment is complete based on status
          const isAssessed = report.reportStatus !== 'Not Assessed';
          
          // Parse frameworks to extract GRI and IFRS standards
          const frameworks = report.frameworks.split(', ');
          const griStandard = frameworks.find(f => f.startsWith('GRI')) || '';
          const ifrsAlignment = frameworks.find(f => f.startsWith('IFRS')) || '';
          
          return {
            id: index + 1,
            name: report.reportName,
            griStandard,
            ifrsAlignment,
            disclosureFramework: report.frameworks,
            sector: report.sector,
            category: report.reportCategory,
            description: report.reportDescription,
            impactAssessment: isAssessed ? {
              scale: 7,
              scope: 6,
              irremediableCharacter: 5,
              likelihood: 7,
              overallScore: 6.25
            } : null,
            financialAssessment: isAssessed ? {
              cashFlowImpact: 6,
              accessToFinance: 5,
              costOfCapital: 5,
              timeHorizon: 6,
              overallScore: 5.5
            } : null,
            stakeholderConcern: isAssessed ? 6 : 0,
            assessmentComplete: isAssessed,
            lastAssessed: isAssessed ? new Date(report.updatedAt).toISOString().split('T')[0] : null,
            assessedBy: isAssessed ? 'API User' : null,
            rationale: isAssessed ? `Assessment completed via API. Status: ${report.reportStatus}` : '',
            reportId: report._id // Store the report ID for API calls
          };
        });
        
        setTopics(convertedTopics);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific reporting data by ID
  const fetchReportingById = async (reportId: string): Promise<ReportingData | null> => {
    try {
      const response: ReportingResponse = await getRequest(`reporting/getReportingById/${reportId}`, getToken());
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching reporting data:', err);
      return null;
    }
  };

  // Add new reporting data
  const addReporting = async (reportingData: ReportingData): Promise<boolean> => {
    try {
      const response: ReportingResponse = await postRequest('reporting/addReporting', reportingData, undefined, getToken(), 'post');
      return response.success;
    } catch (err) {
      console.error('Error adding reporting data:', err);
      return false;
    }
  };

  // Update existing reporting data
  const updateReporting = async (reportId: string, reportingData: ReportingData): Promise<boolean> => {
    try {
      const response: ReportingResponse = await postRequest(`reporting/updateReporting/${reportId}`, reportingData, undefined, getToken(), 'put');
      return response.success;
    } catch (err) {
      console.error('Error updating reporting data:', err);
      return false;
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const calculateMaterialityLevel = (topic: Topic): MaterialityLevel => {
    if (!topic.assessmentComplete) return { level: "Not Assessed", color: "bg-gray-400", priority: 0 };
    
    const impactScore = topic.impactAssessment?.overallScore || 0;
    const financialScore = topic.financialAssessment?.overallScore || 0;
    const maxScore = Math.max(impactScore, financialScore);
    
    if (maxScore >= 7) return { level: "High Material", color: "bg-red-500", priority: 3 };
    if (maxScore >= 5) return { level: "Medium Material", color: "bg-yellow-500", priority: 2 };
    if (maxScore >= 3) return { level: "Low Material", color: "bg-blue-500", priority: 1 };
    return { level: "Not Material", color: "bg-gray-400", priority: 0 };
  };

  const updateTopicAssessment = (topicId: number, assessmentType: 'impactAssessment' | 'financialAssessment', criteria: string, value: number) => {
    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        const updatedAssessment = {
          ...topic[assessmentType],
          [criteria]: value
        } as any;
        
        // Calculate overall score
        const scores = Object.values(updatedAssessment).filter(v => typeof v === 'number');
        updatedAssessment.overallScore = scores.reduce((sum: number, score: any) => sum + score, 0) / scores.length;
        
        return {
          ...topic,
          [assessmentType]: updatedAssessment
        };
      }
      return topic;
    }));
  };

  const completeTopicAssessment = async (topicId: number, rationale: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    // Prepare reporting data for API
    const materiality = calculateMaterialityLevel(topic);
    const reportingData: ReportingData = {
      reportId: topic.reportId || '',
      topicName: topic.category,
      impactMateriality: {
        scale: topic.impactAssessment?.scale || 0,
        scope: topic.impactAssessment?.scope || 0,
        irremediableCharacter: topic.impactAssessment?.irremediableCharacter || 0,
        likelihood: topic.impactAssessment?.likelihood || 0,
        overallImpactScore: topic.impactAssessment?.overallScore || 0
      },
      financialMateriality: {
        cashFlowImpact: topic.financialAssessment?.cashFlowImpact || 0,
        accessToFinance: topic.financialAssessment?.accessToFinance || 0,
        costOfCapital: topic.financialAssessment?.costOfCapital || 0,
        timeHorizon: topic.financialAssessment?.timeHorizon || 0,
        overallFinancialScore: topic.financialAssessment?.overallScore || 0
      },
      assessmentRationale: rationale,
      materialityDetermination: {
        impactScore: topic.impactAssessment?.overallScore || 0,
        financialScore: topic.financialAssessment?.overallScore || 0,
        overallResult: materiality.level
      }
    };

    // Check if this is a new assessment or updating existing one
    let success = false;
    if (topic.assessmentComplete && topic.reportId) {
      // Update existing reporting
      success = await updateReporting(topic.reportId, reportingData);
    } else {
      // Add new reporting
      success = await addReporting(reportingData);
    }

    if (success) {
      // Update local state
      setTopics(prev => prev.map(t => 
        t.id === topicId 
          ? { 
              ...t, 
              assessmentComplete: true,
              lastAssessed: new Date().toISOString().split('T')[0],
              assessedBy: "Current User",
              rationale
            }
          : t
      ));
    } else {
      console.error('Failed to save assessment to API');
      // You might want to show a toast notification here
    }
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

  // Loading component
  if (loading) {
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading materiality assessment data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No topics found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
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
            })
          )}
        </div>
      </div>
    </div>
  );

  const TopicAssessment = () => {
    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic || selectedTopic === null) return null;

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
                      {topic.impactAssessment?.[criteria.key as keyof typeof topic.impactAssessment] || 1}/10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{criteria.description}</p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={topic.impactAssessment?.[criteria.key as keyof typeof topic.impactAssessment] || 1}
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
                      {topic.financialAssessment?.[criteria.key as keyof typeof topic.financialAssessment] || 1}/10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{criteria.description}</p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={topic.financialAssessment?.[criteria.key as keyof typeof topic.financialAssessment] || 1}
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
            onClick={async () => {
              await completeTopicAssessment(selectedTopic, localRationale);
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
    if (!topic || !topic.assessmentComplete || selectedTopic === null) return null;

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
                <span className="font-medium">{topic.impactAssessment?.scale}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Scope:</span>
                <span className="font-medium">{topic.impactAssessment?.scope}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Irremediable Character:</span>
                <span className="font-medium">{topic.impactAssessment?.irremediableCharacter}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Likelihood:</span>
                <span className="font-medium">{topic.impactAssessment?.likelihood}/10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score:</span>
                <span className="text-blue-600">{topic.impactAssessment?.overallScore.toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Financial Materiality (IFRS)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cash Flow Impact:</span>
                <span className="font-medium">{topic.financialAssessment?.cashFlowImpact}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Access to Finance:</span>
                <span className="font-medium">{topic.financialAssessment?.accessToFinance}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Cost of Capital:</span>
                <span className="font-medium">{topic.financialAssessment?.costOfCapital}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Time Horizon:</span>
                <span className="font-medium">{topic.financialAssessment?.timeHorizon}/10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score:</span>
                <span className="text-green-600">{topic.financialAssessment?.overallScore.toFixed(1)}/10</span>
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