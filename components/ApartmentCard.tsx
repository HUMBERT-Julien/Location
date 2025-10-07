
import React from 'react';
import { Apartment } from '../types';
import { StatusBadge } from './StatusBadge';
// FIX: Remove unused CheckCircleIcon and import the newly created MapPinIcon.
import { MapPinIcon } from './Icons';

interface ApartmentCardProps {
  apartment: Apartment;
  onSelect: () => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onSelect }) => {
    const completedTasks = apartment.checklist.filter(item => item.completed).length;
    const totalTasks = apartment.checklist.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between"
    >
        <div className="p-5">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight">{apartment.name}</h3>
                <StatusBadge status={apartment.status} />
            </div>
            <div className="flex items-center text-slate-500 text-sm mt-2">
                <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                <span>{apartment.address}</span>
            </div>
        </div>

        <div className="p-5 bg-slate-50">
            <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                <span>Progression</span>
                <span className="font-medium">{completedTasks} / {totalTasks} tâches</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}>
                </div>
            </div>
        </div>
    </div>
  );
};
