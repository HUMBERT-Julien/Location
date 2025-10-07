import { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';

export const useReservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resCollectionRef = collection(db, "reservations");
        const unsubscribe = onSnapshot(resCollectionRef, (snapshot) => {
            const resData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
            setReservations(resData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reservations: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const addReservation = async (reservation: Omit<Reservation, 'id'>) => {
        try {
            await addDoc(collection(db, "reservations"), reservation);
        } catch (error) {
            console.error("Error adding reservation: ", error);
        }
    };

    const updateReservation = async (reservationId: string, updatedData: Partial<Omit<Reservation, 'id'>>) => {
        try {
            await updateDoc(doc(db, "reservations", reservationId), updatedData);
        } catch (error) {
            console.error("Error updating reservation: ", error);
        }
    };

    const deleteReservation = async (reservationId: string) => {
        try {
            await deleteDoc(doc(db, "reservations", reservationId));
        } catch (error) {
            console.error("Error deleting reservation: ", error);
        }
    };

    const deleteArchivedReservationsBefore = async (date: Date) => {
        const q = query(collection(db, "reservations"), where("status", "==", "Archivée"), where("departure", "<", date.toISOString()));
        try {
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        } catch (error) {
            console.error("Error deleting archived reservations: ", error);
        }
    };
    
    return { 
        reservations, 
        loadingReservations: loading,
        addReservation, 
        updateReservation, 
        deleteReservation, 
        deleteArchivedReservationsBefore
    };
};
