import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ApartmentCard } from '../components/ApartmentCard';
import { AddApartmentModal } from '../components/AddApartmentModal';
import { ApartmentDetailModal } from '../components/ApartmentDetailModal';
import { Apartment, CleaningStatus, ChecklistItem } from '../types';
import { PlusIcon } from '../components/Icons';

export const Dashboard: React.FC = () => {
  const {
    apartments,
    addApartment,
    updateApartment,
    deleteApartment
  } = useAppContext();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [filter, setFilter] = useState<CleaningStatus | 'all'>('all');

  const filteredApartments = useMemo(() => {
    if (filter === 'all') {
      return apartments;
    }
    return apartments.filter(apt => apt.status === filter);
  }, [apartments, filter]);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openDetailModal = (apartment: Apartment) => setSelectedApartment(apartment);
  const closeDetailModal = () => setSelectedApartment(null);

  const updateApartmentStatus = (id: string, status: CleaningStatus) => {
    updateApartment(id, { status });
  };

  const updateApartmentChecklist = (id: string, checklist: ChecklistItem[]) => {
    updateApartment(id, { checklist });
  };

  // FIX: Create a handler to construct a full apartment object from the modal's partial data,
  // which is necessary because AddApartmentModal doesn't provide a status or checklist item IDs.
  const handleAddApartment = (newApartmentData: Omit<Apartment, 'id' | 'status' | 'checklist'> & { checklist: Omit<ChecklistItem, 'id'>[] }) => {
    const newApartment: Omit<Apartment, 'id'> = {
      ...newApartmentData,
      status: CleaningStatus.ToBeCleaned,
      checklist: newApartmentData.checklist.map((item, index) => ({
        ...item,
        id: `${Date.now()}-${index}`
      }))
    };
    addApartment(newApartment);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Appartements</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter</span>
          </button>
        </div>
        
        <div className="mb-6">
            <div className="flex space-x-2 bg-slate-200 p-1 rounded-lg">
                <button onClick={() => setFilter('all')} className={`w-full py-2 rounded-md text-sm font-medium transition ${filter === 'all' ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-300'}`}>Tous</button>
                <button onClick={() => setFilter(CleaningStatus.ToBeCleaned)} className={`w-full py-2 rounded-md text-sm font-medium transition ${filter === CleaningStatus.ToBeCleaned ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-300'}`}>À nettoyer</button>
                <button onClick={() => setFilter(CleaningStatus.InProgress)} className={`w-full py-2 rounded-md text-sm font-medium transition ${filter === CleaningStatus.InProgress ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-300'}`}>En cours</button>
                <button onClick={() => setFilter(CleaningStatus.Clean)} className={`w-full py-2 rounded-md text-sm font-medium transition ${filter === CleaningStatus.Clean ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-300'}`}>Propre</button>
            </div>
        </div>

        {filteredApartments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApartments.map(apt => (
                    <ApartmentCard key={apt.id} apartment={apt} onSelect={() => openDetailModal(apt)} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-slate-700">Aucun appartement trouvé</h3>
                <p className="text-slate-500 mt-2">Cliquez sur "Ajouter" pour commencer à gérer vos biens.</p>
            </div>
        )}

      {isAddModalOpen && (
        <AddApartmentModal
          onClose={closeAddModal}
          // FIX: Pass the new handler to the modal instead of the raw context function
          // to correctly handle the creation of a new apartment object.
          onAdd={handleAddApartment}
        />
      )}

      {selectedApartment && (
        <ApartmentDetailModal
          apartment={selectedApartment}
          onClose={closeDetailModal}
          onUpdateStatus={updateApartmentStatus}
          onUpdateChecklist={updateApartmentChecklist}
          onDelete={deleteApartment}
        />
      )}
    </div>
  );
};