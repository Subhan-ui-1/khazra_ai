'use client';

interface ProgressChartProps {
  overallProgressValue: number;
}

export default function ProgressChart({ overallProgressValue }: ProgressChartProps) {
  const radius = 50;
  const circumference = Math.PI * radius;
  const progress = (overallProgressValue / 100) * circumference;

  return (
    <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm w-full mx-auto xl:h-[600px] h-[400px]">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
          🎯 Overall Progress
        </h3>
        <span className="text-sm text-green-700 font-medium">{overallProgressValue}%</span>
      </div>

      <div className="relative w-full h-[90%]">
        <svg className="w-full h-[70%]" viewBox="0 0 120 60">
          {/* Background semi-circle */}
          <path
            d="M10,60 A50,50 0 0,1 110,60"
            fill="none"
            stroke="#e4f5d5"
            strokeWidth="10"
          />
          {/* Foreground progress arc */}
          <path
            d="M10,60 A50,50 0 0,1 110,60"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Centered label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-4">
          <div className="text-4xl font-bold text-green-800">{overallProgressValue}%</div>
          <div className="text-xl text-green-700 opacity-70">Completed</div>
        </div>

        <div className="text-center text-sm text-green-800 opacity-70 mt-4">
          🌿 SBTi Target Progress • 2025 Goal
        </div>
      </div>
    </div>
  );
}
