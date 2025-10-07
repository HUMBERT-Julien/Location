
import React, { useState, useEffect } from 'react';
import { Apartment, ChecklistItem, CleaningStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { XMarkIcon, MapPinIcon, TrashIcon } from './Icons';

interface ApartmentDetailModalProps {
  apartment: Apartment;
  onClose: () => void;
  onUpdateStatus: (id: string, status: CleaningStatus) => void;
  onUpdateChecklist: (id: string, checklist: ChecklistItem[]) => void;
  onDelete: (id: string) => void;
}

const statusOptions = [
    CleaningStatus.ToBeCleaned,
    CleaningStatus.InProgress,
    CleaningStatus.Clean
];

export const ApartmentDetailModal: React.FC<ApartmentDetailModalProps> = ({ apartment, onClose, onUpdateStatus, onUpdateChecklist, onDelete }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(apartment.checklist);

  useEffect(() => {
    onUpdateChecklist(apartment.id, checklist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklist]);

  const handleCheckItem = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const handleStatusChange = (newStatus: CleaningStatus) => {
    onUpdateStatus(apartment.id, newStatus);
  };

  const handleDelete = () => {
      if(window.confirm(`Êtes-vous sûr de vouloir supprimer "${apartment.name}" ?`)){
          onDelete(apartment.id);
          onClose();
      }
  }

  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col transform transition-all">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{apartment.name}</h2>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>{apartment.address}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">
              <StatusBadge status={apartment.status} />
          </div>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <h3 className="text-base font-semibold mb-2 text-slate-800 dark:text-slate-200">Checklist de nettoyage</h3>
          <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300 mb-2">
                <span>Progression ({completedTasks}/{totalTasks})</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
            <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}>
            </div>
          </div>
          <ul className="space-y-3">
            {checklist.map(item => (
              <li key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.completed}
                  onChange={() => handleCheckItem(item.id)}
                  className="h-5 w-5 rounded border-slate-300 dark:bg-slate-700 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor={item.id} className={`ml-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                  {item.text}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Changer le statut</label>
            <div className="flex space-x-2">
                {statusOptions.map(status => (
                    <button 
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`w-full py-2 px-2 text-center text-sm font-medium rounded-md transition-colors ${apartment.status === status ? 'bg-indigo-600 text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <button
              onClick={handleDelete}
              className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Supprimer l'appartement
            </button>
        </div>
      </div>
    </div>
  );
};