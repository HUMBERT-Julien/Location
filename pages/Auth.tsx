import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SparklesIcon } from '../components/Icons';

export const Auth: React.FC = () => {
    const { login, register } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register({
                    name,
                    email,
                    password,
                    role: 'Personnel', // Default role for new sign-ups
                    tasks: []
                });
            }
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Cette adresse e-mail est déjà utilisée.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                setError('Email ou mot de passe incorrect.');
            } else if (err.code === 'auth/weak-password') {
                setError('Le mot de passe doit contenir au moins 6 caractères.');
            }
            else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-850 flex flex-col justify-center items-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center gap-3 mb-8">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
                        <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Gestion Saisonnière
                    </h1>
                </div>
                <div className="bg-white dark:bg-slate-900/50 shadow-2xl rounded-xl p-8 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-center mb-6 dark:text-slate-100">
                        {isLogin ? 'Connexion' : 'Créer un compte'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 px-4 bg-white dark:bg-slate-800/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 px-4 bg-white dark:bg-slate-800/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 px-4 bg-white dark:bg-slate-800/50 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            required
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-transform transform active:scale-[0.98] disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
                        </button>
                    </form>
                    <p className="text-center text-sm mt-6">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            {isLogin ? 'Pas de compte ? Créez-en un' : 'Déjà un compte ? Connectez-vous'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
