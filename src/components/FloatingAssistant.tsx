"use client";

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hi! I am CivicAI. How can I help you route your problem today?' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }, { sender: 'ai', text: 'I understand. Please click "Report a Problem" on the dashboard to provide the exact location and evidence so I can find the right government service for you.' }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white border border-ocean-200 shadow-2xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <span className="font-bold">CivicAI Assistant</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-ocean-200"><X size={20} /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-ocean-50 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-xl max-w-[85%] ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border border-ocean-200 text-ocean-900'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-white border-t border-ocean-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..." 
              className="flex-1 px-3 py-2 border border-ocean-200 rounded-full text-sm focus:outline-none focus:border-primary"
            />
            <button onClick={handleSend} className="bg-primary text-white p-2 rounded-full hover:bg-ocean-700">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-ocean-700 transition transform hover:scale-105 flex items-center gap-2"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
