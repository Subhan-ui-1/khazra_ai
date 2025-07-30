'use client';

import { useCallback, memo } from 'react';

interface ScopeCardProps {
  scope: {
    id: string;
    title: string;
    subtitle: string;
    value: string;
    percentage: number;
    icon: string;
    trend: number[];
    details: any[];
  };
  onCardClick: (scope: any) => void;
}

const ScopeCard = memo(({ scope, onCardClick }: ScopeCardProps) => {
  // Optimized click handler
  const handleClick = useCallback(() => {
    onCardClick(scope);
  }, [onCardClick, scope]);

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
          {scope.icon}
        </div>
        <div>
          <h4 className="font-semibold text-green-800">{scope.title}</h4>
          <div className="text-xs text-green-800 opacity-60">{scope.subtitle}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-2xl font-bold text-green-800">{scope.value}</div>
        <div className="text-sm text-green-800 opacity-60">{scope.percentage}%</div>
      </div>
      <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-800 transition-all duration-1000" 
          style={{ width: `${scope.percentage}%` }}
        ></div>
      </div>
    </div>
  );
});

ScopeCard.displayName = 'ScopeCard';

export default ScopeCard; 