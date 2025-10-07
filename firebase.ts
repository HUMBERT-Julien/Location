import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBArn9dMHGLgXpGpFOfybhOXdG6SEvohXQ",
  authDomain: "location-saisonniere-cdd34.firebaseapp.com",
  projectId: "location-saisonniere-cdd34",
  storageBucket: "location-saisonniere-cdd34.firebasestorage.app",
  messagingSenderId: "615920679467",
  appId: "1:615920679467:web:36505e97af3bc0d5d6086e",
  measurementId: "G-5WZ5JF6G0L"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Activer la persistance hors ligne
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Se produit si plusieurs onglets sont ouverts, la persistance
      // ne peut être activée que dans un seul onglet à la fois.
      console.warn("La persistance Firestore a échoué : plusieurs onglets sont ouverts.");
    } else if (err.code == 'unimplemented') {
      // Le navigateur actuel ne prend pas en charge toutes les fonctionnalités
      // nécessaires pour activer la persistance.
      console.warn("La persistance Firestore n'est pas prise en charge par ce navigateur.");
    }
  });
