import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const timeString = new Date(message.timestamp).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[80%] md:max-w-[70%] px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {message.text}
        </p>
        <span
          className={`block text-[10px] mt-1 text-right opacity-70 ${
            isUser ? 'text-indigo-100' : 'text-slate-400'
          }`}
        >
          {timeString}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;