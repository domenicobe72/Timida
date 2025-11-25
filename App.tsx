import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import TypingIndicator from './components/TypingIndicator';
import { initChatSession, sendMessageToGemini } from './services/gemini';
import { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat on mount
  useEffect(() => {
    initChatSession([]);
    // Add a welcoming message if empty
    if (messages.length === 0) {
       const welcomeMsg: Message = {
         id: 'welcome',
         role: 'model',
         text: 'Ciao! Come stai oggi? 😊',
         timestamp: Date.now()
       };
       setMessages([welcomeMsg]);
       // We don't add welcome message to history init, just visual, 
       // because the model doesn't need to know it said hello first to start context.
       // Alternatively, we could init session with it.
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || isTyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, responseMessage]);
    } catch (error: any) {
      console.error("Failed to get response", error);
      
      let errorText = "Scusa, ho avuto un piccolo giramento di testa. Puoi ripetere? 🥺";
      
      // Check specifically for quota/rate limit errors
      const errorMessage = error?.message || "";
      if (error?.status === 429 || errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        errorText = "Oggi abbiamo parlato tantissimo e sono un po' stanca (Limite API raggiunto). Riposiamoci un po' e riprendiamo più tardi! 😴";
      }

      const errorMsgObj: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsgObj]);
    } finally {
      setIsTyping(false);
      // Focus input back (desktop friendly)
      if (window.matchMedia('(min-width: 768px)').matches) {
        inputRef.current?.focus();
      }
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-alice-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedMessages = JSON.parse(content) as Message[];
        
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
          // Re-initialize Gemini session with the uploaded history
          initChatSession(parsedMessages);
        } else {
          alert("Formato file non valido.");
        }
      } catch (err) {
        console.error("Error parsing JSON", err);
        alert("Errore nel caricamento della conversazione.");
      }
    };
    reader.readAsText(file);
    // Reset input value so same file can be selected again if needed
    e.target.value = '';
  };

  const handleClear = () => {
      if(confirm("Vuoi davvero cancellare tutto e ricominciare?")) {
          setMessages([]);
          initChatSession([]);
           const welcomeMsg: Message = {
            id: Date.now().toString(),
            role: 'model',
            text: 'Ciao! Come stai oggi? 😊',
            timestamp: Date.now()
          };
          setMessages([welcomeMsg]);
      }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header 
        onDownload={handleDownload} 
        onUpload={handleUpload} 
        onClear={handleClear}
      />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-3 sm:p-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end space-x-2 bg-slate-100 p-2 rounded-3xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-sm"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Scrivi un messaggio..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 px-4 py-3 max-h-32 outline-none"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">Alice può commettere errori. Verifica le informazioni importanti.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;