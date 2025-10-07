import React, { useState, useEffect } from 'react';
import { SparklesIcon, ListBulletIcon, ViewColumnsIcon, CalendarIcon, Cog6ToothIcon, ArchiveBoxIcon, ArrowRightStartOnRectangleIcon, QrCodeIcon } from './Icons';
import { Page } from '../types';
import { useAppContext } from '../context/AppContext';

interface NavbarProps {
    onShareClick: () => void;
}

const navItems: { page: Page; label: string; icon: React.FC<{className?: string}>; adminOnly?: boolean }[] = [
    { page: 'flux', label: 'FLUX', icon: ViewColumnsIcon },
    { page: 'reservations', label: 'Réservations', icon: ListBulletIcon },
    { page: 'calendar', label: 'Calendrier', icon: CalendarIcon },
    { page: 'archives', label: 'Archives', icon: ArchiveBoxIcon },
    { page: 'settings', label: 'Paramètres', icon: Cog6ToothIcon, adminOnly: true },
]

export const Navbar: React.FC<NavbarProps> = ({ onShareClick }) => {
    const { logout, currentPage, setCurrentPage, user } = useAppContext();
    const [parisTime, setParisTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const timeString = new Intl.DateTimeFormat('fr-FR', {
                timeZone: 'Europe/Paris',
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(now);
            setParisTime(timeString.replace(',', ' -'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    const visibleNavItems = navItems.filter(item => !item.adminOnly || (user && user.role === 'Admin'));

    return (
        <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40 dark:border-b dark:border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    <div className="flex justify-start items-center gap-10">
                        <button onClick={() => setCurrentPage('flux')} className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
                            <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight hidden sm:block">
                                Gestion Saisonnière
                            </span>
                        </button>
                         <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                           {visibleNavItems.map(item => (
                               <button 
                                    key={item.page}
                                    onClick={() => setCurrentPage(item.page)}
                                    className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${currentPage === item.page ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                               >
                                   <item.icon className="w-5 h-5" />
                                   {item.label}
                                   {currentPage === item.page && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-indigo-500 rounded-full"></span>}
                               </button>
                           ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden lg:inline text-sm font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{parisTime}</span>
                         <div className="hidden md:flex items-center gap-1">
                            <button 
                               onClick={onShareClick}
                               title="Partager l'application"
                               className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                           >
                               <QrCodeIcon className="w-5 h-5"/>
                               <span className="hidden lg:inline">Partager</span>
                           </button>
                           <button onClick={logout} title="Déconnexion" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                               <ArrowRightStartOnRectangleIcon className="w-5 h-5"/>
                               <span className="hidden lg:inline">Déconnexion</span>
                           </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Nav */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/50 flex justify-around p-1 z-50">
                {visibleNavItems.map(item => (
                    <button
                        key={item.page}
                        onClick={() => setCurrentPage(item.page)}
                        className={`flex flex-col items-center p-1 rounded-md transition-colors duration-200 w-full ${currentPage === item.page ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs mt-0.5">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={onShareClick}
                    className="flex flex-col items-center p-1 rounded-md transition-colors w-full text-slate-500 dark:text-slate-400"
                >
                    <QrCodeIcon className="w-6 h-6" />
                    <span className="text-xs mt-0.5">Partager</span>
                </button>
                 <button
                    onClick={logout}
                    className="flex flex-col items-center p-1 rounded-md transition-colors w-full text-slate-500 dark:text-slate-400"
                >
                    <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                    <span className="text-xs mt-0.5">Quitter</span>
                </button>
            </div>
        </header>
    );
};