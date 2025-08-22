import React, { useState, useRef, useEffect } from "react";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { generateGRIReport } from "@/constants/griReportTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getRequest, postRequest } from "@/utils/api";
import { toast } from "react-hot-toast";
import { generateIFRSReport } from "@/constants/ifrsReportTemplate";
import { safeLocalStorage } from "@/utils/localStorage";
import { get } from "http";

interface ReportProps {
  data: any;
  type: "GRI" | "IFRS";
  onClose: () => void;
  onEdit?: () => void; // optional, only if you want to allow parent-side edits
  viewMode: "full" | "half";
}

export default function ReportParagraph({
  data,
  type,
  onClose,
  onEdit,
  viewMode,
}: ReportProps) {
  const [editMode, setEditMode] = useState(false);
  const [some, setSome] = useState({ companyName: "", reportingPeriod: "" });
  const [customText, setCustomText] = useState<string>(''
  );
  const reportRef = useRef<HTMLDivElement>(null);
  const handleSave = () => {
    setEditMode(false);
    onEdit?.();
    // Optionally sync updated content or notify parent
  };
  const getTokens = () => {
    const tokens = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokens.accessToken;
  };
  useEffect(() => {
    const fetchBoundaires = async () => {
      const response = await getRequest(
        `boundaries/getBoundaries`,
        getTokens()
      );
      if (response.success) {
        const arr = response.data.boundaries || [];
        setSome((prev) => ({
          reportingPeriod: arr[0].reportingPeriod.start,
          companyName: arr[0].organizationId.name,
        }));
      }
    };
    fetchBoundaires();
    setCustomText(type === "GRI"
      ? generateGRIReport({ ...data, ...some })
      : generateIFRSReport({ ...data, ...some }))
  }, []);
 const handleDownloadPDF = async () => {
  // Ensure we're in the browser environment
  if (reportRef.current && typeof window !== "undefined") {
    try {
      // Dynamically import html2pdf only on client-side
      const html2pdf = (await import("html2pdf.js")).default;
      
      const worker = html2pdf()
        .from(reportRef.current)
        .set({
          margin: 10,
          filename: "sustainability-report.pdf",
          html2canvas: { scale: 1 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        });

      // Get the PDF as a Blob
      const pdfBlob = await worker.output("blob");

      // Trigger download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sustainability-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Post the PDF to the server
      await postPDF(pdfBlob, type);
    } catch (error) {
      return;
    }
  }
};

// Modified to accept Blob directly
const postPDF = async (pdfBlob: Blob, reportName: "GRI" | "IFRS") => {
  try {
    const formData = new FormData();
    formData.append("reportName", reportName);
    formData.append("file", pdfBlob, "sustainability-report.pdf");

    const response = await postRequest(
      `report-generation/createReportGeneration`,
      formData,
      "",
      getTokens() as string
    );

    if (response.success) {
      toast.success("Report generated successfully");
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error("Failed to upload report");
  }
};

  return (
    <div className="absolute top-12 rounded-lg p-8 overflow-auto no-scrollbar bg-white shadow-xl w-[80%] left-1/5">
      {/* Edit / Save Button */}
      <div className="sticky top-4 left-4 z-10">
        {editMode ? (
          <button
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 outline-0"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 outline-0"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}
      </div>

      {/* Close Button */}
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
            onTextChange={(e) => setCustomText(e.htmlValue ?? "")}
            style={{ height: "600px" }}
            className="w-full"
          />
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: customText }}
          />
        )}
      </div>

      {/* Download PDF Button */}
      <div className="sticky bottom-0 py-4 mt-8">
        <button
          className="bg-green-800 text-white px-6 py-3 rounded hover:bg-green-700 outline-0"
          onClick={handleDownloadPDF}
        >
          Save & Download
        </button>
      </div>
    </div>
  );
}
