'use client';

interface ScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScope: any;
}

export default function ScopeModal({ isOpen, onClose, selectedScope }: ScopeModalProps) {
  if (!isOpen || !selectedScope) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 h-screen bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] border-2 border-green-800 overflow-y-auto no-scrollbar space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-green-800">{selectedScope.title} Details</h2>
              <p className="text-green-600 text-xs">{selectedScope.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-green-600 hover:text-red-500 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="px-4 overflow-y-auto max-h-[65vh] space-y-10 bg-white/60">
          {/* Summary */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="rounded-2xl border border-green-100 shadow-md p-6 bg-white/80">
              <div className="text-4xl font-extrabold text-green-700 mb-2 tracking-wider">{selectedScope.value}</div>
              <p className="text-sm text-gray-500">Total Emissions (t CO₂e)</p>
            </div>
            <div className="rounded-2xl border border-green-100 shadow-md p-6 bg-white/80">
              <div className="text-4xl font-extrabold text-green-700 mb-2 tracking-wider">{selectedScope.percentage}%</div>
              <p className="text-sm text-gray-500">Contribution</p>
            </div>
            <div className="rounded-2xl border border-green-100 shadow-md p-6 bg-white/80">
              <div className="text-2xl font-semibold text-green-800 mb-2">{selectedScope.details?.[0]?.sources?.length || 0}</div>
              <p className="text-sm text-gray-500">Emission Sources</p>
            </div>
          </div> */}

          {/* Progress Bar */}
          <div className="mb-4">
            <span className="text-xl font-bold text-green-700">{selectedScope.title}</span>
            <div className="flex justify-between items-center my-2">
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

          {/* Details */}
          <div className="space-y-8">
            {selectedScope.details?.map((detailGroup: any, groupIndex: number) => (
              <div key={groupIndex} className="bg-white/90 rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Emission Sources Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailGroup.sources?.map((source: any, sourceIndex: number) => (
                    <div key={sourceIndex} className="border border-gray-300/50 p-4 rounded-xl bg-white hover:bg-gray-50 transition">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span className="font-medium">{source.name}</span>
                        <span className="font-semibold text-green-800">{source.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-8 py-5 rounded-b-3xl border-t border-gray-200">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:to-green-800 transition shadow-lg font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
