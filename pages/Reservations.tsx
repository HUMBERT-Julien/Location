import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Reservation, User, Task, ReservationStatus } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from '../components/Icons';

const ReservationForm: React.FC<{
    onCancel: () => void;
    onSave: (data: Omit<Reservation, 'id' | 'status'>, id?: string) => void;
    reservation?: Reservation;
}> = ({ onCancel, onSave, reservation }) => {
    const { apartments, users } = useAppContext();
    
    const [formData, setFormData] = useState(() => {
        const now = new Date();
        const arrivalDate = reservation?.arrival ? new Date(reservation.arrival) : now;
        const departureDate = reservation?.departure ? new Date(reservation.departure) : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

        const toISODateString = (date: Date) => date.toISOString().split('T')[0];
        const toISOTimeString = (date: Date) => {
            const pad = (num: number) => num.toString().padStart(2, '0');
            return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        return {
            apartmentId: reservation?.apartmentId || '',
            tenantName: reservation?.tenantName || '',
            guestCount: reservation?.guestCount || 1,
            arrivalDate: toISODateString(arrivalDate),
            arrivalTime: toISOTimeString(arrivalDate),
            departureDate: toISODateString(departureDate),
            departureTime: toISOTimeString(departureDate),
            remarks: reservation?.remarks || '',
            personnel: reservation?.personnel || {},
        };
    });
    
    useEffect(() => {
        if (!reservation && formData.apartmentId) {
            const selectedApartment = apartments.find(a => a.id === formData.apartmentId);
            setFormData(prev => ({
                ...prev,
                personnel: selectedApartment?.personnel || {}
            }));
        }
    }, [formData.apartmentId, apartments, reservation]);

    const usersByTask = useMemo(() => {
        const result: { [key in Task]: User[] } = { [Task.Concierge]: [], [Task.Cleaning]: [], [Task.Laundry]: [] };
        users.forEach(user => user.tasks.forEach(task => result[task].push(user)));
        return result;
    }, [users]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePersonnelChange = (task: Task, userId: string) => {
        setFormData(prev => ({ ...prev, personnel: { ...prev.personnel, [task]: userId || undefined } }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const arrival = new Date(`${formData.arrivalDate}T${formData.arrivalTime || '12:00'}`).toISOString();
        const departure = new Date(`${formData.departureDate}T${formData.departureTime || '12:00'}`).toISOString();

        const reservationData = {
            apartmentId: formData.apartmentId,
            tenantName: formData.tenantName,
            guestCount: Number(formData.guestCount),
            arrival,
            departure,
            remarks: formData.remarks,
            personnel: formData.personnel,
        };
        
        onSave(reservationData, reservation?.id);
    };

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto animate-fade-in">
             <div className="flex items-center mb-6">
                <button onClick={onCancel} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5"/>
                    Retour à la liste
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border dark:border-slate-700/50">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 sm:p-8">
                        <h2 className="text-2xl font-bold dark:text-slate-100 mb-8">{reservation ? 'Modifier' : 'Ajouter'} une réservation</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Appartement</label>
                                <select name="apartmentId" value={formData.apartmentId} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required>
                                    <option value="">Sélectionner...</option>
                                    {apartments.map(apt => <option key={apt.id} value={apt.id}>{apt.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom du locataire</label>
                                <input name="tenantName" type="text" value={formData.tenantName} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de personnes</label>
                                <input name="guestCount" type="number" min="1" value={formData.guestCount} onChange={handleChange} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            </div>
                             <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Arrivée</label>
                                <div className="space-y-2 mt-1">
                                    <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                                    <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} className="block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                                </div>
                            </div>
                             <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Départ</label>
                                <div className="space-y-2 mt-1">
                                    <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} className="block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                                    <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} className="block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Remarques</label>
                                <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                            </div>
                            <div className="md:col-span-2 border-t dark:border-slate-700 pt-6 mt-4">
                                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Personnel assigné</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {Object.values(Task).map(task => (
                                        <div key={task}>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{task}</label>
                                            <select 
                                                value={formData.personnel[task] || ''} 
                                                onChange={e => handlePersonnelChange(task, e.target.value)}
                                                className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            >
                                                <option value="">Non assigné</option>
                                                {usersByTask[task].map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t dark:border-slate-700">
                        <button type="button" onClick={onCancel} className="py-2 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 transition">Annuler</button>
                        <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-sm">{reservation ? 'Enregistrer' : 'Ajouter'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Reservations: React.FC = () => {
    const { reservations, apartments, users, deleteReservation, addReservation, updateReservation } = useAppContext();
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingReservation, setEditingReservation] = useState<Reservation | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const apartmentMap = useMemo(() => new Map(apartments.map(a => [a.id, a.name])), [apartments]);
    const userMap = useMemo(() => new Map(users.map(u => [u.id, u.name])), [users]);

    const filteredReservations = useMemo(() =>
        reservations
            .filter(r => r.status !== ReservationStatus.Archived)
            .filter(r => r.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || apartmentMap.get(r.apartmentId)?.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => new Date(b.arrival).getTime() - new Date(a.arrival).getTime())
    , [reservations, searchQuery, apartmentMap]);

    const handleAddNew = () => { setEditingReservation(undefined); setView('form'); };
    const handleEdit = (reservation: Reservation) => { setEditingReservation(reservation); setView('form'); };
    const handleDelete = (reservationId: string) => { if (window.confirm("Supprimer cette réservation ?")) { deleteReservation(reservationId); } };
    const handleCancelForm = () => setView('list');
    
    const handleSaveForm = (data: Omit<Reservation, 'id' | 'status'>, id?: string) => {
        if (id) {
            updateReservation(id, data);
        } else {
            addReservation({ ...data, status: ReservationStatus.Cleaning, cleaningCompleted: false, laundryCompleted: false });
        }
        setView('list');
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    if (view === 'form') {
        return <ReservationForm onCancel={handleCancelForm} onSave={handleSaveForm} reservation={editingReservation} />
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Réservations</h1>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-850 focus:ring-indigo-500">
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Nouvelle réservation</span>
                </button>
            </div>

            <div className="mb-4">
                <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full max-w-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-200 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-x-auto border dark:border-slate-700/50">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-4">Locataire</th>
                            <th scope="col" className="px-6 py-4">Appartement</th>
                            <th scope="col" className="px-6 py-4">Arrivée</th>
                            <th scope="col" className="px-6 py-4">Départ</th>
                            <th scope="col" className="px-6 py-4">Personnel</th>
                            <th scope="col" className="px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.map((res, index) => (
                            <tr key={res.id} className={`border-b dark:border-slate-700 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{res.tenantName} ({res.guestCount} pers.)</td>
                                <td className="px-6 py-4">{apartmentMap.get(res.apartmentId)}</td>
                                <td className="px-6 py-4">{formatDate(res.arrival)}</td>
                                <td className="px-6 py-4">{formatDate(res.departure)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-xs gap-1">
                                        {Object.values(Task).map(task => res.personnel[task] && <span key={task}><b>{task}:</b> {userMap.get(res.personnel[task]!)}</span>)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                                    <button onClick={() => handleEdit(res)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700"><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(res.id)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"><TrashIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredReservations.length === 0 && <p className="text-center p-8 text-slate-500 dark:text-slate-400">Aucune réservation trouvée.</p>}
            </div>

             {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredReservations.map(res => (
                    <div key={res.id} className="bg-white dark:bg-slate-800 shadow-lg rounded-xl border dark:border-slate-700/50 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{res.tenantName} ({res.guestCount} pers.)</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{apartmentMap.get(res.apartmentId)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleEdit(res)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><PencilIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(res.id)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="text-sm space-y-2 border-t dark:border-slate-700 pt-3">
                            <p><b>Arrivée:</b> {formatDate(res.arrival)}</p>
                            <p><b>Départ:</b> {formatDate(res.departure)}</p>
                            <div>
                                <p className="font-semibold">Personnel:</p>
                                <div className="pl-2 text-xs">
                                     {Object.values(Task).map(task => res.personnel[task] && <p key={task}><b>{task}:</b> {userMap.get(res.personnel[task]!)}</p>)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredReservations.length === 0 && <p className="text-center p-8 text-slate-500 dark:text-slate-400">Aucune réservation trouvée.</p>}
            </div>
        </div>
    );
};
