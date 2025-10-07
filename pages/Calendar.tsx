import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ApartmentFilterDropdown } from '../components/ApartmentFilterDropdown';
import { ReservationStatus } from '../types';

export const Calendar: React.FC = () => {
    const { reservations, apartments } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedApartmentIds, setSelectedApartmentIds] = useState<string[]>([]);

    const apartmentMap = useMemo(() => new Map(apartments.map(a => [a.id, a.name])), [apartments]);

    const filteredReservations = useMemo(() => {
        const now = new Date();
        return reservations.filter(res => {
            const isApartmentSelected = selectedApartmentIds.length === 0 || selectedApartmentIds.includes(res.apartmentId);
            if (!isApartmentSelected) {
                return false;
            }
            return res.status !== ReservationStatus.Archived || new Date(res.departure) > now;
        });
    }, [reservations, selectedApartmentIds]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1; // 0=Mon, 6=Sun
    
    const daysInMonth = [];
    for (let i = 0; i < startDay; i++) {
        daysInMonth.push(null);
    }
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
        daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    
    const eventsByDate = useMemo(() => {
        const events: { [key: string]: { type: 'arrival' | 'departure', tenant: string, apartmentName: string, time: string }[] } = {};
        const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'});
        
        filteredReservations.forEach(res => {
            const apartmentName = apartmentMap.get(res.apartmentId) || 'N/A';
            const arrivalDate = new Date(res.arrival).toDateString();
            const departureDate = new Date(res.departure).toDateString();

            if (!events[arrivalDate]) events[arrivalDate] = [];
            events[arrivalDate].push({ type: 'arrival', tenant: res.tenantName, apartmentName, time: formatTime(res.arrival) });

            if (!events[departureDate]) events[departureDate] = [];
            events[departureDate].push({ type: 'departure', tenant: res.tenantName, apartmentName, time: formatTime(res.departure) });
        });
        return events;
    }, [filteredReservations, apartmentMap]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };
    
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    const weeklyArrivals = filteredReservations
        .filter(r => { const d = new Date(r.arrival); return d >= startOfWeek && d <= endOfWeek; })
        .sort((a,b) => new Date(a.arrival).getTime() - new Date(b.arrival).getTime());
    
    const weeklyDepartures = filteredReservations
        .filter(r => { const d = new Date(r.departure); return d >= startOfWeek && d <= endOfWeek; })
        .sort((a,b) => new Date(a.departure).getTime() - new Date(b.departure).getTime());

    const formatWeeklyDate = (dateString: string) => new Date(dateString).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Calendrier</h1>
                 <ApartmentFilterDropdown
                    apartments={apartments}
                    selectedApartmentIds={selectedApartmentIds}
                    onSelectionChange={setSelectedApartmentIds}
                />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">&lt;</button>
                    <h2 className="font-semibold text-lg dark:text-slate-200">{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-px text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 border-l border-t border-slate-200 dark:border-slate-700">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => <div key={day} className="font-semibold p-2 bg-slate-100 dark:bg-slate-800">{day}</div>)}
                    {daysInMonth.map((day, index) => (
                        <div key={index} className={`relative min-h-28 p-1 text-left ${day ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                            {day && (
                                <>
                                    <span className={`text-xs ${new Date().toDateString() === day.toDateString() ? 'bg-indigo-600 text-white rounded-full px-1.5 py-0.5 font-bold' : ''}`}>
                                        {day.getDate()}
                                    </span>
                                    <div className="text-[10px] space-y-0.5 mt-1">
                                        {(eventsByDate[day.toDateString()] || []).map((event, i) => (
                                            <div key={i} title={`${event.tenant} (${event.time}) - ${event.apartmentName}`} className={`truncate p-1 rounded ${event.type === 'arrival' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'}`}>
                                                {event.tenant} ({event.time})
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border dark:border-slate-700/50">
                    <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3 border-b-2 border-green-200 dark:border-green-800 pb-2">Arrivées de la semaine</h3>
                    <ul className="space-y-2">
                        {weeklyArrivals.map(r => <li key={r.id} className="text-sm p-2 bg-green-50 dark:bg-green-500/10 rounded-lg"><b>{formatWeeklyDate(r.arrival)}:</b> {r.tenantName} - <i className="opacity-80">{apartmentMap.get(r.apartmentId)}</i></li>)}
                        {weeklyArrivals.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">Aucune arrivée cette semaine.</p>}
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border dark:border-slate-700/50">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 border-b-2 border-red-200 dark:border-red-800 pb-2">Départs de la semaine</h3>
                     <ul className="space-y-2">
                        {weeklyDepartures.map(r => <li key={r.id} className="text-sm p-2 bg-red-50 dark:bg-red-500/10 rounded-lg"><b>{formatWeeklyDate(r.departure)}:</b> {r.tenantName} - <i className="opacity-80">{apartmentMap.get(r.apartmentId)}</i></li>)}
                        {weeklyDepartures.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">Aucun départ cette semaine.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};
