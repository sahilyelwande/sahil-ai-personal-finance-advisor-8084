import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Laptop, 
  Home, 
  Settings, 
  Download, 
  RotateCcw,
  MessageSquare,
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ScenarioId } from '../types/finance';

interface HeaderProps {
  currentScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  currency: string;
  onChangeCurrency: (c: string) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onResetData: () => void;
  onExportData: () => void;
  onOpenChat: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  currency,
  onChangeCurrency,
  activeTab,
  onChangeTab,
  onResetData,
  onExportData,
  onOpenChat,
}) => {
  const scenarios = [
    { id: 'salaried' as ScenarioId, label: 'Salaried Pro', icon: Briefcase, desc: 'Scenario 1: Fixed salary & lifestyle budget' },
    { id: 'student' as ScenarioId, label: 'College Student', icon: GraduationCap, desc: 'Scenario 2: Limited allowance & savings' },
    { id: 'freelancer' as ScenarioId, label: 'Freelancer', icon: Laptop, desc: 'Scenario 3: Variable income & tax buffer' },
    { id: 'household' as ScenarioId, label: 'Household', icon: Home, desc: 'Scenario 4: Multi-income & family plan' },
    { id: 'custom' as ScenarioId, label: 'Custom', icon: Settings, desc: 'My custom profile' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'budget', label: 'AI Budget', icon: PieChart },
    { id: 'savings', label: 'Savings & Runway', icon: ShieldCheck },
    { id: 'report', label: 'Monthly Report', icon: FileText },
    { id: 'chat', label: 'Chat with Sahil', icon: MessageSquare, highlight: true },
  ];

  const currencies = ['$', '₹', '€', '£', 'C$', 'A$'];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner with Bot Identity & Scenario Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Bot Branding */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Sahil
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Finance Advisor
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Automated budget generation • spending audits • monthly wealth planning
              </p>
            </div>
          </div>

          {/* Scenario Quick Selector & Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scenarios bar */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
              <span className="text-xs font-medium text-slate-400 px-2 hidden lg:inline">Scenarios:</span>
              {scenarios.map((s) => {
                const Icon = s.icon;
                const isActive = currentScenario === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectScenario(s.id)}
                    title={s.desc}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 px-1 font-medium">Curr:</span>
              <select
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value)}
                aria-label="Select currency"
                className="bg-transparent text-xs font-semibold text-emerald-400 focus:outline-none cursor-pointer pr-1"
              >
                {currencies.map((c) => (
                  <option key={c} value={c} className="bg-slate-800 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset / Export Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={onResetData}
                title="Reset to scenario defaults"
                aria-label="Reset to scenario defaults"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-750 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onExportData}
                title="Export budget data (JSON)"
                aria-label="Export budget data (JSON)"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-750 transition"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition active:scale-95 ml-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Sahil</span>
              </button>
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto space-x-1 mt-3 pt-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${tab.highlight && !isActive ? 'text-emerald-400/90 font-semibold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
