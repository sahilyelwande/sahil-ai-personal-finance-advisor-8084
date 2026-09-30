import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  User
} from 'lucide-react';
import { 
  ChatMessage, 
  PersonaPreset, 
  IncomeItem, 
  ExpenseItem, 
  BudgetLimit, 
  SavingsGoal 
} from '../types/finance';

interface SahilChatFloatingProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  preset: PersonaPreset;
  currency: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isThinking: boolean;
}

export const SahilChatFloating: React.FC<SahilChatFloatingProps> = ({
  isOpen,
  onClose,
  onOpen,
  preset,
  currency,
  messages,
  onSendMessage,
  isThinking,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        title="Chat with Sahil (AI Advisor)"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 border border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping" />
        </div>
        <span>Ask Sahil</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[520px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      
      {/* Header */}
      <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-xs">Sahil AI Advisor</h4>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-400">{preset.name} • {currency}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] ${
                  isUser ? 'bg-emerald-600 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[80%] rounded-xl p-3 leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-850 text-slate-200 border border-slate-750 rounded-tl-none'
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Sahil is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2.5 bg-slate-850 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Sahil a quick question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold disabled:opacity-50 transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
