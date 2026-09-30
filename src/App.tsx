import React, { useState, useEffect } from 'react';
import { SCENARIO_PRESETS } from './data/presets';
import { 
  ScenarioId, 
  IncomeItem, 
  ExpenseItem, 
  BudgetLimit, 
  SavingsGoal, 
  ChatMessage, 
  ExpenseCategory 
} from './types/finance';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { IncomeView } from './components/IncomeView';
import { ExpensesView } from './components/ExpensesView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { SavingsView } from './components/SavingsView';
import { MonthlyReportView } from './components/MonthlyReportView';
import { SahilChatView } from './components/SahilChatView';
import { SahilChatFloating } from './components/SahilChatFloating';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateExpensesByCategory,
  calculateHealthScore 
} from './utils/financeUtils';

export default function App() {
  const [currentScenario, setCurrentScenario] = useState<ScenarioId>('salaried');
  const [currency, setCurrency] = useState<string>('$');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);

  // Financial Data State
  const currentPreset = SCENARIO_PRESETS[currentScenario] || SCENARIO_PRESETS['salaried'];
  const [incomes, setIncomes] = useState<IncomeItem[]>(currentPreset.incomeSources);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(currentPreset.expenses);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>(currentPreset.budgetLimits);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(currentPreset.savingsGoals);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: currentPreset.sahilWelcomePrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Load preset data when scenario switches
  const handleSelectScenario = (scenarioId: ScenarioId) => {
    setCurrentScenario(scenarioId);
    const preset = SCENARIO_PRESETS[scenarioId];
    if (preset) {
      setIncomes([...preset.incomeSources]);
      setExpenses([...preset.expenses]);
      setBudgetLimits([...preset.budgetLimits]);
      setSavingsGoals([...preset.savingsGoals]);
      setChatMessages([
        {
          id: `welcome-${scenarioId}-${Date.now()}`,
          role: 'assistant',
          content: preset.sahilWelcomePrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleResetData = () => {
    handleSelectScenario(currentScenario);
  };

  const handleExportData = () => {
    const dataToExport = {
      scenario: currentScenario,
      currency,
      incomes,
      expenses,
      budgetLimits,
      savingsGoals,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahil-financial-plan-${currentScenario}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Income handlers
  const handleAddIncome = (item: Omit<IncomeItem, 'id'>) => {
    const newItem: IncomeItem = {
      ...item,
      id: `inc-${Date.now()}`,
    };
    setIncomes((prev) => [newItem, ...prev]);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  // Expense handlers
  const handleAddExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newItem, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Budget handlers
  const handleUpdateLimit = (category: ExpenseCategory, newAmount: number) => {
    setBudgetLimits((prev) =>
      prev.map((b) => (b.category === category ? { ...b, allocatedAmount: newAmount } : b))
    );
  };

  const handleApplyPlan = (newLimits: BudgetLimit[]) => {
    setBudgetLimits(newLimits);
  };

  // Savings handlers
  const handleAddContribution = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
  };

  const handleCreateGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  // Chat message sending with backend API
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    const totalIncome = calculateTotalIncome(incomes);
    const totalExpenses = calculateTotalExpenses(expenses);
    const expensesByCategory = calculateExpensesByCategory(expenses);
    const health = calculateHealthScore(totalIncome, totalExpenses, budgetLimits, expensesByCategory);

    try {
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: chatMessages.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          financialContext: {
            persona: currentPreset.id,
            currency,
            monthlyIncome: totalIncome,
            incomeSources: incomes,
            monthlyExpenses: totalExpenses,
            expensesByCategory,
            budgetLimits: budgetLimits.reduce((acc, curr) => ({ ...acc, [curr.category]: curr.allocatedAmount }), {}),
            savingsGoals,
            savingsRate: health.savingsRate,
            netSavings: totalIncome - totalExpenses,
            healthScore: health.score,
          },
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I'm analyzing your finances. What specific category would you like to optimize?";

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I analyzed your current finances. You have ${currency}${totalIncome} in monthly inflow and ${currency}${totalExpenses} in expenses. Let me know if you would like me to adjust your budget allocations or audit your dining and entertainment spending!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation & Scenario Switcher */}
      <Header
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        currency={currency}
        onChangeCurrency={setCurrency}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onOpenChat={() => setActiveTab('chat')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            preset={currentPreset}
            incomes={incomes}
            expenses={expenses}
            budgetLimits={budgetLimits}
            savingsGoals={savingsGoals}
            currency={currency}
            onNavigateTab={setActiveTab}
            onOpenAddExpense={() => setActiveTab('expenses')}
            onOpenAddIncome={() => setActiveTab('income')}
          />
        )}

        {activeTab === 'income' && (
          <IncomeView
            preset={currentPreset}
            incomes={incomes}
            currency={currency}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            preset={currentPreset}
            expenses={expenses}
            currency={currency}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlannerView
            preset={currentPreset}
            incomes={incomes}
            expenses={expenses}
            budgetLimits={budgetLimits}
            currency={currency}
            onUpdateLimit={handleUpdateLimit}
            onApplyPlan={handleApplyPlan}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsView
            preset={currentPreset}
            savingsGoals={savingsGoals}
            expenses={expenses}
            currency={currency}
            onAddContribution={handleAddContribution}
            onCreateGoal={handleCreateGoal}
          />
        )}

        {activeTab === 'report' && (
          <MonthlyReportView
            preset={currentPreset}
            incomes={incomes}
            expenses={expenses}
            budgetLimits={budgetLimits}
            savingsGoals={savingsGoals}
            currency={currency}
          />
        )}

        {activeTab === 'chat' && (
          <SahilChatView
            preset={currentPreset}
            incomes={incomes}
            expenses={expenses}
            budgetLimits={budgetLimits}
            savingsGoals={savingsGoals}
            currency={currency}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearChat={() => {
              setChatMessages([
                {
                  id: `welcome-${Date.now()}`,
                  role: 'assistant',
                  content: currentPreset.sahilWelcomePrompt,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }}
            isThinking={isThinking}
          />
        )}
      </main>

      {/* Floating Chat Widget (accessible across all tabs except when already on chat tab) */}
      {activeTab !== 'chat' && (
        <SahilChatFloating
          isOpen={isFloatingChatOpen}
          onOpen={() => setIsFloatingChatOpen(true)}
          onClose={() => setIsFloatingChatOpen(false)}
          preset={currentPreset}
          currency={currency}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isThinking={isThinking}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          Sahil • Personal Finance Advisor Bot • AI-Powered Wealth Planning & Budget Intelligence
        </p>
      </footer>
    </div>
  );
}
