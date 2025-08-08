"use client";

import { ChangeEvent, useEffect, useState } from "react";
import ReportModal from "./ReportModal";
import Report from "./ReportPage";
import { Download, Edit3, View } from "lucide-react";
import Table from "@/components/Table";
import { getRequest } from "@/utils/api";
import { safeLocalStorage } from "@/utils/localStorage";

export interface ReportFormData {
  type: "GRI" | "IFRS";
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

// companyName, reportingPeriod, contactDetails,  departmentsNames:

export default function ReportGeneration() {
  const [type, setType] = useState<"GRI" | "IFRS" | null>(null);
  const [reportData, setReportData] = useState<ReportFormData | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    type: "GRI",
    name: "",
    industry: "",
    location: "",
    year: "",
    revenue: "",
    emissions: "",
    goal: "",
    contact: "",
    periodFrequency: "",
    inauguralOrSubsequent: "",
    reportingPeriod: "",
    reportingStandards: "",
    externalAuditorAppointed: "",
    leadershipTitle: "",
    board: "",
    committeeName: "",
    specificTrainingsProvided: "",
    policiesName: "",
    workshopsConducted: "",
    sustainabilityRisksAndOpportunities: "",
    energySource: "",
    sectorIndustryName: "",
    externalConsultants: "",
    benchmarkDetail: "",
    kpis: "",
    dataMonitoringSystems: "",
    ipccAndIea: "",
    physicalRisksScenarios: "",
    selectedBusinessSite: "",
    transitionRiskScenarios: "",
    innovativeFacility: "",
    toolsUsed: "",
    companyName: "",
    departmentsNames: "",
    contactDetails: "",
  });

  type TableRows = {
    url: string;
    reportName: string;
    firstName: string;
    createdAt: string;
    _id: string;
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [tableRows, setTableRows] = useState<TableRows[]>([]);
  const [loading, setLoading] = useState(false);
  //   const handleDropdown = (e: ChangeEvent<HTMLSelectElement>) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }

  useEffect(() => {
    const getTokens = () => {
      const tokens = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
      return tokens.accessToken;
    };
    
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await getRequest(
          "report-generation/getReportGeneration?page=1&limit=10&sortBy=createdAt&sortOrder=desc&search=",
          getTokens() as string
        );
        console.log(response, "response from get Report generation API");
        
        if (response.success) {
          const arr = response.data.reportGeneration || [];
          const formattedRows = arr.map((ar: any) => ({
            url: ar.reportFile?.url || '',
            reportName: ar.reportName || '',
            firstName: ar.createdBy?.firstName || '',
            createdAt: new Date(ar.createdAt).toLocaleDateString(),
            _id: ar._id || '',
          }));
          setTableRows(formattedRows);
        } else {
          console.error('Failed to fetch reports:', response.message);
          setTableRows([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setTableRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
console.log(tableRows, "tableRows");

  const dataTableRows = [
    {
      reportLink:
        "https://res.cloudinary.com/dekpssbm1/image/upload/v1754573167/user-reports/okspta5twsrvcd265yvf.pdf",
      createdBy: "Muhammad Husnain",
      createdAt: "08-08-2025",
    },
  ];

  const handleViewReport = (row: any, index: number) => {
    console.log("View row:", row);
    if (row.url) {
      // Open the report URL in a new tab
      window.open(row.url, '_blank');
    }
  };

  return (
    <div className="h-screen p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Report Generation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t border-gray-100">
          <h2 className="text-xl font-semibold mb-2">GRI</h2>
          <p className="text-sm text-gray-600">
            Science Based Targets initiative helps companies to set emission
            reduction targets in line with climate science.
          </p>
          <button
            className="mt-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setType("GRI")}
          >
            Generate Report
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t border-gray-100">
          <h2 className="text-xl font-semibold mb-2">IFRS</h2>
          <p className="text-sm text-gray-600">
            International Financial Reporting Sustainability Standards
            Initiative provides sustainability disclosure guidance.
          </p>
          <button
            className="mt-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setType("IFRS")}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Report History */}
      <div className="border-t border-gray-100 my-8 shadow-lg rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reports...</p>
          </div>
        ) : (
          <Table
            title="Recent Reports"
            data={tableRows}
            columns={[
              { key: "reportName", label: "Report Name" },
              { key: "firstName", label: "Report Creator" },
              { key: "createdAt", label: "Report Date" },
              
            ]}
            rowKey="_id"
            actions={[
              {
                icon: <View className="w-4 h-4 cursor-pointer" />,
                onClick: (row) =>
                  handleViewReport(
                    row,
                    tableRows.findIndex(
                      (item) => item._id === row._id
                    )
                  ),
                variant: "success",
              },
            ]}
          />
        )}
      </div>

      {type && (
        <ReportModal
          data={formData}
          handleChange={handleChange}
          type={type}
          onClose={() => setType(null)}
          onSubmit={(data) => {
            setReportData(data);
            setType(null);
          }}
          isVisible={true}
        />
      )}

      {reportData && (
        <div className="mt-10">
          <Report
            type={reportData.type as "GRI" | "IFRS"}
            data={reportData}
            onEdit={() => {
              setFormData(reportData);
              setType(reportData.type as "GRI" | "IFRS");
            }}
            onClose={() => setReportData(null)}
            viewMode={"full"}
          />
        </div>
      )}
    </div>
  );
}
