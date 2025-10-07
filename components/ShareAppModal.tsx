import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { XMarkIcon } from './Icons';

interface ShareAppModalProps {
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ onClose }) => {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const appUrl = window.location.href;
  const shareText = "Découvrez cette application de gestion de location saisonnière !";

  useEffect(() => {
    if (qrCodeRef.current) {
      QRCode.toCanvas(qrCodeRef.current, appUrl, { width: 220, margin: 1, color: { dark: '#1e293b', light: '#ffffff' } }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [appUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      alert('Lien copié dans le presse-papiers !');
    }, (err) => {
      console.error('Could not copy text: ', err);
      alert('Impossible de copier le lien.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm m-auto transform transition-all text-center">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Partager l'application</h2>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Partagez cette application avec votre équipe via le lien ou le QR code.</p>

          <div className="bg-white p-4 rounded-lg inline-block border dark:border-slate-700 shadow-inner">
            <canvas ref={qrCodeRef}></canvas>
          </div>

          <div className="mt-6">
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button 
                    onClick={handleCopy}
                    className="w-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
                >
                    Copier le lien
                </button>
                 <a 
                    href={`mailto:?subject=Invitation à utiliser l'app Gestion Saisonnière&body=${shareText}%0A${appUrl}`}
                    className="w-full block bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                >
                    Envoyer par e-mail
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
