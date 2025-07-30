'use client';

interface ProgressChartProps {
  overallProgressValue: number;
}

export default function ProgressChart({ overallProgressValue }: ProgressChartProps) {
  return (
    <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
        <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
          🎯 Overall Progress
        </h3>
      </div>
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e4f5d5"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#0f5744"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(overallProgressValue / 100) * 314} 314`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-green-800">{overallProgressValue}%</div>
            <div className="text-xs text-green-800 opacity-70">Complete</div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-green-800 opacity-70 mt-4">
        SBTi Target Progress • 2025 Goal
      </div>
    </div>
  );
} 