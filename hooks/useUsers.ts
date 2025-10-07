import { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersCollectionRef = collection(db, "users");
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateUser = async (userId: string, updatedUser: Partial<Omit<User, 'id' | 'email' | 'password'>>) => {
        try {
            await setDoc(doc(db, "users", userId), updatedUser, { merge: true });
        } catch (error) {
            console.error("Error updating user: ", error);
        }
    };

    return { users, loadingUsers: loading, updateUser };
};
