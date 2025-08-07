import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown,
  Edit3,
  Save,
  Eye,
  Filter,
  Loader2,
} from "lucide-react";
import { getRequest, postRequest } from "../../../../../utils/api";
import { safeLocalStorage } from "@/utils/localStorage";
import Table from "@/components/Table";
import BubbleChart from "./BubbleChart";

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
  _id?: string;
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
  reporting?: any;
}

interface Topic {
  id: number;
  status: string;
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
  };
  financialAssessment: {
    cashFlowImpact: number;
    accessToFinance: number;
    costOfCapital: number;
    timeHorizon: number;
    overallScore: number;
  };
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
  const [assessmentMode, setAssessmentMode] = useState("overview"); // 'overview', 'assess', 'results'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'assessed', 'material', 'non-material'
  const [filterCategory, setFilterCategory] = useState<string>("all"); // 'all', 'Environmental', 'Economic', 'Social', 'Governance'
  const [expandedSections, setExpandedSections] = useState({});

  // API states
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API reports to topics format
  const [topics, setTopics] = useState<Topic[]>([]);

  // Store reporting data for current topic
  const [currentReportingData, setCurrentReportingData] = useState<any>(null);

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
      const response: ApiResponse = await getRequest(
        "reports/getReports",
        getToken()
      );

      if (response.success) {
        setReports(response.reports);
        // const reportingData =
        // Convert API reports to topics format
        const convertedTopics: Topic[] = response.reports.map(
          (report, index) => {
            // Determine if assessment is complete based on status
            const isAssessed = report.reportStatus !== "Not Assessed";
            console.log(
              report,
              "report...........................????????????????????????????????????"
            );
            // Parse frameworks to extract GRI and IFRS standards
            const frameworks = report.frameworks.split(", ");
            const griStandard =
              frameworks.find((f) => f.startsWith("GRI")) || "";
            const ifrsAlignment =
              frameworks.find((f) => f.startsWith("IFRS")) || "";

            return {
              id: index + 1,
              status: report.reportStatus,
              name: report.reportName,
              griStandard,
              ifrsAlignment,
              disclosureFramework: report.frameworks,
              sector: report.sector,
              category: report.reportCategory,
              description: report.reportDescription,
              impactAssessment: {
                scale: 1,
                scope: 1,
                irremediableCharacter: 1,
                likelihood: 1,
                overallScore: 1,
              },
              financialAssessment: {
                cashFlowImpact: 1,
                accessToFinance: 1,
                costOfCapital: 1,
                timeHorizon: 1,
                overallScore: 1,
              },
              stakeholderConcern: isAssessed ? 6 : 0,
              assessmentComplete: isAssessed,
              lastAssessed: isAssessed
                ? new Date(report.updatedAt).toISOString().split("T")[0]
                : null,
              assessedBy: isAssessed ? "API User" : null,
              rationale: isAssessed
                ? `Assessment completed via API. Status: ${report.reportStatus}`
                : "",
              reportId: report._id, // Store the report ID for API calls
            };
          }
        );

        setTopics(convertedTopics);
      } else {
        setError("Failed to fetch reports");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific reporting data by ID
  const fetchReportingById = async (
    reportId: string
  ): Promise<{ reporting: ReportingData; _id: string } | null> => {
    try {
      const response: ReportingResponse = await getRequest(
        `reporting/getReportingById/${reportId}`,
        getToken()
      );
      if (response.success && response.reporting) {
        // Store the reporting data
        setCurrentReportingData(response.reporting);
        const reportingData = response.reporting;
        // Update topics state with properly mapped data
        setTopics((prev) => {
          return prev.map((t) =>
            t.reportId === reportId
              ? {
                  ...t,
                  impactAssessment: {
                    scale: reportingData.impactMateriality.scale,
                    scope: reportingData.impactMateriality.scope,
                    irremediableCharacter: reportingData.impactMateriality.irremediableCharacter,
                    likelihood: reportingData.impactMateriality.likelihood,
                    overallScore: reportingData.impactMateriality.overallImpactScore,
                  },
                  financialAssessment: {
                    cashFlowImpact: reportingData.financialMateriality.cashFlowImpact,
                    accessToFinance: reportingData.financialMateriality.accessToFinance,
                    costOfCapital: reportingData.financialMateriality.costOfCapital,
                    timeHorizon: reportingData.financialMateriality.timeHorizon,
                    overallScore: reportingData.financialMateriality.overallFinancialScore,
                  },
                  assessmentComplete: true,
                  rationale: reportingData.assessmentRationale,
                }
              : t
          );
        });
        return {
          reporting: response.reporting,
          _id: response.reporting._id,
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching reporting data:", err);
      return null;
    }
  };

  // Add new reporting data
  const addReporting = async (
    reportingData: ReportingData
  ): Promise<boolean> => {
    try {
      console.log("Adding reporting data:", reportingData);
      const response = await postRequest(
        "reporting/addReporting",
        reportingData,
        undefined,
        getToken(),
        "post"
      );
      console.log("Add reporting response:", response);
      return response.success;
    } catch (err) {
      console.error("Error adding reporting data:", err);
      return false;
    }
  };

  // Update existing reporting data
  const updateReporting = async (
    reportingId: string,
    reportingData: ReportingData
  ): Promise<boolean> => {
    try {
      console.log(
        "Updating reporting data for reportingId:",
        reportingId,
        reportingData
      );
      let some = { ...reportingData, reportId: undefined };
      const response = await postRequest(
        `reporting/updateReporting/${reportingId}`,
        some,
        undefined,
        getToken(),
        "put"
      );
      console.log("Update reporting response:", response);
      return response.success;
    } catch (err) {
      console.error("Error updating reporting data:", err);
      return false;
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const calculateMaterialityLevel = (topic: Topic): MaterialityLevel => {
    console.log(
      topic,
      "topic...........................????????????????????????????????????"
    );
    const impactScore = topic.impactAssessment.overallScore || 0;
    const financialScore = topic.financialAssessment.overallScore || 0;
    const maxScore = Math.max(impactScore, financialScore);

    // Only return "Not Assessed" if both scores are 0 or very low
    if (maxScore <= 1)
      return { level: "Not Assessed", color: "bg-gray-400", priority: 0 };

    if (maxScore >= 7)
      return { level: "High Material", color: "bg-red-500", priority: 3 };
    if (maxScore >= 5)
      return { level: "Medium Material", color: "bg-yellow-500", priority: 2 };
    if (maxScore >= 3)
      return { level: "Low Material", color: "bg-blue-500", priority: 1 };
    return { level: "Not Material", color: "bg-gray-400", priority: 0 };
  };

  const updateTopicAssessment = (
    topicId: number,
    assessmentType: "impactAssessment" | "financialAssessment",
    criteria: string,
    value: number
  ) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id === topicId) {
          const currentAssessment = topic[assessmentType] || {};
          const updatedAssessment = {
            ...currentAssessment,
            [criteria]: value,
          } as any;

          // Calculate overall score (exclude overallScore from calculation)
          const scoreKeys =
            assessmentType === "impactAssessment"
              ? ["scale", "scope", "irremediableCharacter", "likelihood"]
              : [
                  "cashFlowImpact",
                  "accessToFinance",
                  "costOfCapital",
                  "timeHorizon",
                ];

          const scores = scoreKeys.map((key) => updatedAssessment[key] || 0);
          updatedAssessment.overallScore =
            scores.reduce((sum: number, score: number) => sum + score, 0) /
            scores.length;

          return {
            ...topic,
            [assessmentType]: updatedAssessment,
          };
        }
        return topic;
      })
    );
  };

  const completeTopicAssessment = async (
    topicId: number,
    rationale: string,
    impactAssessment: any,
    financialAssessment: any
  ): Promise<boolean> => {
    try {
      const topic = topics.find((t) => t.id === topicId);
      if (!topic) {
        console.error("Topic not found");
        return false;
      }

      // Prepare reporting data for API using local state data
      const materiality = calculateMaterialityLevel({
        ...topic,
        impactAssessment: impactAssessment,
        financialAssessment: financialAssessment,
      });

      const reportingData: ReportingData = {
        reportId: topic.reportId || "",
        topicName: topic.name, // Use topic name instead of category
        impactMateriality: {
          scale: impactAssessment.scale,
          scope: impactAssessment.scope,
          irremediableCharacter: impactAssessment.irremediableCharacter,
          likelihood: impactAssessment.likelihood,
          overallImpactScore: impactAssessment.overallScore,
        },
        financialMateriality: {
          cashFlowImpact: financialAssessment.cashFlowImpact,
          accessToFinance: financialAssessment.accessToFinance,
          costOfCapital: financialAssessment.costOfCapital,
          timeHorizon: financialAssessment.timeHorizon,
          overallFinancialScore: financialAssessment.overallScore,
        },
        assessmentRationale: rationale,
        materialityDetermination: {
          impactScore: impactAssessment.overallScore,
          financialScore: financialAssessment.overallScore,
          overallResult: materiality.level,
        },
      };

      console.log("Sending reporting data:", reportingData);

      // Check if this is a new assessment or updating existing one
      let success = false;
      if (currentReportingData && currentReportingData._id) {
        // Update existing reporting using the _id from the stored data
        console.log(
          "Updating existing reporting with _id:",
          currentReportingData._id
        );
        success = await updateReporting(
          currentReportingData._id,
          reportingData
        );
      } else {
        // Add new reporting
        success = await addReporting(reportingData);
      }

      if (success) {
        // Refresh the reports data to get updated information
        await fetchReports();
        console.log("Assessment saved successfully");
        return true;
      } else {
        console.error("Failed to save assessment to API");
        return false;
      }
    } catch (error) {
      console.error("Error in completeTopicAssessment:", error);
      return false;
    }
  };
  console.log(topics);

  const filteredTopics = topics.filter((topic) => {
    // Filter by status
    let statusMatch = true;
    switch (filterStatus) {
      case "assessed":
        statusMatch = topic.assessmentComplete;
        break;
      case "material":
        const matLevel = calculateMaterialityLevel(topic);
        statusMatch = matLevel.priority > 0;
        break;
      case "non-material":
        const nonMatLevel = calculateMaterialityLevel(topic);
        statusMatch = topic.assessmentComplete && nonMatLevel.priority === 0;
        break;
      default:
        statusMatch = true;
    }

    // Filter by category
    const categoryMatch =
      filterCategory === "all" || topic.category === filterCategory;

    return statusMatch && categoryMatch;
  });

  const materialTopics = topics.filter((topic) => {
    const matLevel = calculateMaterialityLevel(topic);
    return matLevel.priority > 0;
  });

  const assessedTopics = topics.filter((topic) => topic.assessmentComplete);

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen  p-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">
                Loading materiality assessment data...
              </p>
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
            <h1 className="text-3xl font-bold text-black mb-2">
              Topic-Based Materiality Assessment Engine
            </h1>
            <p className="text-black">
              Individual topic assessment with dual materiality for GRI
              Standards and IFRS S1/S2 alignment
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <p className="text-black mb-4">{error}</p>
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

  // --- Replace TopicOverview with dashboard-style cards, filters, and table ---
  const TopicOverview = () => {
    // Define table columns
    const columns = [
      {
        key: "name",
        label: "Topic",
        type: "text" as const,
        render: (value: string, row: any) => (
          <div>
            <div className="font-medium text-black">{value}</div>
            <div className="text-xs text-black">{row.description}</div>
          </div>
        ),
      },
      {
        key: "category",
        label: "Category",
        type: "text" as const,
      },
      // {
      //   key: 'status',
      //   label: 'Status',
      //   type: 'status' as const
      // },
      {
        key: "status",
        label: "Status",
        type: "badge" as const,
        render: (value: string, row: any) => {
          console.log(
            row,
            "row...........................????????????????????????????????????"
          );
          // const materiality = calculateMaterialityLevel(row);
          const calculateMateriality = () => {
            if (row.status === "High Material") {
              return { color: "bg-red-500", level: "High Material" };
            }
            if (row.status === "Medium Material") {
              return { color: "bg-yellow-500", level: "Medium Material" };
            }
            if (row.status === "Low Material") {
              return { color: "bg-blue-500", level: "Low Material" };
            }
            return { color: "bg-gray-500", level: "Not Assessed" };
          };
          const materiality = calculateMateriality();
          return (
            <span
              className={`px-2 py-1 text-xs rounded-full border ${
                materiality.color === "bg-red-500"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : materiality.color === "bg-yellow-500"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : materiality.color === "bg-blue-500"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {materiality.level}
            </span>
          );
        },
      },
      // {
      //   key: 'assessedBy',
      //   label: 'Assessed By',
      //   type: 'text' as const
      // },
      {
        key: "lastAssessed",
        label: "Last Assessed",
        type: "date" as const,
      },
      {
        key: "actions",
        label: "Actions",
        type: "action" as const,
        render: (value: string, row: any) => {
          if (row.assessmentComplete) {
            // For assessed topics, show View and Edit buttons
            return (
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    setSelectedTopic(row.id);
                    setAssessmentMode("results");
                    const result = await fetchReportingById(row.reportId);
                    if (result) {
                      console.log("Reporting data loaded for view:", result);
                    }
                  }}
                  className="p-2 cursor-pointer"
                  // className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                  title="View"
                >
                  <Eye size={14} />
                  {/* <span>View</span> */}
                </button>
                <button
                  onClick={async () => {
                    setSelectedTopic(row.id);
                    setAssessmentMode("assess");
                    const result = await fetchReportingById(row.reportId);
                    if (result) {
                      console.log("Reporting data loaded for edit:", result);
                    }
                  }}
                  className="p-2 cursor-pointer"
                  // className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  title="Edit"
                >
                  <Edit3 size={14} color="green" />
                  {/* <span>Edit</span> */}
                </button>
              </div>
            );
          } else {
            // For unassessed topics, show only Assess button
            return (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedTopic(row.id);
                    setAssessmentMode("assess");
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  title="Assess"
                >
                  <Edit3 size={14} />
                  <span>Assess</span>
                </button>
              </div>
            );
          }
        },
      },
    ];

    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-800">
              {topics.length}
            </div>
            <div className="text-sm text-black">Total Topics</div>
          </div>
          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-800">
              {assessedTopics.length}
            </div>
            <div className="text-sm text-black">Assessed</div>
          </div>
          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-800">
              {materialTopics.length}
            </div>
            <div className="text-sm text-black">Material Topics</div>
          </div>
          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-800">
              {topics.length > 0
                ? Math.round((assessedTopics.length / topics.length) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-black">Progress</div>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["Environmental", "Economic", "Social", "Governance"].map(
            (category) => {
              const categoryTopics = topics.filter(
                (t) => t.category === category
              );
              const categoryAssessed = categoryTopics.filter(
                (t) => t.assessmentComplete
              );
              const categoryMaterial = categoryTopics.filter(
                (t) => calculateMaterialityLevel(t).priority > 0
              );

              return (
                <div
                  key={category}
                  className="bg-white border border-green-100 rounded-xl p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-center mb-2 text-black">
                    {category}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Total:</span>
                      <span className="font-medium text-green-800">
                        {categoryTopics.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Assessed:</span>
                      <span className="font-medium text-green-600">
                        {categoryAssessed.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Material:</span>
                      <span className="font-medium text-red-600">
                        {categoryMaterial.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4 mb-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-green-800">
              Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Topics</option>
              <option value="assessed">Assessed Only</option>
              <option value="material">Material Topics</option>
              <option value="non-material">Non-Material Topics</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-green-800">
              Category:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="Environmental">Environmental</option>
              <option value="Economic">Economic</option>
              <option value="Social">Social</option>
              <option value="Governance">Governance</option>
            </select>
          </div>
          <span className="text-sm text-green-800 ml-auto">
            Showing {filteredTopics.length} of {topics.length} topics
          </span>
        </div>

        {/* Material Topics Table */}
        <Table
          title="Material Topics Assessment"
          columns={columns}
          data={filteredTopics}
          showSearch={false}
          showFilter={false}
          loading={loading}
          emptyMessage="No topics found. Try adjusting your filters or check back later."
          // emptyIcon={<FileText className="w-12 h-12 text-gray-400" />}
          rowKey="id"
        />
      </div>
    );
  };

  const TopicAssessment = () => {
    const topic = topics.find((t) => t.id === selectedTopic);
    if (!topic || selectedTopic === null) return null;

    // Initialize state with default values
    const [localRationale, setLocalRationale] = useState("");
    const [localImpactAssessment, setLocalImpactAssessment] = useState({
      scale: 1,
      scope: 1,
      irremediableCharacter: 1,
      likelihood: 1,
      overallScore: 1,
    });
    const [localFinancialAssessment, setLocalFinancialAssessment] = useState({
      cashFlowImpact: 1,
      accessToFinance: 1,
      costOfCapital: 1,
      timeHorizon: 1,
      overallScore: 1,
    });

    // Update local states when topic changes or when reporting data is loaded
    useEffect(() => {
      const newImpactAssessment: any =
        currentReportingData?.impactMateriality || topic.impactAssessment;
      const newFinancialAssessment: any =
        currentReportingData?.financialMateriality || topic.financialAssessment;
      const newRationale =
        currentReportingData?.assessmentRationale || topic.rationale || "";

      // Normalize the assessment data to use consistent property names
      const normalizedNewImpactAssessment = {
        scale: newImpactAssessment.scale || 1,
        scope: newImpactAssessment.scope || 1,
        irremediableCharacter: newImpactAssessment.irremediableCharacter || 1,
        likelihood: newImpactAssessment.likelihood || 1,
        overallScore:
          (newImpactAssessment as any).overallImpactScore ||
          newImpactAssessment.overallScore ||
          1,
      };

      const normalizedNewFinancialAssessment = {
        cashFlowImpact: newFinancialAssessment.cashFlowImpact || 1,
        accessToFinance: newFinancialAssessment.accessToFinance || 1,
        costOfCapital: newFinancialAssessment.costOfCapital || 1,
        timeHorizon: newFinancialAssessment.timeHorizon || 1,
        overallScore:
          (newFinancialAssessment as any).overallFinancialScore ||
          newFinancialAssessment.overallScore ||
          1,
      };

      console.log('Setting local state with:', {
        rationale: newRationale,
        impact: normalizedNewImpactAssessment,
        financial: normalizedNewFinancialAssessment
      });
      setLocalRationale(newRationale);
      setLocalImpactAssessment(normalizedNewImpactAssessment);
      setLocalFinancialAssessment(normalizedNewFinancialAssessment);
    }, [selectedTopic, currentReportingData, topic]);

    // Calculate current materiality level based on local state
    const currentMateriality = calculateMaterialityLevel({
      ...topic,
      impactAssessment: localImpactAssessment,
      financialAssessment: localFinancialAssessment,
    });

    const impactCriteria = [
      {
        key: "scale",
        name: "Scale",
        description: "How significant is the impact?",
      },
      {
        key: "scope",
        name: "Scope",
        description: "How widespread is the impact?",
      },
      {
        key: "irremediableCharacter",
        name: "Irremediable Character",
        description: "How difficult to counteract?",
      },
      {
        key: "likelihood",
        name: "Likelihood",
        description: "Probability of occurrence?",
      },
    ];

    const financialCriteria = [
      {
        key: "cashFlowImpact",
        name: "Cash Flow Impact",
        description: "Effect on future cash flows",
      },
      {
        key: "accessToFinance",
        name: "Access to Finance",
        description: "Impact on financing availability",
      },
      {
        key: "costOfCapital",
        name: "Cost of Capital",
        description: "Effect on capital costs",
      },
      {
        key: "timeHorizon",
        name: "Time Horizon",
        description: "Short, medium, long-term effects",
      },
    ];
    // Initialize local state for assessment
    return (
      <div className="space-y-6">
        {/* Topic Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{topic.name}</h2>
              <p className="text-gray-600 mt-1">{topic.description}</p>
              <div className="flex space-x-4 mt-2">
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                  {topic.griStandard}
                </span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded">
                  {topic.ifrsAlignment}
                </span>
                <span className="bg-purple-100 px-2 py-1 rounded text-xs">
                  {topic.category}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600">
                  <strong>Disclosure Frameworks:</strong>{" "}
                  {topic.disclosureFramework}
                </span>
              </div>
            </div>
            <button
              onClick={() => setAssessmentMode("overview")}
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
              Assess the organization's most significant impacts on economy,
              environment, and people
            </p>

            <div className="space-y-6">
              {impactCriteria.map((criteria) => (
                <div key={criteria.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                      {criteria.name}
                    </label>
                    <span className="text-sm font-bold text-blue-600">
                      {
                        localImpactAssessment[
                          criteria.key as keyof typeof localImpactAssessment
                        ]
                      }
                      /10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {criteria.description}
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={
                      localImpactAssessment[
                        criteria.key as keyof typeof localImpactAssessment
                      ]
                    }
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      console.log(`Impact ${criteria.key} changed to:`, newValue);
                      const updatedAssessment = {
                        ...localImpactAssessment,
                        [criteria.key]: newValue,
                      };

                      // Calculate new overall score
                      const scoreKeys = [
                        "scale",
                        "scope",
                        "irremediableCharacter",
                        "likelihood",
                      ];
                      const scores = scoreKeys.map(
                        (key) =>
                          updatedAssessment[
                            key as keyof typeof updatedAssessment
                          ] as number
                      );
                      updatedAssessment.overallScore =
                        scores.reduce((sum, score) => sum + score, 0) /
                        scores.length;

                      console.log('Updated impact assessment:', updatedAssessment);
                      setLocalImpactAssessment(updatedAssessment);
                    }}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Impact Score:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {localImpactAssessment.overallScore.toFixed(1)}/10
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
              Assess information that could influence investor and stakeholder
              decisions
            </p>

            <div className="space-y-6">
              {financialCriteria.map((criteria) => (
                <div key={criteria.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                      {criteria.name}
                    </label>
                    <span className="text-sm font-bold text-green-600">
                      {
                        localFinancialAssessment[
                          criteria.key as keyof typeof localFinancialAssessment
                        ]
                      }
                      /10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {criteria.description}
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={
                      localFinancialAssessment[
                        criteria.key as keyof typeof localFinancialAssessment
                      ]
                    }
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      console.log(`Financial ${criteria.key} changed to:`, newValue);
                      const updatedAssessment = {
                        ...localFinancialAssessment,
                        [criteria.key]: newValue,
                      };

                      // Calculate new overall score
                      const scoreKeys = [
                        "cashFlowImpact",
                        "accessToFinance",
                        "costOfCapital",
                        "timeHorizon",
                      ];
                      const scores = scoreKeys.map(
                        (key) =>
                          updatedAssessment[
                            key as keyof typeof updatedAssessment
                          ] as number
                      );
                      updatedAssessment.overallScore =
                        scores.reduce((sum, score) => sum + score, 0) /
                        scores.length;
                      console.log('Updated financial assessment:', updatedAssessment);
                      setLocalFinancialAssessment(updatedAssessment);
                    }}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Financial Score:</span>
                  <span className="text-lg font-bold text-green-600">
                    {localFinancialAssessment.overallScore.toFixed(1)}/10
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
          <h3 className="text-lg font-semibold mb-4">
            Materiality Determination
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {localImpactAssessment.overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Impact Score (GRI)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {localFinancialAssessment.overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                Financial Score (IFRS)
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`text-2xl font-bold ${currentMateriality.color
                  .replace("bg-", "text-")
                  .replace("-500", "-600")}`}
              >
                {currentMateriality.level}
              </div>
              <div className="text-sm text-gray-600">
                {currentMateriality.level === "Not Assessed"
                  ? "Adjust scores above"
                  : "Overall Result"}
              </div>
            </div>
          </div>
          {currentMateriality.level !== "Not Assessed" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>Real-time Assessment:</strong> Materiality level updates
                automatically as you adjust the scores above.
              </div>
            </div>
          )}
        </div>

        {/* Save Assessment */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setAssessmentMode("overview")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                // Update the topic with local assessment data before saving
                const updatedTopic = {
                  ...topic,
                  impactAssessment: localImpactAssessment,
                  financialAssessment: localFinancialAssessment,
                };

                // Temporarily update the topics state with local data
                setTopics((prev) =>
                  prev.map((t) => (t.id === selectedTopic ? updatedTopic : t))
                );

                // Calculate materiality level based on local assessment data
                const materialityLevel =
                  calculateMaterialityLevel(updatedTopic);

                const success = await completeTopicAssessment(
                  selectedTopic,
                  localRationale,
                  localImpactAssessment,
                  localFinancialAssessment
                );
                if (success) {
                  setAssessmentMode("overview");
                } else {
                  // Show error message to user
                  // alert('Failed to save assessment. Please try again.');
                }
              } catch (error) {
                console.error("Error saving assessment:", error);
                // alert('An error occurred while saving the assessment. Please try again.');
              }
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
    const topic = topics.find((t) => t.id === selectedTopic);
    if (!topic || !topic.assessmentComplete || selectedTopic === null)
      return null;
    // Process topic data for display
    // Use stored reporting data if available, otherwise use topic data
    const impactData = currentReportingData?.impactMateriality || topic.impactAssessment;
    const financialData = currentReportingData?.financialMateriality || topic.financialAssessment;
    const rationale = currentReportingData?.assessmentRationale || topic.rationale;
    const materialityResult = currentReportingData?.materialityDetermination?.overallResult;

    // Normalize data for display to handle property name differences
    const normalizedImpactData = {
      scale: impactData.scale || 0,
      scope: impactData.scope || 0,
      irremediableCharacter: impactData.irremediableCharacter || 0,
      likelihood: impactData.likelihood || 0,
      overallScore: (impactData as any).overallImpactScore || impactData.overallScore || 0,
    };

    const normalizedFinancialData = {
      cashFlowImpact: financialData.cashFlowImpact || 0,
      accessToFinance: financialData.accessToFinance || 0,
      costOfCapital: financialData.costOfCapital || 0,
      timeHorizon: financialData.timeHorizon || 0,
      overallScore: (financialData as any).overallFinancialScore || financialData.overallScore || 0,
    };

    const materiality = calculateMaterialityLevel(topic);

    return (
      <div className="space-y-6">
        {/* Topic Results Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{topic.name}</h2>
              <div
                className={`inline-block px-3 py-1 rounded text-white text-sm mt-2 ${materiality.color}`}
              >
                {materiality.level}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setAssessmentMode("assess")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Assessment
              </button>
              <button
                onClick={() => setAssessmentMode("overview")}
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
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              Impact Materiality (GRI)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Scale:</span>
                <span className="font-medium">{normalizedImpactData.scale}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Scope:</span>
                <span className="font-medium">{normalizedImpactData.scope}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Irremediable Character:</span>
                <span className="font-medium">
                  {normalizedImpactData.irremediableCharacter}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span>Likelihood:</span>
                <span className="font-medium">{normalizedImpactData.likelihood}/10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score:</span>
                <span className="text-blue-600">
                  {normalizedImpactData.overallScore.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              Financial Materiality (IFRS)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cash Flow Impact:</span>
                <span className="font-medium">
                  {normalizedFinancialData.cashFlowImpact}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span>Access to Finance:</span>
                <span className="font-medium">
                  {normalizedFinancialData.accessToFinance}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cost of Capital:</span>
                <span className="font-medium">
                  {normalizedFinancialData.costOfCapital}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time Horizon:</span>
                <span className="font-medium">
                  {normalizedFinancialData.timeHorizon}/10
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score:</span>
                <span className="text-green-600">
                  {normalizedFinancialData.overallScore.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Rationale */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Assessment Rationale</h3>
          <p className="text-gray-700">{rationale}</p>
          {/* <div className="mt-4 text-sm text-gray-500">
            <p>Assessed by: {topic.assessedBy}</p>
            <p>Last assessed: {topic.lastAssessed}</p>
          </div> */}
        </div>

        {/* Reporting Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              GRI Reporting Requirements
            </h3>
            {materiality.priority > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span>Material topic - requires full GRI disclosures</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p>
                    <strong>Required disclosures:</strong>{" "}
                    {topic.disclosureFramework}
                  </p>
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
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              IFRS S1/S2 Reporting Requirements
            </h3>
            {materiality.priority > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span>Material topic - requires IFRS disclosures</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p>
                    <strong>Required frameworks:</strong>{" "}
                    {topic.disclosureFramework}
                  </p>
                  <p>Include in sustainability-related financial disclosures</p>
                  <p>
                    Must address governance, strategy, risk management, metrics
                  </p>
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
      <h3 className="text-lg font-semibold mb-4">
        Materiality Matrix - All Assessed Topics
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="impactScore"
              name="Impact Materiality (GRI)"
              domain={[0, 10]}
              label={{
                value: "Impact Materiality (GRI)",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              type="number"
              dataKey="financialScore"
              name="Financial Materiality (IFRS)"
              domain={[0, 10]}
              label={{
                value: "Financial Materiality (IFRS)",
                position: "insideLeft",
                angle: -90,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm">Impact: {data.impactScore}</p>
                      <p className="text-sm">
                        Financial: {data.financialScore}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Topics"
              data={assessedTopics.map((topic) => ({
                ...topic,
                impactScore: topic.impactAssessment?.overallScore || 0,
                financialScore: topic.financialAssessment?.overallScore || 0,
              }))}
              fill="#3B82F6"
            >
              {assessedTopics.map((topic, index) => {
                const materiality = calculateMaterialityLevel(topic);
                let color = "#9CA3AF"; // gray
                if (materiality.color.includes("red")) color = "#EF4444";
                else if (materiality.color.includes("yellow"))
                  color = "#F59E0B";
                else if (materiality.color.includes("blue")) color = "#3B82F6";

                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-full ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Topic-Based Materiality Assessment Engine
          </h1>
          <p className="text-black opacity-70">
            Individual topic assessment with dual materiality for GRI Standards
            and IFRS S1/S2 alignment
          </p>
        </div>

        {assessmentMode === "overview" && (
          <>
            <TopicOverview />
            {assessedTopics.length > 0 && (
              <div className="mt-8">
                <BubbleChart
                  calculateMaterialityLevel={calculateMaterialityLevel}
                />
              </div>
            )}
          </>
        )}

        {assessmentMode === "assess" && <TopicAssessment />}
        {assessmentMode === "results" && <TopicResults />}
      </div>
    </div>
  );
};

export default MaterialityAssessmentEngine;
