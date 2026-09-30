import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  PiggyBank, 
  TrendingUp, 
  Target, 
  Calendar, 
  Sparkles, 
  Check, 
  Coins,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, PersonaPreset, ExpenseItem, IncomeItem } from '../types/finance';
import { formatCurrency, calculateTotalExpenses } from '../utils/financeUtils';

interface SavingsViewProps {
  preset: PersonaPreset;
  savingsGoals: SavingsGoal[];
  expenses: ExpenseItem[];
  currency: string;
  onAddContribution: (goalId: string, amount: number) => void;
  onCreateGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  preset,
  savingsGoals,
  expenses,
  currency,
  onAddContribution,
  onCreateGoal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalForContrib, setSelectedGoalForContrib] = useState<SavingsGoal | null>(null);
  const [contribAmount, setContribAmount] = useState('');

  // New goal form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<'emergency' | 'purchase' | 'milestone' | 'education' | 'family'>('emergency');

  // Emergency Runway calculations
  const totalMonthlyBurn = calculateTotalExpenses(expenses) || 3000;
  const emergencyGoal = savingsGoals.find((g) => g.category === 'emergency');
  const emergencySavings = emergencyGoal?.currentAmount || 0;
  const runwayMonths = Math.round((emergencySavings / (totalMonthlyBurn || 1)) * 10) / 10;

  const totalSavedAcrossGoals = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargetAcrossGoals = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    onCreateGoal({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      monthlyContribution: Number(monthlyContribution) || 100,
      targetDate: targetDate || '2027-06-30',
      iconName: category === 'emergency' ? 'ShieldCheck' : 'Target',
      category,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setMonthlyContribution('');
    setIsModalOpen(false);
  };

  const handleApplyContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForContrib || !contribAmount || Number(contribAmount) <= 0) return;

    const amountNum = Number(contribAmount);
    const newTotal = selectedGoalForContrib.currentAmount + amountNum;
    onAddContribution(selectedGoalForContrib.id, amountNum);

    // If reaching or passing target, trigger confetti!
    if (newTotal >= selectedGoalForContrib.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setContribAmount('');
    setSelectedGoalForContrib(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Savings Progress & Emergency Runway
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build your financial safety moat and track progress towards life milestones with automated coaching.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Emergency Runway Moat Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white">Emergency Runway Moat</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {runwayMonths >= 6 ? 'Robust (6+ Mos)' : runwayMonths >= 3 ? 'Standard (3+ Mos)' : 'Building Buffer'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Based on your monthly expense burn of <strong>{formatCurrency(totalMonthlyBurn, currency)}</strong>, 
              your current emergency reserve provides <strong>{runwayMonths} months of complete survival runway</strong> with zero income.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-medium block">Liquid Reserve</span>
              <span className="text-xl font-bold text-emerald-400">{formatCurrency(emergencySavings, currency)}</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-medium block">Runway Moat</span>
              <span className="text-xl font-bold text-white">{runwayMonths} Mos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Total Capital Saved
          </span>
          <div className="text-2xl font-bold text-white tracking-tight mt-2">
            {formatCurrency(totalSavedAcrossGoals, currency)}
          </div>
          <span className="text-xs text-emerald-400 font-medium mt-1 block">
            Across {savingsGoals.length} tracked targets
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Cumulative Goal Target
          </span>
          <div className="text-2xl font-bold text-teal-400 tracking-tight mt-2">
            {formatCurrency(totalTargetAcrossGoals, currency)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {totalTargetAcrossGoals > 0 ? Math.round((totalSavedAcrossGoals / totalTargetAcrossGoals) * 100) : 0}% achieved so far
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Scheduled Monthly Contributions
          </span>
          <div className="text-2xl font-bold text-indigo-400 tracking-tight mt-2">
            {formatCurrency(
              savingsGoals.reduce((sum, g) => sum + g.monthlyContribution, 0),
              currency
            )}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Automated wealth accumulation
          </span>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savingsGoals.map((goal) => {
          const pct = goal.targetAmount > 0 
            ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) 
            : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const monthsRemaining = goal.monthlyContribution > 0 
            ? Math.ceil(remaining / goal.monthlyContribution) 
            : '—';

          return (
            <div
              key={goal.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {goal.category}
                  </span>
                  <span className="text-sm font-bold text-emerald-400">{pct}%</span>
                </div>
                <h4 className="font-bold text-white text-base">{goal.name}</h4>
                {goal.targetDate && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Target Date: {goal.targetDate}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Saved: <strong className="text-slate-200">{formatCurrency(goal.currentAmount, currency)}</strong></span>
                  <span>Target: <strong className="text-slate-200">{formatCurrency(goal.targetAmount, currency)}</strong></span>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div>
                  <span className="block text-[11px]">Monthly Pace:</span>
                  <span className="font-semibold text-slate-200">
                    {formatCurrency(goal.monthlyContribution, currency)}/mo
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (~{monthsRemaining} mos left)
                  </span>
                </div>

                <button
                  onClick={() => setSelectedGoalForContrib(goal)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition active:scale-95"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>+ Add Funds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contribution Modal */}
      {selectedGoalForContrib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              Contribute to {selectedGoalForContrib.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current Balance: {formatCurrency(selectedGoalForContrib.currentAmount, currency)} of{' '}
              {formatCurrency(selectedGoalForContrib.targetAmount, currency)}
            </p>

            <form onSubmit={handleApplyContribution} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Contribution Amount ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="200"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForContrib(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition shadow-md shadow-emerald-600/20"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Create New Savings Target
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6-Month Emergency Fund, House Down Payment, Vacation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Target Goal ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="10000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Starting Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="1500"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="emergency">Emergency / Runway</option>
                    <option value="purchase">Major Purchase / Tech</option>
                    <option value="milestone">Wealth Milestone / Invest</option>
                    <option value="education">Education / College</option>
                    <option value="family">Family / Home</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Monthly Contribution ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="300"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition shadow-md shadow-emerald-600/20"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
