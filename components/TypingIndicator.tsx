import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full justify-start mb-4">
      <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center space-x-1 h-12">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;