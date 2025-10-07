import React, { useState, useRef, useEffect } from 'react';
import { Apartment } from '../types';
import { ChevronDownIcon } from './Icons';

interface ApartmentFilterDropdownProps {
  apartments: Apartment[];
  selectedApartmentIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const ApartmentFilterDropdown: React.FC<ApartmentFilterDropdownProps> = ({ apartments, selectedApartmentIds, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (apartmentId: string) => {
    const newSelection = selectedApartmentIds.includes(apartmentId)
      ? selectedApartmentIds.filter(id => id !== apartmentId)
      : [...selectedApartmentIds, apartmentId];
    onSelectionChange(newSelection);
  };

  const selectAll = () => onSelectionChange(apartments.map(a => a.id));
  const deselectAll = () => onSelectionChange([]);
  
  const selectionText = selectedApartmentIds.length === 0 
    ? "Tous les appartements" 
    : `${selectedApartmentIds.length} appart. sélectionné(s)`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span>{selectionText}</span>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 animate-fade-in">
          <div className="p-2 flex justify-between border-b dark:border-slate-700">
            <button onClick={selectAll} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Tout cocher</button>
            <button onClick={deselectAll} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Tout décocher</button>
          </div>
          <ul className="py-1 max-h-60 overflow-y-auto">
            {apartments.map(apt => (
              <li key={apt.id}>
                <label className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedApartmentIds.includes(apt.id)}
                    onChange={() => handleCheckboxChange(apt.id)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3">{apt.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
