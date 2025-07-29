'use client';

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-green-100 px-8 h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="text-2xl font-bold text-green-800">khazra.ai</div>
      
      <nav className="flex gap-10">
        <a href="#" className="text-green-800 font-medium text-sm py-2 border-b-2 border-green-800 transition-colors">
          Collect & update data
        </a>
        <a href="#" className="text-green-800 font-medium text-sm py-2 border-b-2 border-transparent hover:border-green-200 transition-colors">
          Measure emissions
        </a>
        <a href="#" className="text-green-800 font-medium text-sm py-2 border-b-2 border-transparent hover:border-green-200 transition-colors">
          Report emissions
        </a>
        <a href="#" className="text-green-800 font-medium text-sm py-2 border-b-2 border-transparent hover:border-green-200 transition-colors">
          Reduce emissions
        </a>
      </nav>
      
      <div className="flex items-center gap-4">
        <button 
          className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
          title="Notifications"
        >
          🔔
        </button>
        <button 
          className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
          title="Settings"
        >
          ⚙️
        </button>
        <button 
          className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
          title="Export"
        >
          📊
        </button>
      </div>
    </header>
  );
} 