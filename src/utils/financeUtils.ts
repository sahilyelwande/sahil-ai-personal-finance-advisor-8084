import { ExpenseItem, IncomeItem, BudgetLimit, ExpenseCategory } from '../types/finance';

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Housing: '#3B82F6', // Blue
  'Food & Dining': '#F97316', // Orange
  Groceries: '#10B981', // Emerald
  Transport: '#8B5CF6', // Purple
  Utilities: '#06B6D4', // Cyan
  Entertainment: '#EC4899', // Pink
  Healthcare: '#EF4444', // Red
  Education: '#6366F1', // Indigo
  Shopping: '#F59E0B', // Amber
  'Freelance / Work': '#14B8A6', // Teal
  'Debt & Loans': '#E11D48', // Rose
  'Savings & Investments': '#059669', // Dark Emerald
  Other: '#64748B', // Slate
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Housing: 'Home',
  'Food & Dining': 'Utensils',
  Groceries: 'ShoppingBag',
  Transport: 'Car',
  Utilities: 'Zap',
  Entertainment: 'Film',
  Healthcare: 'HeartPulse',
  Education: 'GraduationCap',
  Shopping: 'Tag',
  'Freelance / Work': 'Briefcase',
  'Debt & Loans': 'CreditCard',
  'Savings & Investments': 'PiggyBank',
  Other: 'CircleDot',
};

export function formatCurrency(amount: number, currency: string = '$'): string {
  const rounded = Math.round(amount * 100) / 100;
  return `${currency}${rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function calculateTotalIncome(incomeList: IncomeItem[]): number {
  return incomeList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

export function calculateTotalExpenses(expenseList: ExpenseItem[]): number {
  return expenseList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

export function calculateExpensesByCategory(
  expenseList: ExpenseItem[]
): Record<ExpenseCategory, number> {
  const result: Partial<Record<ExpenseCategory, number>> = {};
  for (const exp of expenseList) {
    result[exp.category] = (result[exp.category] || 0) + exp.amount;
  }
  return result as Record<ExpenseCategory, number>;
}

export function calculateHealthScore(
  totalIncome: number,
  totalExpenses: number,
  budgetLimits: BudgetLimit[],
  expensesByCategory: Record<ExpenseCategory, number>
): { score: number; grade: 'A+' | 'A' | 'B' | 'C' | 'D'; savingsRate: number } {
  if (totalIncome <= 0) {
    return { score: 50, grade: 'C', savingsRate: 0 };
  }

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = Math.round((netSavings / totalIncome) * 100);

  let score = 60;

  // Savings rate contribution (up to 30 pts)
  if (savingsRate >= 30) score += 30;
  else if (savingsRate >= 20) score += 24;
  else if (savingsRate >= 10) score += 16;
  else if (savingsRate >= 0) score += 6;
  else score -= 25; // Negative cashflow

  // Budget discipline check (up to 15 pts)
  let overages = 0;
  for (const b of budgetLimits) {
    const spent = expensesByCategory[b.category] || 0;
    if (spent > b.allocatedAmount * 1.1) {
      overages++;
    }
  }

  if (overages === 0) score += 10;
  else if (overages <= 2) score += 2;
  else score -= overages * 4;

  const clampedScore = Math.max(15, Math.min(99, score));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  if (clampedScore >= 90) grade = 'A+';
  else if (clampedScore >= 80) grade = 'A';
  else if (clampedScore >= 70) grade = 'B';
  else if (clampedScore >= 60) grade = 'C';
  else grade = 'D';

  return { score: clampedScore, grade, savingsRate };
}
