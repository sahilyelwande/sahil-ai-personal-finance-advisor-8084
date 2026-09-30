import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  Trash2, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { IncomeItem, PersonaPreset } from '../types/finance';
import { formatCurrency, calculateTotalIncome } from '../utils/financeUtils';

interface IncomeViewProps {
  preset: PersonaPreset;
  incomes: IncomeItem[];
  currency: string;
  onAddIncome: (item: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({
  preset,
  incomes,
  currency,
  onAddIncome,
  onDeleteIncome,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'fixed' | 'variable'>('fixed');
  const [frequency, setFrequency] = useState<'monthly' | 'bi-weekly' | 'weekly' | 'one-off'>('monthly');
  const [notes, setNotes] = useState('');
  const [dateReceived, setDateReceived] = useState(new Date().toISOString().split('T')[0]);

  const totalIncome = calculateTotalIncome(incomes);
  const fixedIncome = incomes
    .filter((i) => i.type === 'fixed')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const variableIncome = incomes
    .filter((i) => i.type === 'variable')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !amount || Number(amount) <= 0) return;

    onAddIncome({
      source: source.trim(),
      amount: Number(amount),
      type,
      frequency,
      notes: notes.trim(),
      dateReceived,
    });

    setSource('');
    setAmount('');
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            Monthly Income & Cash Inflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Log all earnings, client payouts, salaries, and allowances to empower Sahil's budget automation.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income Stream</span>
        </button>
      </div>

      {/* Income Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Total Monthly Inflow
          </span>
          <div className="text-2xl font-bold text-white tracking-tight mt-2">
            {formatCurrency(totalIncome, currency)}
          </div>
          <span className="text-xs text-emerald-400 font-medium mt-1 block">
            {incomes.length} documented revenue stream{incomes.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Fixed Guaranteed Income
          </span>
          <div className="text-2xl font-bold text-teal-400 tracking-tight mt-2">
            {formatCurrency(fixedIncome, currency)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {totalIncome > 0 ? Math.round((fixedIncome / totalIncome) * 100) : 0}% of baseline cashflow
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Variable / Client Inflow
          </span>
          <div className="text-2xl font-bold text-amber-400 tracking-tight mt-2">
            {formatCurrency(variableIncome, currency)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {totalIncome > 0 ? Math.round((variableIncome / totalIncome) * 100) : 0}% fluctuating earnings
          </span>
        </div>
      </div>

      {/* Sahil's Inflow Coaching Note */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-bold text-white">Sahil's Inflow Advice: </span>
          {variableIncome > 0 ? (
            <span>
              Because <strong>{Math.round((variableIncome / totalIncome) * 100)}%</strong> of your income is variable, I recommend automated income smoothing. Keep a 1-month living buffer in your checking account and park 25% of all variable deposits directly into your tax reserve.
            </span>
          ) : (
            <span>
              Your income is 100% fixed and predictable. This allows aggressive automated savings on payday: schedule your 50/30/20 transfers immediately after deposit to remove temptation.
            </span>
          )}
        </div>
      </div>

      {/* Income Streams Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Documented Income Streams</h3>
          <span className="text-xs text-slate-400">Persona: {preset.name}</span>
        </div>

        {incomes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            No income streams logged yet. Click "Add Income Stream" to begin!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {incomes.map((inc) => (
              <div
                key={inc.id}
                className="p-4 hover:bg-slate-850/60 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{inc.source}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        inc.type === 'fixed'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {inc.type}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {inc.frequency}
                    </span>
                  </div>
                  {inc.notes && (
                    <p className="text-xs text-slate-400">{inc.notes}</p>
                  )}
                  {inc.dateReceived && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Received: {inc.dateReceived}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-emerald-400">
                      +{formatCurrency(inc.amount, currency)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {totalIncome > 0 ? Math.round((inc.amount / totalIncome) * 100) : 0}% of total
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteIncome(inc.id)}
                    title="Delete income stream"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Income Stream Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Add New Income Stream
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Income Source Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp Salary, Upwork Client, Monthly Allowance"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="3500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="fixed">Fixed / Salary</option>
                    <option value="variable">Variable / Client</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                    <option value="one-off">One-off / Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Date Received
                  </label>
                  <input
                    type="date"
                    value={dateReceived}
                    onChange={(e) => setDateReceived(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Notes / Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Net after withholding, Milestone 2 payment"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                  Save Inflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
