import React, { useState } from 'react';
import { 
  PieChart, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle
} from 'lucide-react';
import { BudgetLimit, ExpenseCategory, ExpenseItem, IncomeItem, PersonaPreset } from '../types/finance';
import { 
  formatCurrency, 
  calculateTotalIncome, 
  calculateExpensesByCategory,
  CATEGORY_COLORS 
} from '../utils/financeUtils';

interface BudgetPlannerViewProps {
  preset: PersonaPreset;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  budgetLimits: BudgetLimit[];
  currency: string;
  onUpdateLimit: (category: ExpenseCategory, newAmount: number) => void;
  onApplyPlan: (newLimits: BudgetLimit[]) => void;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  preset,
  incomes,
  expenses,
  budgetLimits,
  currency,
  onUpdateLimit,
  onApplyPlan,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'adaptive_ai' | '50_30_20' | 'wealth_builder' | 'zero_based'>('adaptive_ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [planSummary, setPlanSummary] = useState<string | null>(null);

  const totalIncome = calculateTotalIncome(incomes);
  const expensesByCategory = calculateExpensesByCategory(expenses);
  const totalBudgeted = budgetLimits.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const unallocated = totalIncome - totalBudgeted;

  const handleGenerateBudget = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/advisor/generate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: selectedStrategy,
          financialContext: {
            persona: preset.id,
            currency,
            monthlyIncome: totalIncome,
            expensesByCategory,
          },
        }),
      });
      const data = await response.json();
      if (data.budgetPlan) {
        const newLimits: BudgetLimit[] = Object.entries(data.budgetPlan).map(([cat, info]: [string, any]) => ({
          category: cat as ExpenseCategory,
          allocatedAmount: Number(info.limit) || 0,
          rationale: info.rationale || '',
        }));
        onApplyPlan(newLimits);
      }
      if (data.summary) {
        setPlanSummary(data.summary);
      }
    } catch (err) {
      console.error('Budget generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const strategies = [
    {
      id: 'adaptive_ai' as const,
      name: 'Sahil Adaptive AI',
      desc: `Tailored specifically for ${preset.name}'s profile (${preset.role})`,
      tag: 'Recommended',
    },
    {
      id: '50_30_20' as const,
      name: '50 / 30 / 20 Rule',
      desc: '50% Needs, 30% Wants, 20% Automated Savings & Investments',
      tag: 'Classic',
    },
    {
      id: 'wealth_builder' as const,
      name: '70 / 20 / 10 Wealth Builder',
      desc: 'High-savings plan with 30-35% capital allocation to safety & growth',
      tag: 'Aggressive',
    },
    {
      id: 'zero_based' as const,
      name: 'Zero-Based Budget',
      desc: 'Every single dollar is assigned to a specific category or goal',
      tag: 'Precision',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Plan Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-400" />
            AI Budget Planner & Thresholds
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sahil automates realistic category spending caps to prevent budget overruns and guarantee savings.
          </p>
        </div>
        <button
          onClick={handleGenerateBudget}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating Budget with Sahil...' : 'Optimize Budget with Sahil'}</span>
        </button>
      </div>

      {/* Strategy Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {strategies.map((strat) => {
          const isSelected = selectedStrategy === strat.id;
          return (
            <div
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-850 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-xs sm:text-sm">{strat.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {strat.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{strat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Allocation Overview Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-semibold text-white">Monthly Cashflow Target: </span>
            <span className="text-slate-300">{formatCurrency(totalIncome, currency)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Allocated: <strong className="text-white">{formatCurrency(totalBudgeted, currency)}</strong>
            </span>
            <span className={unallocated >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {unallocated >= 0 ? `Unallocated Buffer: +${formatCurrency(unallocated, currency)}` : `Overallocated: ${formatCurrency(unallocated, currency)}`}
            </span>
          </div>
        </div>

        {/* Progress Bar of Budget Utilization */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          {budgetLimits.map((b) => {
            const widthPct = totalIncome > 0 ? (b.allocatedAmount / totalIncome) * 100 : 0;
            return (
              <div
                key={b.category}
                title={`${b.category}: ${formatCurrency(b.allocatedAmount, currency)} (${Math.round(widthPct)}%)`}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: CATEGORY_COLORS[b.category] || '#10B981',
                }}
                className="h-full border-r border-slate-900/40 transition-all"
              />
            );
          })}
        </div>

        {planSummary && (
          <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl">
            💡 {planSummary}
          </p>
        )}
      </div>

      {/* Category Limits Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetLimits.map((limit) => {
          const spent = expensesByCategory[limit.category] || 0;
          const cap = limit.allocatedAmount;
          const variance = cap - spent;
          const pct = cap > 0 ? Math.round((spent / cap) * 100) : 0;
          const isOver = spent > cap;
          const color = CATEGORY_COLORS[limit.category] || '#10B981';

          return (
            <div
              key={limit.category}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{limit.category}</h4>
                    {limit.rationale && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">{limit.rationale}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isOver
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : pct > 85
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {pct}% Spent
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver ? 'bg-rose-500' : pct > 85 ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              {/* Numbers & Live Adjuster */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="text-slate-400">
                  <span>Actual: </span>
                  <strong className={isOver ? 'text-rose-400' : 'text-slate-200'}>
                    {formatCurrency(spent, currency)}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Budget Cap:</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1 text-slate-400 font-medium">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={limit.allocatedAmount}
                      onChange={(e) => onUpdateLimit(limit.category, Number(e.target.value) || 0)}
                      className="w-24 bg-slate-850 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-right text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] flex items-center justify-between border-t border-slate-800/80 pt-2 text-slate-400">
                <span>
                  {isOver ? (
                    <span className="text-rose-400 font-semibold">
                      Overspent by {formatCurrency(Math.abs(variance), currency)}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">
                      Remaining room: {formatCurrency(variance, currency)}
                    </span>
                  )}
                </span>
                <span>{totalIncome > 0 ? Math.round((cap / totalIncome) * 100) : 0}% of total inflow</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
