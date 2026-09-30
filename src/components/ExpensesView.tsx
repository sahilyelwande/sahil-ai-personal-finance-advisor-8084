import React, { useState } from 'react';
import { 
  Plus, 
  Receipt, 
  Search, 
  Trash2, 
  Calendar, 
  CreditCard, 
  Sparkles,
  ShoppingBag,
  Coffee,
  Zap,
  Tag
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, PersonaPreset } from '../types/finance';
import { 
  formatCurrency, 
  calculateTotalExpenses, 
  CATEGORY_COLORS 
} from '../utils/financeUtils';

interface ExpensesViewProps {
  preset: PersonaPreset;
  expenses: ExpenseItem[];
  currency: string;
  onAddExpense: (item: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Housing',
  'Food & Dining',
  'Groceries',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Freelance / Work',
  'Debt & Loans',
  'Savings & Investments',
  'Other',
];

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  currency,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Bank Transfer' | 'Cash' | 'Digital Wallet'>('Card');

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const totalExpenses = calculateTotalExpenses(expenses);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    onAddExpense({
      description: description.trim(),
      amount: Number(amount),
      category,
      date,
      isRecurring,
      paymentMethod,
    });

    setDescription('');
    setAmount('');
    setIsModalOpen(false);
  };

  const handleQuickAdd = (presetDesc: string, presetAmount: number, presetCat: ExpenseCategory) => {
    onAddExpense({
      description: presetDesc,
      amount: presetAmount,
      category: presetCat,
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      paymentMethod: 'Card',
    });
  };

  // Filter & Sort
  const filteredExpenses = expenses
    .filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategoryFilter === 'All' || exp.category === selectedCategoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Title & Add Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-rose-400" />
            Expense Logger & Categorization
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Log daily and weekly transactions to reveal spending habits and identify savings leaks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Quick Add Presets Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> One-Click Quick Presets
          </span>
          <span className="text-[11px] text-slate-400">Click to instantly log common expenses</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAdd('Morning Coffee & Muffin', 6.5, 'Food & Dining')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Coffee ({formatCurrency(6.5, currency)})</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Weekly Grocery Staples', 85, 'Groceries')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Groceries ({formatCurrency(85, currency)})</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Public Transit Pass Reload', 30, 'Transport')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
            <span>Transit ({formatCurrency(30, currency)})</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Food Delivery App Order', 32, 'Food & Dining')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span>Takeout ({formatCurrency(32, currency)})</span>
          </button>
          <button
            onClick={() => handleQuickAdd('Electric & Power Utility', 75, 'Utilities')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Utility ({formatCurrency(75, currency)})</span>
          </button>
        </div>
      </div>

      {/* Filters, Search & Sort Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-850 border border-slate-750 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedCategoryFilter === 'All'
                ? 'bg-rose-500 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            All ({expenses.length})
          </button>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategoryFilter === cat
                  ? 'bg-rose-500 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-xs text-slate-400">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Expenses Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>
            Showing {filteredExpenses.length} of {expenses.length} entries
          </span>
          <span className="font-bold text-rose-400">
            Total Logged: {formatCurrency(totalExpenses, currency)}
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            No expenses found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 hover:bg-slate-850/60 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#64748B' }}
                    title={exp.category}
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {exp.description}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 mt-0.5 flex-wrap">
                      <span className="font-medium text-slate-300">{exp.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.date}
                      </span>
                      {exp.paymentMethod && (
                        <>
                          <span>•</span>
                          <span>{exp.paymentMethod}</span>
                        </>
                      )}
                      {exp.isRecurring && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">
                          Recurring
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-bold text-rose-400">
                      -{formatCurrency(exp.amount, currency)}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    title="Delete expense"
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

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-400" />
              Log New Expense
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Description / Vendor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trader Joe's Groceries, Electric Bill, Metro Pass"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
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
                    placeholder="45"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer / ACH</option>
                    <option value="Digital Wallet">Apple / Google Pay</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="recurring" className="text-xs text-slate-300 cursor-pointer">
                  This is a recurring monthly bill (rent, utility, subscription)
                </label>
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-md shadow-rose-600/20"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
