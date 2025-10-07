
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Gestion Nettoyage Saisonnière
        </h1>
      </div>
    </header>
  );
};
