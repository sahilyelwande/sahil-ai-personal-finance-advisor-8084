import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { 
  IncomeItem, 
  ExpenseItem, 
  BudgetLimit, 
  SavingsGoal, 
  PersonaPreset 
} from '../types/finance';
import { 
  formatCurrency, 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateExpensesByCategory, 
  calculateHealthScore,
  CATEGORY_COLORS 
} from '../utils/financeUtils';

interface DashboardViewProps {
  preset: PersonaPreset;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  budgetLimits: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  currency: string;
  onNavigateTab: (tab: string) => void;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  preset,
  incomes,
  expenses,
  budgetLimits,
  savingsGoals,
  currency,
  onNavigateTab,
  onOpenAddExpense,
  onOpenAddIncome,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const totalIncome = calculateTotalIncome(incomes);
  const totalExpenses = calculateTotalExpenses(expenses);
  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const expensesByCategory = calculateExpensesByCategory(expenses);
  const health = calculateHealthScore(totalIncome, totalExpenses, budgetLimits, expensesByCategory);

  // Compute overspending categories
  const overspentCategories = budgetLimits
    .map((b) => {
      const spent = expensesByCategory[b.category] || 0;
      const budget = b.allocatedAmount;
      const overage = spent - budget;
      const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      return {
        category: b.category,
        spent,
        budget,
        overage,
        percentage,
      };
    })
    .filter((item) => item.overage > 0)
    .sort((a, b) => b.overage - a.overage);

  // Top spending categories
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const runAISpendingAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/advisor/analyze-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialContext: {
            persona: preset.id,
            currency,
            monthlyIncome: totalIncome,
            monthlyExpenses: totalExpenses,
            netSavings,
            savingsRate: health.savingsRate,
            expensesByCategory,
            budgetLimits: budgetLimits.reduce((acc, curr) => ({ ...acc, [curr.category]: curr.allocatedAmount }), {}),
          },
        }),
      });
      const data = await response.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Persona Hero & Sahil's Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {preset.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {preset.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {preset.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {preset.tagline}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs bg-slate-850/90 py-1.5 px-3 rounded-xl border border-slate-750 text-slate-300">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Sahil's Note:
                </span>
                <span className="line-clamp-1 italic text-slate-300">
                  "{preset.sahilWelcomePrompt}"
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenAddIncome}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Income</span>
            </button>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Expense</span>
            </button>
            <button
              onClick={() => onNavigateTab('report')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-600/20 transition"
            >
              <span>Monthly Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overspending Alert Banner (if any) */}
      {overspentCategories.length > 0 && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-900/60 p-4 shadow-lg text-rose-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-900/50 text-rose-300 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-rose-200 flex items-center gap-2">
                  Sahil Alert: Overspending Detected in {overspentCategories.length} Categories
                </h4>
                <button
                  onClick={() => onNavigateTab('budget')}
                  className="text-xs text-rose-300 hover:text-white underline font-medium"
                >
                  Adjust Budget Limits
                </button>
              </div>
              <p className="text-xs text-rose-300/90 mt-1">
                {overspentCategories[0].category} is currently at{' '}
                <strong className="text-rose-100">{overspentCategories[0].percentage}%</strong> of budget{' '}
                ({formatCurrency(overspentCategories[0].spent, currency)} spent vs{' '}
                {formatCurrency(overspentCategories[0].budget, currency)} target).
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {overspentCategories.map((c) => (
                  <span
                    key={c.category}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-900/40 border border-rose-800 text-xs text-rose-200 font-medium"
                  >
                    {c.category}: +{formatCurrency(c.overage, currency)} over
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Main Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Inflow
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(totalIncome, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">{incomes.length} active streams</span> • {preset.id === 'freelancer' ? 'Variable' : 'Monthly'}
            </p>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Outflow
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(totalExpenses, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-rose-400 font-medium">
                {totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}%
              </span> of monthly inflow logged
            </p>
          </div>
        </div>

        {/* Net Savings & Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Net Savings Surplus
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {formatCurrency(netSavings, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">
                {health.savingsRate}% Savings Rate
              </span>
              <span>(Target: 20%)</span>
            </p>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Financial Health
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5">
                {health.score}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Grade: <span className="text-emerald-400 font-semibold">{health.grade}</span></p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              health.grade.startsWith('A') 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : health.grade === 'B' 
                ? 'bg-teal-500/20 text-teal-400' 
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {health.score >= 80 ? 'Excellent' : health.score >= 65 ? 'Stable' : 'Needs Review'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Cash Flow Balance & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Category Budget Utilization (2 cols on lg) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Category Spending & Budget Caps
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Live utilization against Sahil's target budget thresholds
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Manage Budget</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            {budgetLimits.slice(0, 6).map((limit) => {
              const spent = expensesByCategory[limit.category] || 0;
              const cap = limit.allocatedAmount;
              const pct = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
              const isOver = spent > cap;
              const color = CATEGORY_COLORS[limit.category] || '#10B981';

              return (
                <div key={limit.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-slate-200">{limit.category}</span>
                      {isOver && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400">
                          Over Limit
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {formatCurrency(spent, currency)} / {formatCurrency(cap, currency)}
                      </span>
                      <span
                        className={`font-semibold ${
                          isOver ? 'text-rose-400' : pct > 85 ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? 'bg-rose-500'
                          : pct > 85
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cash Flow Distribution Summary Bar */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Monthly Inflow Distribution
            </span>
            <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden">
              <div
                title={`Expenses: ${formatCurrency(totalExpenses, currency)}`}
                className="bg-rose-500/80 h-full"
                style={{ width: `${totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0}%` }}
              />
              <div
                title={`Net Savings: ${formatCurrency(netSavings, currency)}`}
                className="bg-emerald-500 h-full"
                style={{ width: `${totalIncome > 0 ? (netSavings / totalIncome) * 100 : 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Expenses ({totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Net Savings Surplus ({health.savingsRate}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sahil's AI Financial Diagnosis Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Sahil's AI Diagnosis</h3>
              </div>
              <button
                onClick={runAISpendingAudit}
                disabled={isAuditing}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isAuditing ? 'Auditing...' : 'Audit'}</span>
              </button>
            </div>

            <div className="bg-slate-850 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {auditResult?.sahilAdvice ? (
                <p>{auditResult.sahilAdvice}</p>
              ) : (
                <p>
                  "You are maintaining a <strong>{health.savingsRate}% savings rate</strong>. 
                  {overspentCategories.length > 0
                    ? ` I recommend capping discretionary outings in ${overspentCategories[0].category} to boost your emergency safety fund by ${formatCurrency(overspentCategories[0].overage, currency)}.`
                    : ' Your cash flow is well-structured and within benchmark ceilings. Keep automating your monthly savings goals!'}
                </p>
              )}
            </div>

            {/* Quick Actionable Savings Opportunities */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Recommended Actions
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Enforce 50/30/20 Balance:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Ensure essential needs stay below 50% ({formatCurrency(totalIncome * 0.5, currency)}).
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Automate Savings Day:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Transfer {formatCurrency(Math.round(totalIncome * 0.15), currency)} to emergency runway upon deposit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('chat')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
            >
              <span>Ask Sahil for In-Depth Advice</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row: Savings Goals Preview & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Savings Goals Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Savings & Runway Goals</h3>
            </div>
            <button
              onClick={() => onNavigateTab('savings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View All Goals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {savingsGoals.map((goal) => {
              const pct = goal.targetAmount > 0 
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) 
                : 0;

              return (
                <div key={goal.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{goal.name}</span>
                    <span className="text-emerald-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Saved: {formatCurrency(goal.currentAmount, currency)}</span>
                    <span>Target: {formatCurrency(goal.targetAmount, currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Logged Transactions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Expenses</h3>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Expense Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {expenses.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800/80 border border-slate-750/70 transition text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#64748B' }}
                  />
                  <div>
                    <div className="font-medium text-slate-200">{exp.description}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>{exp.category}</span>
                      <span>•</span>
                      <span>{exp.date}</span>
                    </div>
                  </div>
                </div>
                <div className="font-bold text-rose-400 text-sm">
                  -{formatCurrency(exp.amount, currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
