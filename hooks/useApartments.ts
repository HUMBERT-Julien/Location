import { useState, useEffect } from 'react';
import { Apartment } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const aptsCollectionRef = collection(db, "apartments");
    const unsubscribe = onSnapshot(aptsCollectionRef, (snapshot) => {
      const aptsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Apartment));
      setApartments(aptsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching apartments: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addApartment = async (newApartment: Omit<Apartment, 'id'>) => {
    try {
      await addDoc(collection(db, "apartments"), newApartment);
    } catch (error) {
      console.error("Error adding apartment: ", error);
    }
  };

  const updateApartment = async (id: string, updatedData: Partial<Omit<Apartment, 'id'>>) => {
    try {
      const aptDocRef = doc(db, "apartments", id);
      await updateDoc(aptDocRef, updatedData);
    } catch (error) {
      console.error("Error updating apartment: ", error);
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "apartments", id));
    } catch (error) {
      console.error("Error deleting apartment: ", error);
    }
  };
  
  return {
    apartments,
    loading,
    addApartment,
    updateApartment,
    deleteApartment,
  };
};
