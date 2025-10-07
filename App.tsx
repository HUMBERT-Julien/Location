import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Reservations } from './pages/Reservations';
import { Flux } from './pages/Kanban';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';
import { Archives } from './pages/Archives';
import { useAppContext } from './context/AppContext';
import { Auth } from './pages/Auth';
import { ArrowPathIcon } from './components/Icons';
import { ShareAppModal } from './components/ShareAppModal';
import { Page } from './types';

const PageContent: React.FC<{ currentPage: Page }> = ({ currentPage }) => {
    const { user } = useAppContext();
    
    if (currentPage === 'settings' && user?.role !== 'Admin') {
      return <Flux />;
    }

    switch (currentPage) {
        case 'flux':
            return <Flux />;
        case 'reservations':
            return <Reservations />;
        case 'calendar':
            return <Calendar />;
        case 'archives':
            return <Archives />;
        case 'settings':
            return <Settings />;
        default:
            return <Flux />;
    }
}

const App: React.FC = () => {
    const { user, loading, currentPage, setCurrentPage } = useAppContext();
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    useEffect(() => {
        if (currentPage === 'settings' && user && user.role !== 'Admin') {
            setCurrentPage('flux');
        }
    }, [currentPage, user, setCurrentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-850 flex justify-center items-center transition-colors duration-300">
                <div className="text-center">
                    <ArrowPathIcon className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Navbar 
                onShareClick={() => setShareModalOpen(true)}
            />
            <main className="animate-fade-in">
                <PageContent currentPage={currentPage} />
            </main>
            <div className="pb-16 md:pb-0"></div>
            {isShareModalOpen && <ShareAppModal onClose={() => setShareModalOpen(false)} />}
        </div>
    );
};

export default App;
