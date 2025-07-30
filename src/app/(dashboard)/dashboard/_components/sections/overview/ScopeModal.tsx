'use client';

interface ScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScope: any;
}

export default function ScopeModal({ isOpen, onClose, selectedScope }: ScopeModalProps) {
  if (!isOpen || !selectedScope) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                {selectedScope.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedScope.title}</h2>
                <p className="text-green-100 text-sm">{selectedScope.subtitle}</p>
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
              <div className="text-3xl font-bold text-green-800 mb-2">{selectedScope.value}</div>
              <div className="text-sm text-gray-600">Total Emissions (t CO₂e)</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">{selectedScope.percentage}%</div>
              <div className="text-sm text-gray-600">Contribution</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold text-green-800 mb-2">
                {selectedScope.details?.[0]?.sources?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Emission Sources</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Scope Contribution</span>
              <span className="text-sm font-semibold text-green-800">{selectedScope.percentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-green-800 transition-all duration-1000"
                style={{ width: `${selectedScope.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {selectedScope.details?.map((detailGroup: any, groupIndex: number) => (
              <div key={groupIndex} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Emission Sources Breakdown
                </h3>
                
                <div className="space-y-3">
                  {detailGroup.sources?.map((source: any, sourceIndex: number) => (
                    <div key={sourceIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{source.name}</span>
                        </div>
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