import React, { useState, useRef } from 'react';
import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { generateGRIReport } from '@/constants/griReportTemplate';

interface ReportProps {
  data: any;
  onClose: () => void;
  onEdit?: () => void; // optional, only if you want to allow parent-side edits
  viewMode: 'full' | 'half';
}

export default function ReportParagraph({ data, onClose, onEdit, viewMode }: ReportProps) {
  const [editMode, setEditMode] = useState(false);
  const [customText, setCustomText] = useState<string>(() => generateGRIReport(data));
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    setEditMode(false);
    onEdit?.();
    // Optionally sync updated content or notify parent
  };

  const handleDownloadPDF = async () => {
    if (reportRef.current && typeof window !== 'undefined') {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        html2pdf()
          .from(reportRef.current)
          .set({
            margin: 10,
            filename: 'sustainability-report.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .save();
      } catch (error) {
        console.error('Error generating PDF:', error);
        // Optionally show user feedback
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
      <h2 className="text-3xl font-bold mb-6 text-center">Sustainability Report</h2>

      {/* Report Content */}
      <div ref={reportRef} className="w-full">
        {editMode ? (
          <Editor
            value={customText}
            onTextChange={(e) => setCustomText(e.htmlValue ?? '')}
            style={{ height: '600px' }}
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
