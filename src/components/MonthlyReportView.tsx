import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Award,
  RefreshCw
} from 'lucide-react';
import { 
  PersonaPreset, 
  IncomeItem, 
  ExpenseItem, 
  BudgetLimit, 
  SavingsGoal 
} from '../types/finance';
import { 
  formatCurrency, 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateExpensesByCategory,
  calculateHealthScore 
} from '../utils/financeUtils';

interface MonthlyReportViewProps {
  preset: PersonaPreset;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  budgetLimits: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  currency: string;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  preset,
  incomes,
  expenses,
  budgetLimits,
  savingsGoals,
  currency,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReportData, setAiReportData] = useState<any>(null);

  const totalIncome = calculateTotalIncome(incomes);
  const totalExpenses = calculateTotalExpenses(expenses);
  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const expensesByCategory = calculateExpensesByCategory(expenses);
  const health = calculateHealthScore(totalIncome, totalExpenses, budgetLimits, expensesByCategory);

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateAiReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/advisor/monthly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          financialContext: {
            persona: preset.id,
            currency,
            monthlyIncome: totalIncome,
            monthlyExpenses: totalExpenses,
            netSavings,
            savingsRate: health.savingsRate,
            expensesByCategory,
            savingsGoals: savingsGoals.map((g) => ({ name: g.name, current: g.currentAmount, target: g.targetAmount })),
          },
        }),
      });
      const data = await response.json();
      setAiReportData(data);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Executive Monthly Financial Intelligence Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured monthly performance audit, category variance, and prioritized action plan by Sahil.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="October 2026">October 2026 (Forecast)</option>
          </select>

          <button
            onClick={handleGenerateAiReport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Analyzing with AI...' : 'Re-Generate AI Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm print:border print:border-emerald-600">
                S
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white print:text-slate-900">
                Sahil Financial Intelligence Audit
              </h1>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Personal Wealth Review for <strong className="text-white print:text-slate-900">{preset.name}</strong> ({preset.role})
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Reporting Period
            </span>
            <span className="text-base font-bold text-white print:text-slate-900">
              {selectedMonth}
            </span>
            <span className="text-[11px] text-slate-400 print:text-slate-500 block">
              Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Executive Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700 leading-relaxed bg-slate-850 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-200">
            {aiReportData?.executiveSummary || 
              `During ${selectedMonth}, you recorded total cash inflow of ${formatCurrency(totalIncome, currency)} against living expenses of ${formatCurrency(totalExpenses, currency)}, closing the monthly cycle with a net capital surplus of ${formatCurrency(netSavings, currency)} (${health.savingsRate}% net savings rate). Your financial posture earns an overall health grade of ${health.grade}. Housing and baseline obligations remained stable, while variable leisure spending presents an actionable optimization opportunity for next month.`
            }
          </p>
        </div>

        {/* 3 Core KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Inflow</span>
            <span className="text-xl font-bold text-white print:text-slate-900 mt-1 block">
              {formatCurrency(totalIncome, currency)}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">100% Documented</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Outflow</span>
            <span className="text-xl font-bold text-rose-400 mt-1 block">
              {formatCurrency(totalExpenses, currency)}
            </span>
            <span className="text-[10px] text-slate-400">
              {totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}% of inflow
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Net Savings Achieved</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">
              {formatCurrency(netSavings, currency)}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">{health.savingsRate}% Savings Rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Health Grade</span>
            <span className="text-xl font-bold text-indigo-400 mt-1 block">
              {aiReportData?.healthGrade || health.grade} ({health.score}/100)
            </span>
            <span className="text-[10px] text-slate-400">Benchmarked Model</span>
          </div>
        </div>

        {/* Wins & Vulnerabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Achievements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Key Achievements & Financial Wins
            </h4>
            <div className="space-y-2 text-xs">
              {(aiReportData?.topAchievements || [
                `Maintained positive net cashflow surplus of ${formatCurrency(netSavings, currency)} without incurring debt.`,
                `Essential housing costs strictly adhered to under 35% of total earnings.`,
                `Consistently funded emergency runway and milestone targets on schedule.`
              ]).map((win: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300 print:text-slate-700">{win}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerabilities & Risks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Identified Leakages & Vulnerabilities
            </h4>
            <div className="space-y-2 text-xs">
              {(aiReportData?.vulnerabilities || [
                `Dining out and food delivery apps accounted for elevated discretionary outflow.`,
                `Impulse leisure and unmonitored weekend transactions exceeded initial budget thresholds.`
              ]).map((vuln: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300 print:text-slate-700">{vuln}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Variance Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white print:text-slate-900">
            Category Spending vs. Target Variance
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 print:bg-slate-100 text-slate-400 print:text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Actual Spent</th>
                  <th className="py-3 px-4 text-right">Budget Limit</th>
                  <th className="py-3 px-4 text-right">Variance</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {budgetLimits.map((b) => {
                  const spent = expensesByCategory[b.category] || 0;
                  const variance = b.allocatedAmount - spent;
                  const isOver = variance < 0;

                  return (
                    <tr key={b.category} className="hover:bg-slate-850/50 print:hover:bg-transparent">
                      <td className="py-2.5 px-4 font-medium text-slate-200 print:text-slate-800">
                        {b.category}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300 print:text-slate-700">
                        {formatCurrency(spent, currency)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-400 print:text-slate-600">
                        {formatCurrency(b.allocatedAmount, currency)}
                      </td>
                      <td className={`py-2.5 px-4 text-right font-semibold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isOver ? `-${formatCurrency(Math.abs(variance), currency)}` : `+${formatCurrency(variance, currency)}`}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOver ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isOver ? 'Exceeded' : 'On Track'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Month Actionable Goals */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white print:text-slate-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            3 Prioritized Financial Goals for Next Month
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(aiReportData?.nextMonthActionPlan || [
              {
                priority: 1,
                action: 'Cap Food & Dining out by 20%',
                expectedImpact: 'Reclaims $180 directly for your emergency runway.'
              },
              {
                priority: 2,
                action: 'Automate Payday Transfer',
                expectedImpact: 'Guarantees 20% savings before discretionary spending.'
              },
              {
                priority: 3,
                action: 'Audit 2 Digital Subscriptions',
                expectedImpact: 'Eliminates $45/mo in recurring recurring phantom leakages.'
              }
            ]).map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-850 print:bg-slate-50 border border-slate-800 print:border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                  Priority {item.priority || idx + 1}
                </span>
                <h5 className="font-bold text-white print:text-slate-900 text-xs sm:text-sm mt-1">
                  {item.action}
                </h5>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  {item.expectedImpact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sahil Sign-off & Verdict */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-400 print:text-slate-600 max-w-xl">
            <span className="font-bold text-white print:text-slate-900 block mb-1">
              Advisor Verdict by Sahil:
            </span>
            <p className="italic">
              "{aiReportData?.sahilVerdict || 'Wealth is not built overnight, but through relentless small automated habits. You have demonstrated solid foundational cash flow discipline. Execute the 3 next-month goals, and we will accelerate your runway even further.'}"
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-serif italic text-emerald-400 print:text-emerald-700 text-lg block">
              Sahil
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
              AI Personal Wealth Coach
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
