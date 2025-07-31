'use client';

import { useState } from 'react';

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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedActivity(null);
    setIsModalOpen(false);
  };

  return (
    <>
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

        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full overflow-x-scroll">
            <thead className="bg-green-50">
              <tr>
                <th className="lg:px-6 md:px-4 px-2 py-4 text-left text-sm font-semibold text-green-800">Date</th>
                <th className="lg:px-6 md:px-4 px-2 py-4 text-left text-sm font-semibold text-green-800">Activity</th>
                <th className="lg:px-6 md:px-4 px-2 py-4 text-left text-sm font-semibold text-green-800">Scope</th>
                <th className="lg:px-6 md:px-4 px-2 py-4 text-left text-sm font-semibold text-green-800">Impact</th>
                <th className="lg:px-6 md:px-4 px-2 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivitiesData.map((activity) => (
                <tr
                  key={activity.id}
                  onClick={() => openModal(activity)}
                  className="border-b border-green-100 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <td className="lg:px-6 md:px-4 px-2 py-4 text-sm text-green-800">{activity.date}</td>
                  <td className="lg:px-6 md:px-4 px-2 py-4 text-sm text-green-800">{activity.activity}</td>
                  <td className="lg:px-6 md:px-4 px-2 py-4 text-sm text-green-800">{activity.scope}</td>
                  <td className="lg:px-6 md:px-4 px-2 py-4 text-sm text-green-800">{activity.impact}</td>
                  <td className="lg:px-6 md:px-4 px-2 py-4">
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

      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-green-800 rounded-2xl p-6 w-full max-w-2xl space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-green-800">Activity Details</h2>
              <button onClick={closeModal} className="text-green-800 text-2xl hover:text-red-500">×</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-green-800">
              {[
                { label: 'Date', value: selectedActivity.date },
                { label: 'Activity', value: selectedActivity.activity },
                { label: 'Scope', value: selectedActivity.scope },
                { label: 'Impact', value: selectedActivity.impact },
                { label: 'Status', value: selectedActivity.status },
                { label: 'Status Type', value: selectedActivity.statusType },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm border border-green-800 text-green-800 rounded-lg hover:bg-green-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
