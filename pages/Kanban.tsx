import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Reservation, ReservationStatus, Apartment } from '../types';
import { ApartmentFilterDropdown } from '../components/ApartmentFilterDropdown';
import { UserGroupIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, SparklesIcon, ArchiveBoxXMarkIcon, ShareIcon, HomeIcon, ChevronDownIcon } from '../components/Icons';

const ReservationCard: React.FC<{
    res: Reservation;
    apartmentName: string;
    onAddRemark: (res: Reservation, remark: string) => void;
    onShare: (res: Reservation) => void;
    onCleaningDone: (id: string) => void;
    onLaundryDone: (id: string) => void;
}> = ({ res, apartmentName, onAddRemark, onShare, onCleaningDone, onLaundryDone }) => {
    const [remark, setRemark] = useState('');

    const handleAddRemark = () => {
        onAddRemark(res, remark);
        setRemark('');
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };
    
    const allTasksDone = res.cleaningCompleted && res.laundryCompleted;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{res.tenantName}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{res.guestCount} personne(s)</span>
                    </div>
                </div>
                <button onClick={() => onShare(res)} title="Partager" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <ShareIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4 space-y-4 flex-grow">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Arrivée:</span>
                            <span className="ml-1 text-slate-600 dark:text-slate-400">{formatDate(res.arrival)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Départ:</span>
                            <span className="ml-1 text-slate-600 dark:text-slate-400">{formatDate(res.departure)}</span>
                        </div>
                    </div>
                </div>
                {res.remarks && (
                    <div className="text-sm p-3 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 rounded-r-md whitespace-pre-wrap">
                        <h5 className="font-semibold mb-1">Remarques:</h5>
                        <p className="opacity-90">{res.remarks}</p>
                    </div>
                )}
                <div className="space-y-2 pt-2">
                    <textarea 
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Ajouter une remarque..."
                        rows={2}
                        className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-1.5 px-2 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <button onClick={handleAddRemark} className="w-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-1.5 px-3 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        Ajouter la remarque
                    </button>
                </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg border-t border-slate-200 dark:border-slate-700/80">
                 {allTasksDone ? (
                    <div className="text-center text-sm font-semibold text-green-600 dark:text-green-400 py-2">
                        Tâches terminées
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            onClick={() => onCleaningDone(res.id)}
                            disabled={res.cleaningCompleted}
                            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-all transform active:scale-[0.98] ${
                                res.cleaningCompleted
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                            }`}
                        >
                            <SparklesIcon className="w-5 h-5" />
                            {res.cleaningCompleted ? 'Ménage Fait' : 'Valider Ménage'}
                        </button>
                        <button
                            onClick={() => onLaundryDone(res.id)}
                            disabled={res.laundryCompleted}
                            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-all transform active:scale-[0.98] ${
                                res.laundryCompleted
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                            }`}
                        >
                            <ArchiveBoxXMarkIcon className="w-5 h-5" />
                            {res.laundryCompleted ? 'Linge Fait' : 'Valider Linge'}
                        </button>
                    </div>
                )}
            </div>
       </div>
    );
};


export const Flux: React.FC = () => {
    const { apartments, reservations, updateReservation, setCurrentPage } = useAppContext();
    const [selectedDesktopApartmentIds, setSelectedDesktopApartmentIds] = useState<string[]>([]);
    const [selectedMobileApartment, setSelectedMobileApartment] = useState<string | 'all'>('all');
    
    const apartmentMap = useMemo(() => new Map(apartments.map(apt => [apt.id, apt.name])), [apartments]);

    const activeReservations = useMemo(() => reservations.filter(
        r => r.status === ReservationStatus.Cleaning || r.status === ReservationStatus.Laundry
    ).sort((a,b) => new Date(a.departure).getTime() - new Date(b.departure).getTime()), [reservations]);

    useEffect(() => {
        const checkReservationsToArchive = () => {
            const now = new Date();
            activeReservations.forEach(res => {
                if (res.cleaningCompleted && res.laundryCompleted) {
                    const departureDate = new Date(res.departure);
                    if (departureDate < now) {
                        updateReservation(res.id, { status: ReservationStatus.Archived });
                    }
                }
            });
        };
        // Check frequently to archive soon after departure time passes
        const intervalId = setInterval(checkReservationsToArchive, 60 * 1000); // every minute
        return () => clearInterval(intervalId);
    }, [activeReservations, updateReservation]);


    const desktopFilteredApartments = useMemo(() => {
        if (selectedDesktopApartmentIds.length === 0) return apartments;
        return apartments.filter(apt => selectedDesktopApartmentIds.includes(apt.id));
    }, [apartments, selectedDesktopApartmentIds]);

    const mobileFilteredReservations = useMemo(() => {
        if (selectedMobileApartment === 'all') return activeReservations;
        return activeReservations.filter(res => res.apartmentId === selectedMobileApartment);
    }, [activeReservations, selectedMobileApartment]);
    
    const handleCleaningDone = (resId: string) => {
        updateReservation(resId, { cleaningCompleted: true });
    };

    const handleLaundryDone = (resId: string) => {
        updateReservation(resId, { laundryCompleted: true });
    };
    
    const handleAddRemark = (reservation: Reservation, newRemark: string) => {
        if (!newRemark || !newRemark.trim()) return;
        const existingRemarks = reservation.remarks ? `${reservation.remarks}\n` : '';
        const updatedRemarks = `${existingRemarks}- ${newRemark}`;
        updateReservation(reservation.id, { remarks: updatedRemarks });
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const handleShare = async (reservation: Reservation) => {
        const apartmentName = apartmentMap.get(reservation.apartmentId) || 'Appartement inconnu';
        const textToShare = `Détails de la réservation:\n- Locataire: ${reservation.tenantName}\n- Appartement: ${apartmentName}\n- Arrivée: ${formatDate(reservation.arrival)}\n- Départ: ${formatDate(reservation.departure)}`;

        if (navigator.share) {
            try { await navigator.share({ title: `Détails pour ${reservation.tenantName}`, text: textToShare }); } 
            catch (error) { console.error('Erreur de partage:', error); }
        } else {
             try { await navigator.clipboard.writeText(textToShare); alert('Détails copiés !'); } 
             catch (err) { alert("Partage non supporté."); }
        }
    };

    if (apartments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-4">
                 <HomeIcon className="w-16 h-16 text-indigo-300 dark:text-indigo-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Bienvenue !</h2>
                <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">Commencez par configurer vos appartements pour voir apparaître les tâches ici.</p>
                <button 
                    onClick={() => setCurrentPage('settings')}
                    className="mt-6 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-850 focus:ring-indigo-500"
                >
                    Ajouter mon premier appartement
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 h-[calc(100vh-125px)] md:h-[calc(100vh-57px)] flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:flex flex-wrap gap-4 justify-between items-center mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">FLUX</h1>
                <ApartmentFilterDropdown
                    apartments={apartments}
                    selectedApartmentIds={selectedDesktopApartmentIds}
                    onSelectionChange={setSelectedDesktopApartmentIds}
                />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden mb-4 flex-shrink-0">
                 <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">FLUX</h1>
                 </div>
                 <div className="relative">
                    <select
                      value={selectedMobileApartment}
                      onChange={(e) => setSelectedMobileApartment(e.target.value)}
                      className="w-full appearance-none bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 px-4 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">Tous les appartements</option>
                      {apartments.map(apt => (
                        <option key={apt.id} value={apt.id}>{apt.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                 </div>
            </div>

            {/* Desktop Kanban View */}
            <div className="hidden md:flex gap-6 overflow-x-auto pb-4 flex-grow">
                {desktopFilteredApartments.map(apt => (
                    <div key={apt.id} className="flex-shrink-0 w-80 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl flex flex-col">
                        <div className="p-3 font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-slate-200 dark:border-slate-700/50 sticky top-0 bg-slate-100 dark:bg-slate-850 rounded-t-xl z-10">
                            {apt.name}
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto h-full">
                            {activeReservations.filter(r => r.apartmentId === apt.id).length > 0 ? 
                                activeReservations.filter(r => r.apartmentId === apt.id).map(res => (
                                    <ReservationCard 
                                        key={res.id} 
                                        res={res} 
                                        apartmentName={apt.name}
                                        onAddRemark={handleAddRemark}
                                        onShare={handleShare}
                                        onCleaningDone={handleCleaningDone}
                                        onLaundryDone={handleLaundryDone}
                                    />
                                )) : <p className="text-sm text-slate-400 dark:text-slate-500 p-4 text-center">Aucune tâche en cours.</p>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-4 overflow-y-auto pb-4 flex-grow">
                {mobileFilteredReservations.length > 0 ? 
                    mobileFilteredReservations.map(res => (
                        <ReservationCard 
                            key={res.id} 
                            res={res} 
                            apartmentName={apartmentMap.get(res.apartmentId) || ''}
                            onAddRemark={handleAddRemark}
                            onShare={handleShare}
                            onCleaningDone={handleCleaningDone}
                            onLaundryDone={handleLaundryDone}
                        />
                )) : <p className="text-sm text-slate-400 dark:text-slate-500 p-8 text-center">Aucune tâche en cours pour cette sélection.</p>}
            </div>
        </div>
    );
};
