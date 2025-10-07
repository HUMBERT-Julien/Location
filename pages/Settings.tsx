import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Task, Apartment } from '../types';
import { PencilIcon, TrashIcon, PlusIcon } from '../components/Icons';
import { ApartmentFormModal } from '../components/ApartmentFormModal';

const UserFormModal: React.FC<{
    user?: User;
    onClose: () => void;
    onSave: (data: User | Omit<User, 'id'>) => Promise<void>;
}> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'Personnel',
        tasks: user?.tasks || [],
    });
    const [loading, setLoading] = useState(false);
    const handleTaskChange = (task: Task) => setFormData(prev => ({ ...prev, tasks: prev.tasks.includes(task) ? prev.tasks.filter(t => t !== task) : [...prev.tasks, task] }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const dataToUpdate = { name: formData.name, email: formData.email, role: formData.role as 'Admin' | 'Personnel', tasks: formData.tasks };
        try {
            if (user) {
                await onSave({ ...user, ...dataToUpdate });
            } else {
                await onSave({ ...dataToUpdate, password: formData.password });
            }
            onClose();
        } catch (error) { console.error(error); alert("Erreur."); } 
        finally { setLoading(false); }
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-6 dark:text-slate-100">{user ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Nom" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            <input type="email" placeholder="Email" disabled={!!user} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed" required />
                            {!user && <input type="password" placeholder="Mot de passe" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />}
                            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as 'Admin' | 'Personnel'})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                <option value="Personnel">Personnel</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div>
                                <label className="font-medium dark:text-slate-200">Tâches</label>
                                <div className="mt-2 space-y-2">
                                    {Object.values(Task).map(task => (
                                        <div key={task} className="flex items-center">
                                            <input type="checkbox" id={task} checked={formData.tasks.includes(task)} onChange={() => handleTaskChange(task)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 dark:bg-slate-600 text-indigo-600 focus:ring-indigo-500" />
                                            <label htmlFor={task} className="ml-2 text-sm text-slate-700 dark:text-slate-300">{task}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 transition">Annuler</button>
                        <button type="submit" disabled={loading} className="py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-sm disabled:bg-indigo-400">
                            {loading ? 'Sauvegarde...' : (user ? 'Enregistrer' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const Settings: React.FC = () => {
    const { users, updateUser, register, apartments, addApartment, updateApartment, deleteApartment, deleteArchivedReservationsBefore } = useAppContext();

    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
    const [isApartmentModalOpen, setApartmentModalOpen] = useState(false);
    const [editingApartment, setEditingApartment] = useState<Apartment | undefined>(undefined);
    const [archiveDate, setArchiveDate] = useState('');
    
    // User management
    const handleSaveUser = async (userData: User | Omit<User, 'id'>) => {
        if ('id' in userData) { await updateUser(userData.id, userData); } 
        else { await register(userData); }
    };
    const openAddUserModal = () => { setEditingUser(undefined); setUserModalOpen(true); };
    const openEditUserModal = (user: User) => { setEditingUser(user); setUserModalOpen(true); };

    // Apartment management
    const handleSaveApartment = async (data: Omit<Apartment, 'id' | 'personnel'>, id?: string) => {
       if (id) { 
         await updateApartment(id, data); 
       } else { 
         await addApartment({ ...data, personnel: {} }); 
       }
    };
    const openAddApartmentModal = () => { setEditingApartment(undefined); setApartmentModalOpen(true); };
    const openEditApartmentModal = (apt: Apartment) => { setEditingApartment(apt); setApartmentModalOpen(true); };
    const handleDeleteApartment = async (aptId: string) => { if (window.confirm("Supprimer cet appartement ?")) { await deleteApartment(aptId); }};

    // Personnel management
    const usersByTask = useMemo(() => {
        const result: { [key in Task]: User[] } = { [Task.Concierge]: [], [Task.Cleaning]: [], [Task.Laundry]: [] };
        users.forEach(user => user.tasks.forEach(task => result[task].push(user)));
        return result;
    }, [users]);
    const handlePersonnelChange = async (aptId: string, task: Task, userId: string) => {
        const apt = apartments.find(a => a.id === aptId);
        if(!apt) return;
        const newPersonnel = { ...apt.personnel, [task]: userId || undefined };
        if (!userId) delete newPersonnel[task];
        await updateApartment(aptId, { personnel: newPersonnel });
    };

    // Data management
    const handleArchiveDelete = async () => {
        if (!archiveDate) { alert("Veuillez sélectionner une date."); return; }
        const date = new Date(archiveDate + 'T00:00:00');
        if (window.confirm(`Supprimer archives avant le ${date.toLocaleDateString('fr-FR')}?`)) {
            await deleteArchivedReservationsBefore(date);
            alert("Anciennes archives supprimées.");
            setArchiveDate(''); 
        }
    }
    
    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Paramètres</h1>

            {/* Apartment Management */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-slate-100">Appartements</h2>
                    <button onClick={openAddApartmentModal} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-indigo-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500">
                        <PlusIcon className="w-4 h-4" /> Ajouter
                    </button>
                </div>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50">
                            <tr><th className="p-3 rounded-tl-lg">Nom</th><th className="p-3">Adresse</th><th className="p-3 rounded-tr-lg"></th></tr>
                        </thead>
                        <tbody>
                            {apartments.map((apt, index) => (
                                <tr key={apt.id} className={`border-b dark:border-slate-700 ${index % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <td className="p-3 font-medium dark:text-slate-200">{apt.name}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{apt.address}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => openEditApartmentModal(apt)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><PencilIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteApartment(apt.id)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {apartments.map(apt => (
                        <div key={apt.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border dark:border-slate-700">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold dark:text-slate-200">{apt.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{apt.address}</p>
                                </div>
                                <div>
                                    <button onClick={() => openEditApartmentModal(apt)} className="p-2"><PencilIcon className="w-5 h-5 text-slate-500" /></button>
                                    <button onClick={() => handleDeleteApartment(apt.id)} className="p-2"><TrashIcon className="w-5 h-5 text-slate-500" /></button>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Management */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-slate-100">Utilisateurs</h2>
                    <button onClick={openAddUserModal} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-indigo-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500">
                        <PlusIcon className="w-4 h-4" /> Ajouter
                    </button>
                </div>
                 {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50">
                            <tr><th className="p-3 rounded-tl-lg">Nom</th><th className="p-3">Email</th><th className="p-3">Rôle</th><th className="p-3">Tâches</th><th className="p-3 rounded-tr-lg"></th></tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className={`border-b dark:border-slate-700 ${index % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <td className="p-3 font-medium dark:text-slate-200">{user.name}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{user.email}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{user.role}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{user.tasks.join(', ')}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => openEditUserModal(user)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><PencilIcon className="w-5 h-5" /></button>
                                        <span className="inline-block p-2 text-slate-300 dark:text-slate-600 cursor-not-allowed" title="Supprimer depuis la console Firebase"><TrashIcon className="w-5 h-5" /></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* Mobile Cards */}
                 <div className="md:hidden space-y-3">
                    {users.map(user => (
                        <div key={user.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border dark:border-slate-700">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold dark:text-slate-200">{user.name} <span className="text-xs font-normal bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">{user.role}</span></p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tâches: {user.tasks.join(', ') || 'Aucune'}</p>
                                </div>
                                <div>
                                    <button onClick={() => openEditUserModal(user)} className="p-2"><PencilIcon className="w-5 h-5 text-slate-500" /></button>
                                    <span className="inline-block p-2 text-slate-300 dark:text-slate-600 cursor-not-allowed"><TrashIcon className="w-5 h-5" /></span>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Apartment Personnel */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-slate-700/50">
                <h2 className="text-xl font-semibold dark:text-slate-100 mb-4">Personnel par appartement</h2>
                <div className="space-y-4">
                    {apartments.map(apt => (
                        <div key={apt.id} className="p-4 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-semibold dark:text-slate-200">{apt.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {Object.values(Task).map(task => (
                                    <div key={task}>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{task}</label>
                                        <select
                                            value={apt.personnel?.[task] || ''}
                                            onChange={(e) => handlePersonnelChange(apt.id, task, e.target.value)}
                                            className="w-full mt-1 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        >
                                            <option value="">Non assigné</option>
                                            {usersByTask[task].map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Data Management */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-slate-700/50">
                <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Gestion des données</h2>
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4">
                    <div>
                        <label className="text-sm font-medium dark:text-slate-300">Supprimer les archives avant le :</label>
                        <input type="date" value={archiveDate} onChange={e => setArchiveDate(e.target.value)} className="w-full mt-1 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    <button onClick={handleArchiveDelete} className="mt-2 sm:mt-0 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-700 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-850 focus:ring-red-500">Supprimer</button>
                </div>
            </div>

            {isUserModalOpen && <UserFormModal user={editingUser} onClose={() => setUserModalOpen(false)} onSave={handleSaveUser} />}
            {isApartmentModalOpen && <ApartmentFormModal apartment={editingApartment} onClose={() => setApartmentModalOpen(false)} onSave={handleSaveApartment} />}
        </div>
    );
};
