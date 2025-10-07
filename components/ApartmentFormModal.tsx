
import React, { useState } from 'react';
// FIX: Import CleaningStatus to provide a default value when creating a new apartment.
import { Apartment, CleaningStatus } from '../types';

interface ApartmentFormModalProps {
    apartment?: Apartment;
    onClose: () => void;
    onSave: (data: Omit<Apartment, 'id' | 'personnel'>, id?: string) => Promise<void>;
}

export const ApartmentFormModal: React.FC<ApartmentFormModalProps> = ({ apartment, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: apartment?.name || '',
        address: apartment?.address || '',
        description: apartment?.description || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.address.trim()) {
            alert("Le nom et l'adresse sont obligatoires.");
            return;
        }
        setLoading(true);
        try {
            // FIX: Construct a complete object with status and checklist to satisfy the 'onSave' prop type.
            // When editing, it preserves existing values; when creating, it provides defaults.
            const dataToSave = {
                ...formData,
                status: apartment?.status || CleaningStatus.ToBeCleaned,
                checklist: apartment?.checklist || [],
            };
            await onSave(dataToSave, apartment?.id);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-6 dark:text-slate-100">{apartment ? 'Modifier' : 'Ajouter'} un appartement</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="apt-name" className="text-sm font-medium text-slate-600 dark:text-slate-400">Nom de l'appartement</label>
                                <input id="apt-name" type="text" placeholder="Ex: Le Cocon Urbain" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            </div>
                            <div>
                                <label htmlFor="apt-address" className="text-sm font-medium text-slate-600 dark:text-slate-400">Adresse</label>
                                <input id="apt-address" type="text" placeholder="Ex: 123 Rue de la Paix" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1 w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            </div>
                            <div>
                                <label htmlFor="apt-desc" className="text-sm font-medium text-slate-600 dark:text-slate-400">Description</label>
                                <textarea id="apt-desc" placeholder="Ex: T2 avec balcon, proche du centre..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="mt-1 w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 transition">Annuler</button>
                        <button type="submit" disabled={loading} className="py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-sm disabled:bg-indigo-400">
                            {loading ? 'Sauvegarde...' : (apartment ? 'Enregistrer' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
