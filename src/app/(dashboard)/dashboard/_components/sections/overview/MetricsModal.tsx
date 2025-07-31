'use client';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMetric: any;
}

export default function MetricsModal({ isOpen, onClose, selectedMetric }: MetricsModalProps) {
  if (!isOpen || !selectedMetric) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 h-screen bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] border-2 border-green-800 overflow-y-auto no-scrollbar space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-green-800">{selectedMetric.title} Details</h2>
              <p className="text-green-600 text-xs">{selectedMetric.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-green-600 hover:text-red-500 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Summary Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="rounded-xl p-3 flex items-center space-x-2 shadow-sm">
            <p className="text-sm text-gray-500">Current Value </p>
            <div className="text-sm font-extrabold text-green-800 tracking-wide">
              {selectedMetric.value}
            </div>
          </div>
          <div className="rounded-xl p-3 flex items-center space-x-2 shadow-sm">
            <p className="text-sm text-gray-500">Change</p>
            <div className={`text-sm font-semibold tracking-wide ${
                selectedMetric.changeType === 'increase' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {selectedMetric.change}
            </div>
          </div>
          {selectedMetric.progress && (
            <div className="rounded-xl p-3 flex items-center space-x-2 shadow-sm">
              <p className="text-sm text-gray-500">Progress</p>
              <div className="text-sm font-extrabold text-green-800 tracking-wide">
                {selectedMetric.progress}%
              </div>
            </div>
          )}
        </div> */}

        {/* Detailed Groups */}
        <div className="space-y-8">
          {selectedMetric.details?.map((detailGroup: any, groupIndex: number) => (
            <div key={groupIndex} className="border border-green-100 rounded-xl bg-white p-6 shadow-sm">
              {detailGroup.category && (
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  {detailGroup.category}
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailGroup.sources?.map((source: any, sourceIndex: number) => (
                  <div
                    key={sourceIndex}
                    className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">{source.name}</span>
                      <span className="font-semibold text-green-700">{source.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end pt-2">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:to-green-800 transition shadow-lg font-medium cursor-pointer"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
}
