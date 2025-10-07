import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ReservationStatus } from '../types';
import { TrashIcon } from '../components/Icons';

export const Archives: React.FC = () => {
    const { reservations, apartments, deleteReservation } = useAppContext();

    const apartmentMap = useMemo(() => new Map(apartments.map(a => [a.id, a.name])), [apartments]);

    const archivedReservations = useMemo(() =>
        reservations
            .filter(r => r.status === ReservationStatus.Archived)
            .sort((a, b) => new Date(b.departure).getTime() - new Date(a.departure).getTime())
    , [reservations]);

    const handleDelete = (reservationId: string) => {
        if (window.confirm("Supprimer définitivement cette archive ?")) {
            deleteReservation(reservationId);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Archives</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {archivedReservations.length} réservation(s) archivée(s)
                </p>
            </div>
            
             {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-x-auto border dark:border-slate-700/50">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-4">Locataire</th>
                            <th scope="col" className="px-6 py-4">Appartement</th>
                            <th scope="col" className="px-6 py-4">Départ</th>
                            <th scope="col" className="px-6 py-4">Remarques</th>
                            <th scope="col" className="px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {archivedReservations.map((res, index) => (
                            <tr key={res.id} className={`border-b dark:border-slate-700 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{res.tenantName} ({res.guestCount} pers.)</td>
                                <td className="px-6 py-4">{apartmentMap.get(res.apartmentId)}</td>
                                <td className="px-6 py-4">{formatDate(res.departure)}</td>
                                <td className="px-6 py-4 max-w-xs truncate" title={res.remarks}>{res.remarks}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(res.id)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {archivedReservations.length === 0 && <p className="text-center p-8 text-slate-500 dark:text-slate-400">Aucune réservation archivée.</p>}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                 {archivedReservations.map(res => (
                    <div key={res.id} className="bg-white dark:bg-slate-800 shadow-lg rounded-xl border dark:border-slate-700/50 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{res.tenantName} ({res.guestCount} pers.)</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{apartmentMap.get(res.apartmentId)}</p>
                            </div>
                            <button onClick={() => handleDelete(res.id)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-sm space-y-2 border-t dark:border-slate-700 pt-3">
                            <p><b>Départ:</b> {formatDate(res.departure)}</p>
                            {res.remarks && <p><b>Remarques:</b> <span className="italic opacity-80">{res.remarks}</span></p>}
                        </div>
                    </div>
                ))}
                 {archivedReservations.length === 0 && <p className="text-center p-8 text-slate-500 dark:text-slate-400">Aucune réservation archivée.</p>}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                Utilisez la page Paramètres pour supprimer en masse les anciennes archives.
            </p>
        </div>
    );
};
