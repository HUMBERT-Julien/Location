import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<any>;
    register: (userData: Omit<User, 'id'>) => Promise<any>;
    logout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser({ id: firebaseUser.uid, ...userDocSnap.data() } as User);
                } else {
                    setUser(null); // User exists in Auth, but not in Firestore DB. Treat as logged out.
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = (email: string, pass: string) => {
        return signInWithEmailAndPassword(auth, email, pass);
    };

    const register = async (userData: Omit<User, 'id'>) => {
        const { email, password, name, role, tasks } = userData;
        if (!password) {
            throw new Error("Un mot de passe est requis pour créer un nouvel utilisateur.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        const newUserForFirestore: Omit<User, 'id' | 'password'> = {
            name,
            email,
            role: role || 'Personnel',
            tasks: tasks || []
        };
        
        await setDoc(doc(db, "users", userCredential.user.uid), newUserForFirestore);
        
        // Don't set user in state here, onAuthStateChanged will handle it to ensure consistency.
        return userCredential;
    };


    const logout = () => {
        return signOut(auth);
    };

    return { user, loading, login, register, logout };
};
