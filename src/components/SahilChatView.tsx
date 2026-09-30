import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  MessageSquare,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { 
  ChatMessage, 
  PersonaPreset, 
  IncomeItem, 
  ExpenseItem, 
  BudgetLimit, 
  SavingsGoal 
} from '../types/finance';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateExpensesByCategory,
  calculateHealthScore 
} from '../utils/financeUtils';

interface SahilChatViewProps {
  preset: PersonaPreset;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  budgetLimits: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  currency: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  isThinking: boolean;
}

export const SahilChatView: React.FC<SahilChatViewProps> = ({
  preset,
  incomes,
  expenses,
  budgetLimits,
  savingsGoals,
  currency,
  messages,
  onSendMessage,
  onClearChat,
  isThinking,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  const handlePromptClick = async (promptText: string) => {
    if (isThinking) return;
    await onSendMessage(promptText);
  };

  // Scenario-specific suggested prompts
  const getSuggestedPrompts = () => {
    switch (preset.id) {
      case 'salaried':
        return [
          'Where am I overspending this month?',
          'How can I optimize my 50/30/20 budget balance?',
          'Give me a 3-step action plan to save an extra $400',
          'How to stop lifestyle creep as my salary grows?'
        ];
      case 'student':
        return [
          'How do I budget strictly on my monthly allowance?',
          'What are high-impact ways to cut food delivery & cafe bills?',
          'How to build a $500 emergency buffer as a student?',
          'How to manage textbook and course material costs?'
        ];
      case 'freelancer':
        return [
          'How should I smooth my variable client income?',
          'How much should I set aside for quarterly taxes?',
          'How to structure my 6-month lean season emergency runway?',
          'Which business expenses should I deduct?'
        ];
      case 'household':
        return [
          'How can we optimize shared family groceries & utility bills?',
          'What is the best way to fund the children’s 529 college plan?',
          'How to handle budget overruns in kids activities & healthcare?',
          'Consolidated family wealth building roadmap'
        ];
      default:
        return [
          'Analyze my current income vs expenses',
          'Where can I cut $200 from my budget?',
          'How should I build an emergency fund?',
          'Generate my monthly financial report'
        ];
    }
  };

  // Markdown-like text renderer
  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className="text-sm font-bold text-emerald-400 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <div key={index} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatBold(line.replace(/^[-*]\s+/, '')) }} />
          </div>
        );
      }
      // Numbered item
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={index} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="font-bold text-emerald-400 shrink-0 text-xs">
              {line.trim().match(/^\d+\./)?.[0]}
            </span>
            <span dangerouslySetInnerHTML={{ __html: formatBold(line.trim().replace(/^\d+\.\s+/, '')) }} />
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={index} className="h-1.5" />;
      }
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
      );
    });
  };

  const formatBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] max-h-[750px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Sahil</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                AI Personal Wealth Advisor
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Context loaded: {preset.name} • {preset.role}
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          title="Restart conversation"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-slate-850/60 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Suggested:
        </span>
        {getSuggestedPrompts().map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(prompt)}
            disabled={isThinking}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap border border-slate-700/80 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-emerald-600 text-slate-950 font-bold'
                    : 'bg-slate-850 text-emerald-400 border border-slate-750'
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-slate-950" /> : <Bot className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-850 text-slate-200 border border-slate-750 rounded-tl-none'
                }`}
              >
                {isUser ? msg.content : renderFormattedMessage(msg.content)}
                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? 'text-slate-950/70 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-850 text-emerald-400 border border-slate-750 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="bg-slate-850 border border-slate-750 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Sahil is calculating your financial recommendations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-slate-850 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask Sahil anything about your finances (e.g. "How to save ${currency}500 next month?")...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold transition shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
