import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useApartments } from '../hooks/useApartments';
import { useUsers } from '../hooks/useUsers';
import { useReservations } from '../hooks/useReservations';
import { useAuth, AuthContextType } from '../hooks/useAuth';
import { Page } from '../types';

type AppContextType = {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
} & ReturnType<typeof useApartments> 
  & ReturnType<typeof useUsers> 
  & ReturnType<typeof useReservations>
  & AuthContextType;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const apartmentData = useApartments();
    const userData = useUsers();
    const reservationData = useReservations();
    const authData = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('flux');
    
    const value = {
        ...apartmentData,
        ...userData,
        ...reservationData,
        ...authData,
        currentPage,
        setCurrentPage,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
