import React, { useState, useRef } from "react";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { generateGRIReport } from "@/constants/griReportTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { postRequest } from "@/utils/api";
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
  const [customText, setCustomText] = useState<string>(() =>
    type === "GRI" ? generateGRIReport(data) : generateIFRSReport(data)
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
  console.log(getTokens())

    const postPDF = async (pdf: jsPDF, reportName: "GRI" | "IFRS") => {
    try {
      // Convert PDF to Blob
      const pdfBlob = pdf.output('blob');
      
      // Create FormData
      const formData = new FormData();
      formData.append('reportName', reportName);
      formData.append('file', pdfBlob, 'sustainability-report.pdf');
      
      const response = await postRequest(
        `report-generation/createReportGeneration`,
        formData,
        '',
        getTokens() as string
      );
      
      if (response.success) {
        toast.success("Report generated successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error posting PDF:', error);
      toast.error("Failed to upload report");
    }
  };

  const handleDownloadPDF = async () => {
    if (reportRef.current && typeof window !== "undefined") {
      try {
        // PDF setup - use standard A4 dimensions in mm
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidthMM = 210; // A4 width in mm
        const pageHeightMM = 297; // A4 height in mm
        const marginMM = 15; // Reduced margin for better space utilization

        // Calculate content area
        const contentWidthMM = pageWidthMM - 2 * marginMM;

        // Get all sections
        const sections = reportRef.current.querySelectorAll(".section");
        let currentY = marginMM;

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i] as HTMLElement;

          // Create temporary container with proper scaling
          const tempContainer = document.createElement("div");
          document.body.appendChild(tempContainer);

          // Preserve original styles while setting dimensions
          tempContainer.style.cssText = `
            position: absolute;
            left: -9999px;
            top: 0;
            width: ${contentWidthMM}mm !important;
            max-width: ${contentWidthMM}mm !important;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #000;
            background-color: #ffffff;
            padding: 10px;
            margin: 0;
            overflow: hidden;
          `;

          // Clone and preserve computed styles
          const sectionClone = section.cloneNode(true) as HTMLElement;

          // Preserve text styles
          const computedStyles = window.getComputedStyle(section);
          sectionClone.style.fontFamily = computedStyles.fontFamily;
          sectionClone.style.fontSize = computedStyles.fontSize;
          sectionClone.style.lineHeight = computedStyles.lineHeight;
          sectionClone.style.color = computedStyles.color;
          sectionClone.style.backgroundColor = computedStyles.backgroundColor;
          sectionClone.style.padding = computedStyles.padding;
          sectionClone.style.margin = computedStyles.margin;

          tempContainer.appendChild(sectionClone);

          // Render to canvas with proper scaling
          const canvas = await html2canvas(tempContainer, {
            scale: 3, // Higher resolution for better text quality
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#ffffff",
            width: tempContainer.offsetWidth,
            height: tempContainer.offsetHeight,
            windowWidth: tempContainer.scrollWidth,
            windowHeight: tempContainer.scrollHeight,
          });

          // Cleanup temporary container
          document.body.removeChild(tempContainer);

          // Calculate proportional height
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = imgWidth / contentWidthMM;
          const sectionHeightMM = imgHeight / ratio;

          // Page break handling
          if (currentY + sectionHeightMM > pageHeightMM - marginMM) {
            pdf.addPage();
            currentY = marginMM;
          }

          // Add to PDF with exact dimensions
          pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.92),
            "JPEG",
            marginMM,
            currentY,
            contentWidthMM,
            sectionHeightMM
          );

          currentY += sectionHeightMM + 5; // Small spacing between sections
        }

        postPDF(pdf, type);
        pdf.save("sustainability-report.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-white shadow-lg rounded-lg p-8 overflow-auto">
      {/* Edit / Save Button */}
      <div className="absolute top-4 left-4 z-10">
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
