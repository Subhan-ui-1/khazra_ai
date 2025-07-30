'use client';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMetric: any;
}

export default function MetricsModal({ isOpen, onClose, selectedMetric }: MetricsModalProps) {
  if (!isOpen || !selectedMetric) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                {selectedMetric.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedMetric.title}</h2>
                <p className="text-green-100 text-sm">{selectedMetric.subtitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">{selectedMetric.value}</div>
              <div className="text-sm text-gray-600">Current Value</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className={`text-lg font-semibold mb-2 ${
                selectedMetric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedMetric.change}
              </div>
              <div className="text-sm text-gray-600">Change</div>
            </div>
            {selectedMetric.progress && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">{selectedMetric.progress}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {selectedMetric.details?.map((detailGroup: any, groupIndex: number) => (
              <div key={groupIndex} className="bg-gray-50 rounded-xl p-6">
                {detailGroup.category && (
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    {detailGroup.category}
                  </h3>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailGroup.sources?.map((source: any, sourceIndex: number) => (
                    <div key={sourceIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{source.name}</span>
                        <span className="text-sm font-semibold text-green-800">{source.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 