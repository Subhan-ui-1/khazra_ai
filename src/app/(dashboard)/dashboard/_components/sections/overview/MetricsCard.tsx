'use client';

import { useMemo, useCallback, memo } from 'react';

interface MetricsCardProps {
  metric: {
    id: string;
    title: string;
    value: string;
    change: string;
    changeType: string;
    subtitle: string;
    icon: string;
    trend?: number[];
    progress?: number;
    details: any[];
  };
  onCardClick: (metric: any) => void;
}

const MetricsCard = memo(({ metric, onCardClick }: MetricsCardProps) => {
  // Memoized chart points calculation
  const chartPoints = useMemo(() => {
    if (!metric.trend) return '';
    
    const generateChartPoints = (data: number[], max: number, height: number, width: number) => {
      const step = width / (data.length - 1);
      return data
        .map((value, index) => {
          const x = index * step;
          const y = height - (value / max) * height;
          return `${x},${y}`;
        })
        .join(' ');
    };

    return generateChartPoints(
      metric.trend,
      Math.max(...metric.trend),
      30,
      180,
    );
  }, [metric.trend]);

  // Memoized change type styling
  const changeTypeStyle = useMemo(() => 
    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
    [metric.changeType]
  );

  // Optimized click handler
  const handleClick = useCallback(() => {
    onCardClick(metric);
  }, [onCardClick, metric]);

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
            {metric.title}
          </div>
          <div className="text-3xl font-bold text-black mb-2">{metric.value}</div>
          <div className={`text-sm mb-2 ${changeTypeStyle}`}>
            {metric.change}
          </div>
          <div className="text-xs text-black opacity-60">{metric.subtitle}</div>
        </div>
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
          {metric.icon}
        </div>
      </div>
      {metric.trend ? (
        <div className="h-10 relative">
          <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-800"
              points={chartPoints}
            />
          </svg>
        </div>
      ) : (
        <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-800 transition-all duration-1000 ease-out"
            style={{ width: `${metric.progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
});

MetricsCard.displayName = 'MetricsCard';

export default MetricsCard; 