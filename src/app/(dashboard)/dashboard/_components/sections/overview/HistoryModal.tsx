'use client';

import { useState } from 'react';
import { Clock, User, Edit3, Plus, Trash2 } from 'lucide-react';

interface HistoryEntry {
  _id: string;
  timestamp: string;
  action: string;
  userId: string;
  changes: {
    before: any;
    after: any;
  };
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  activityData: any;
}

export default function HistoryModal({ isOpen, onClose, history, activityData }: HistoryModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'updated':
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'updated':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'deleted':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-green-800 rounded-2xl p-6 w-full max-w-4xl space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-green-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Activity History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {activityData?.stationary?.scopeType} - {activityData?.stationary?.facilityDescription}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-green-800 text-2xl hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Current Activity Info */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-3">Current Activity Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Month/Year:</span>
              <p className="font-medium text-green-800">{activityData?.stationary?.month} {activityData?.stationary?.year}</p>
            </div>
            <div>
              <span className="text-gray-600">Total Emissions:</span>
              <p className="font-medium text-green-800">{activityData?.stationary?.totalEmissions} t CO₂e</p>
            </div>
            <div>
              <span className="text-gray-600">Fuel Used:</span>
              <p className="font-medium text-green-800">{activityData?.stationary?.quantityOfFuelUsed}</p>
            </div>
            <div>
              <span className="text-gray-600">Emission Factor:</span>
              <p className="font-medium text-green-800">{activityData?.stationary?.emissionFactor}</p>
            </div>
            <div>
              <span className="text-gray-600">Scope:</span>
              <p className="font-medium text-green-800">{activityData?.stationary?.scope}</p>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>
              <p className="font-medium text-green-800">{formatDate(activityData?.stationary?.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div>
          <h3 className="font-semibold text-green-800 mb-4">Change History</h3>
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={entry._id} className="relative">
                {/* Timeline line */}
                {index < history.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-12 bg-green-200"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getActionColor(entry.action)}`}>
                    {getActionIcon(entry.action)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white border border-green-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(entry.action)}`}>
                          {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>User ID: {entry.userId.slice(-8)}</span>
                      </div>
                    </div>
                    
                    {/* Changes */}
                    {entry.changes && (
                      <div className="space-y-3">
                        {entry.changes.before && entry.changes.after && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <h4 className="text-sm font-semibold text-red-800 mb-2">Before</h4>
                              <div className="space-y-1 text-xs">
                                {Object.entries(entry.changes.before).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-600">{key}:</span>
                                    <span className="font-medium text-red-800">
                                      {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <h4 className="text-sm font-semibold text-green-800 mb-2">After</h4>
                              <div className="space-y-1 text-xs">
                                {Object.entries(entry.changes.after).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-600">{key}:</span>
                                    <span className="font-medium text-green-800">
                                      {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-green-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm border border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 