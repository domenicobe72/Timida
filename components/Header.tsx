import React, { useRef } from 'react';
import { Message } from '../types';

interface HeaderProps {
  onDownload: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDownload, onUpload, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-indigo-200 flex items-center justify-center text-xl shadow-inner">
          👩🏻
        </div>
        <div>
          <h1 className="font-semibold text-slate-800 text-lg leading-tight">Alice</h1>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-500 font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onUpload}
          className="hidden"
          accept=".json"
        />

        <button
          onClick={triggerFileInput}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="Carica conversazione"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </button>

        <button
          onClick={onDownload}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="Salva conversazione"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>

        <button
            onClick={onClear}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Nuova conversazione"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;