import React from 'react';
import { useDNAStore } from '@/store/dnaStore';
import { History as HistoryIcon, Trash2 as Trash2Icon } from 'lucide-react';

export default function SequenceHistory() {
  const { 
    sequences, 
    currentSequence, 
    setCurrentSequence, 
    removeSequence 
  } = useDNAStore();

  if (sequences.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">History</h3>
        <HistoryIcon className="text-gray-500" size={20} />
      </div>

      <div className="space-y-3">
        {sequences.map(seq => (
          <div 
            key={seq.id}
            className={`flex justify-between items-center p-3 rounded-md cursor-pointer
              ${currentSequence?.id === seq.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'}`}
            onClick={() => setCurrentSequence(seq)}
          >
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">
                {seq.sequence.substring(0, 20)}
                {seq.sequence.length > 20 ? '...' : ''}
              </div>
              <div className="text-xs text-gray-500 flex space-x-2">
                <span>{new Date(seq.timestamp).toLocaleTimeString()}</span>
                <span>·</span>
                <span className="capitalize">{seq.analysisType}</span>
                <span>·</span>
                <span className={seq.results.defects.length > 0 ? 'text-red-600' : 'text-green-600'}>
                  {seq.results.defects.length} defects
                </span>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeSequence(seq.id);
              }}
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <Trash2Icon size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}