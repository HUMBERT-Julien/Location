# Gestion Saisonnière - Application de Gestion de Location

Cette application web est conçue pour gérer le nettoyage et la logistique des appartements en location saisonnière.

## Architecture Technique

L'application est maintenant construite sur une architecture robuste et scalable utilisant un outillage moderne :

- **Framework** : React avec TypeScript, compilé par Vite.
- **Base de données** : Cloud Firestore est utilisé pour le stockage des données en temps réel (appartements, réservations, utilisateurs).
- **Authentification** : Firebase Authentication gère l'inscription et la connexion des utilisateurs de manière sécurisée.
- **Hébergement** : Firebase Hosting est utilisé pour déployer l'application et la rendre accessible en ligne.
- **Styling** : Tailwind CSS pour une interface utilisateur moderne et responsive.

---

### **IMPORTANT : Création de la base de données Firestore**

Avant de configurer les règles de sécurité, vous devez créer une base de données Cloud Firestore dans votre projet.

1.  Allez sur la [console Firebase](https://console.firebase.google.com/).
2.  Sélectionnez votre projet (`location-saisonniere-cdd34`).
3.  Dans le menu de gauche, allez dans `Développement` -> `Firestore Database`.
4.  Cliquez sur le bouton **"Créer une base de données"**.
5.  Choisissez de démarrer en **mode production** (`Start in production mode`). Cliquez sur **Suivant**.
6.  Choisissez un emplacement pour vos données (par exemple, `eur3 (europe-west)`). Cliquez sur **Activer**.

La création de la base de données peut prendre un moment.

---

### **IMPORTANT : Configuration des Règles de Sécurité Firestore**

Par défaut, votre base de données Firestore est verrouillée et n'autorise aucune lecture ou écriture. C'est la cause la plus probable des erreurs de connexion ou du fait que les données ne se sauvegardent pas. Vous **devez** mettre à jour vos règles de sécurité pour permettre à votre application de fonctionner.

1.  Allez sur la [console Firebase](https://console.firebase.google.com/).
2.  Sélectionnez votre projet (`location-saisonniere-cdd34`).
3.  Dans le menu de gauche, allez dans `Développement` -> `Firestore Database`.
4.  Cliquez sur l'onglet `Règles` en haut de la page.
5.  Remplacez le contenu existant par les règles suivantes. Ces règles autorisent uniquement les utilisateurs connectés à lire et écrire des données.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs peuvent gérer leur propre document
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    // Les utilisateurs connectés peuvent lire et écrire dans les autres collections
    match /apartments/{apartmentId} {
        allow read, write: if request.auth != null;
    }
     match /reservations/{reservationId} {
        allow read, write: if request.auth != null;
    }
  }
}
```

6.  Cliquez sur **Publier**. Les changements peuvent prendre quelques minutes pour être actifs.

---

## Déploiement Gratuit, Facile et Rapide

Pour déployer cette application sur Firebase Hosting, suivez ces étapes :

### Prérequis

1.  **Node.js** : Assurez-vous d'avoir Node.js installé.
2.  **Compte Firebase** : Vous devez avoir un compte Google et le projet Firebase créé.
3.  **Firebase CLI** : Installez les outils en ligne de commande de Firebase une seule fois :
    ```bash
    npm install -g firebase-tools
    ```

### Étapes de déploiement

1.  **Installer les dépendances (une seule fois)** :
    Ouvrez un terminal à la racine du projet et lancez cette commande.
    ```bash
    npm install
    ```

2.  **Tester en local (optionnel)** :
    Pour voir l'application sur votre machine avant de la mettre en ligne.
    ```bash
    npm run dev
    ```

3.  **Compiler l'application (obligatoire avant chaque déploiement)** :
    Cette commande prépare votre application pour la mise en ligne en créant une version optimisée dans un dossier `dist`.
    ```bash
    npm run build
    ```
4. **Se connecter à Firebase (une seule fois)**
   Si ce n'est pas déjà fait, connectez votre terminal à votre compte Firebase.
   ```bash
   firebase login
   ```
5. **Mettre en ligne** :
   Lancez la commande de déploiement. Elle enverra le contenu du dossier `dist` sur internet.
   ```bash
   firebase deploy --only hosting
   ```

Une fois le déploiement terminé, la CLI Firebase vous fournira l'URL où votre application est accessible publiquement.