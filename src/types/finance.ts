export type ScenarioId = 'salaried' | 'student' | 'freelancer' | 'household' | 'custom';

export type ExpenseCategory =
  | 'Housing'
  | 'Food & Dining'
  | 'Groceries'
  | 'Transport'
  | 'Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Shopping'
  | 'Freelance / Work'
  | 'Debt & Loans'
  | 'Savings & Investments'
  | 'Other';

export interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  type: 'fixed' | 'variable';
  frequency: 'monthly' | 'bi-weekly' | 'weekly' | 'one-off';
  dateReceived?: string;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  isRecurring?: boolean;
  paymentMethod?: 'Card' | 'Bank Transfer' | 'Cash' | 'Digital Wallet';
}

export interface BudgetLimit {
  category: ExpenseCategory;
  allocatedAmount: number;
  rationale?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  monthlyContribution: number;
  iconName: string;
  category: 'emergency' | 'purchase' | 'milestone' | 'education' | 'family';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; actionType: string; payload?: any }>;
}

export interface FinancialHealthAnalysis {
  healthScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  savingsRate: number; // percentage e.g. 24.5
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  overspendingAlerts: Array<{
    category: ExpenseCategory;
    spent: number;
    budget: number;
    overage: number;
    percentage: number;
    advice: string;
  }>;
  savingsOpportunities: Array<{
    title: string;
    estimatedMonthlySavings: number;
    difficulty: 'Easy' | 'Moderate' | 'Strategic';
    description: string;
  }>;
  sahilAdvice: string;
}

export interface MonthlyReport {
  id: string;
  monthName: string;
  generatedDate: string;
  executiveSummary: string;
  totalIncome: number;
  totalExpenses: number;
  netSaved: number;
  savingsRate: number;
  healthGrade: string;
  topAchievements: string[];
  vulnerabilities: string[];
  categoryBreakdown: Array<{
    category: string;
    spent: number;
    budgeted: number;
    variance: number;
  }>;
  nextMonthActionPlan: Array<{
    priority: number;
    action: string;
    expectedImpact: string;
  }>;
  sahilVerdict: string;
}

export interface PersonaPreset {
  id: ScenarioId;
  name: string;
  role: string;
  tagline: string;
  avatar: string;
  currency: string;
  monthlyIncome: number;
  incomeSources: IncomeItem[];
  expenses: ExpenseItem[];
  budgetLimits: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  description: string;
  sahilWelcomePrompt: string;
}
