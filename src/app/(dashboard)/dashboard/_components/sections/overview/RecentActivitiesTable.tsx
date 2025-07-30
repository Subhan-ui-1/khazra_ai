'use client';

interface Activity {
  id: number;
  date: string;
  activity: string;
  scope: string;
  impact: string;
  status: string;
  statusType: string;
}

interface RecentActivitiesTableProps {
  recentActivitiesData: Activity[];
}

export default function RecentActivitiesTable({ recentActivitiesData }: RecentActivitiesTableProps) {
  return (
    <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-green-100">
        <div className="text-lg font-semibold text-green-800">Recent Sustainability Activities</div>
        <div className="flex gap-3">
          <button className="p-2 text-green-800 hover:bg-green-50 rounded border border-green-200 transition-colors" title="Refresh">
            🔄
          </button>
          <button className="p-2 text-green-800 hover:bg-green-50 rounded border border-green-200 transition-colors" title="Export">
            📊
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Activity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Scope</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Impact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentActivitiesData.map((activity) => (
              <tr key={activity.id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">{activity.date}</td>
                <td className="px-6 py-4 text-sm text-green-800">{activity.activity}</td>
                <td className="px-6 py-4 text-sm text-green-800">{activity.scope}</td>
                <td className="px-6 py-4 text-sm text-green-800">{activity.impact}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                    activity.statusType === 'success' 
                      ? 'bg-green-100 text-green-800 border-green-800'
                      : 'bg-white text-green-800 border-green-800'
                  }`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 