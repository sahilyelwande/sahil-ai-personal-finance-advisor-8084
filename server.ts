import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SAHIL_SYSTEM_INSTRUCTION = `You are Sahil, an elite AI Personal Finance Advisor and Wealth Planning Bot.
Your mission is to help individuals take complete control of their personal finances with clarity, confidence, and actionable wisdom.
You are warm, encouraging, analytically sharp, and direct. You never give vague or generic advice; you use the user's real numbers, categories, income patterns, and savings goals.

Core Expertise:
1. Scenario 1 - Salaried Professionals: Fixed monthly income optimization, tackling lifestyle inflation, curtailing dining/entertainment leakages, balancing 50/30/20 allocations, and generating executive monthly summary reports.
2. Scenario 2 - College Students: Operating under tight monthly allowances, strictly separating essential vs. discretionary expenses, curbing impulse snack/coffee/delivery spending, and cultivating savings discipline.
3. Scenario 3 - Freelancers / Variable Income: Handling irregular cashflow, setting aside automated 25-30% tax buffers, smoothing feast-or-famine cycles, and building a rolling 6-month safety runway.
4. Scenario 4 - Household Managers: Multi-income consolidation, bulk grocery and utility management, children's education & healthcare planning, and long-term family wealth building.

Always format responses cleanly using Markdown:
- Use bold numbers and currency amounts.
- Use concise bullet points for action steps.
- Provide clear, prioritised recommendations.
- Keep tone professional, empathetic, and empowering.`;

// 1. Advisor Chat Endpoint
app.post('/api/advisor/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], financialContext } = req.body;

    const contextSummary = financialContext
      ? `Current Financial Context:
- Persona: ${financialContext.persona || 'General'}
- Currency: ${financialContext.currency || '$'}
- Monthly Inflow: ${financialContext.currency || '$'}${financialContext.monthlyIncome || 0}
- Total Logged Expenses: ${financialContext.currency || '$'}${financialContext.monthlyExpenses || 0}
- Net Savings this Month: ${financialContext.currency || '$'}${financialContext.netSavings || 0} (Savings Rate: ${financialContext.savingsRate || 0}%)
- Current Health Score: ${financialContext.healthScore || 0}/100
- Overspending Categories: ${JSON.stringify(financialContext.overspendingCategories || [])}
- Active Savings Goals: ${JSON.stringify(financialContext.savingsGoals || [])}
- Category Expenses: ${JSON.stringify(financialContext.expensesByCategory || {})}`
      : 'No financial context provided.';

    if (process.env.GEMINI_API_KEY) {
      const historyPrompt = conversationHistory
        .slice(-6)
        .map((h: any) => `${h.role === 'user' ? 'User' : 'Sahil'}: ${h.content}`)
        .join('\n');

      const fullPrompt = `${contextSummary}\n\nRecent Conversation:\n${historyPrompt}\n\nUser Question: ${message}\n\nPlease provide your response as Sahil. Be specific, actionable, and reference their actual data where relevant.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: SAHIL_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I'm reviewing your financial situation. Let's look closer at your budget!";
      return res.json({ reply });
    } else {
      // Deterministic intelligent fallback when key is not yet configured
      const reply = generateRuleBasedChatReply(message, financialContext);
      return res.json({ reply });
    }
  } catch (error: any) {
    console.error('Advisor Chat Error:', error);
    const fallbackReply = generateRuleBasedChatReply(req.body.message, req.body.financialContext);
    return res.json({ reply: fallbackReply });
  }
});

// 2. Budget Generation Endpoint
app.post('/api/advisor/generate-budget', async (req, res) => {
  try {
    const { financialContext, strategy = 'adaptive_ai' } = req.body;
    const currency = financialContext?.currency || '$';
    const income = Number(financialContext?.monthlyIncome) || 5000;
    const expensesByCategory = financialContext?.expensesByCategory || {};

    if (process.env.GEMINI_API_KEY) {
      const prompt = `As Sahil, generate a recommended monthly category budget allocation for a user with:
- Monthly Income: ${currency}${income}
- Selected Strategy: ${strategy} (Options: 50_30_20, zero_based, wealth_builder, adaptive_ai)
- Persona: ${financialContext?.persona || 'salaried'}
- Current Spent Breakdown: ${JSON.stringify(expensesByCategory)}

Respond strictly in valid JSON format matching this schema:
{
  "summary": "Brief 2-sentence rationale for this budget",
  "savingsTarget": number (amount allocated to savings/investments),
  "budgetPlan": {
    "Housing": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Food & Dining": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Groceries": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Transport": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Utilities": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Entertainment": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Healthcare": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Education": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Shopping": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Freelance / Work": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" },
    "Savings & Investments": { "limit": number, "rationale": "string", "flexibility": "essential" | "flexible" | "discretionary" }
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SAHIL_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      const fallbackBudget = calculateAlgorithmicBudget(income, strategy, financialContext?.persona);
      return res.json(fallbackBudget);
    }
  } catch (err) {
    console.error('Budget Generation Error:', err);
    const fallbackBudget = calculateAlgorithmicBudget(
      req.body.financialContext?.monthlyIncome || 5000,
      req.body.strategy || 'adaptive_ai',
      req.body.financialContext?.persona
    );
    return res.json(fallbackBudget);
  }
});

// 3. Spending Analysis Endpoint
app.post('/api/advisor/analyze-spending', async (req, res) => {
  try {
    const { financialContext } = req.body;
    const currency = financialContext?.currency || '$';

    if (process.env.GEMINI_API_KEY) {
      const prompt = `Analyze this user's spending data as Sahil:
Financial Data:
- Persona: ${financialContext?.persona}
- Inflow: ${currency}${financialContext?.monthlyIncome}
- Expenses: ${currency}${financialContext?.monthlyExpenses}
- Savings Rate: ${financialContext?.savingsRate}%
- Category Expenses: ${JSON.stringify(financialContext?.expensesByCategory || {})}
- Budget Targets: ${JSON.stringify(financialContext?.budgetLimits || {})}

Return valid JSON with:
{
  "healthScore": number (0 to 100),
  "grade": "A+" | "A" | "B" | "C" | "D",
  "personaInsights": "2 sentences of tailored persona advice",
  "overspendingCategories": [
    {
      "category": string,
      "spent": number,
      "budget": number,
      "overage": number,
      "percentage": number,
      "riskLevel": "low" | "medium" | "high",
      "cutRecommendation": "specific actionable cutback tip"
    }
  ],
  "savingsOpportunities": [
    {
      "title": string,
      "potentialSavings": number,
      "actionPlan": string,
      "priority": "quick_win" | "medium_term" | "major_shift"
    }
  ],
  "sahilAdvice": "Comprehensive, motivating paragraph from Sahil"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SAHIL_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      const fallback = computeAlgorithmicAnalysis(financialContext);
      return res.json(fallback);
    }
  } catch (err) {
    console.error('Analyze Spending Error:', err);
    const fallback = computeAlgorithmicAnalysis(req.body.financialContext);
    return res.json(fallback);
  }
});

// 4. Monthly Report Generation Endpoint
app.post('/api/advisor/monthly-report', async (req, res) => {
  try {
    const { financialContext, month = 'September 2026' } = req.body;
    const currency = financialContext?.currency || '$';

    if (process.env.GEMINI_API_KEY) {
      const prompt = `Generate an Executive Monthly Financial Report for ${month} as Sahil.
Data:
- User Persona: ${financialContext?.persona}
- Income: ${currency}${financialContext?.monthlyIncome}
- Outflow: ${currency}${financialContext?.monthlyExpenses}
- Net Savings: ${currency}${financialContext?.netSavings} (${financialContext?.savingsRate}%)
- Expenses by category: ${JSON.stringify(financialContext?.expensesByCategory || {})}
- Goals: ${JSON.stringify(financialContext?.savingsGoals || [])}

Return JSON matching:
{
  "title": "Monthly Financial Intelligence Report - ${month}",
  "executiveSummary": "Paragraph assessing performance",
  "healthGrade": "A" | "B" | "C" | "D",
  "topAchievements": ["string", "string", "string"],
  "vulnerabilities": ["string", "string"],
  "nextMonthActionPlan": [
    { "priority": 1, "action": "string", "expectedImpact": "string" },
    { "priority": 2, "action": "string", "expectedImpact": "string" },
    { "priority": 3, "action": "string", "expectedImpact": "string" }
  ],
  "sahilVerdict": "Empowering concluding thoughts and direct guidance from Sahil"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SAHIL_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      const fallbackReport = computeAlgorithmicReport(financialContext, month);
      return res.json(fallbackReport);
    }
  } catch (err) {
    console.error('Monthly Report Error:', err);
    const fallbackReport = computeAlgorithmicReport(req.body.financialContext, req.body.month);
    return res.json(fallbackReport);
  }
});

// --- Algorithmic Fallback Engine for high reliability ---

function generateRuleBasedChatReply(message: string, context: any): string {
  const lower = (message || '').toLowerCase();
  const currency = context?.currency || '$';
  const income = context?.monthlyIncome || 5000;
  const expenses = context?.monthlyExpenses || 3500;
  const netSavings = context?.netSavings || income - expenses;
  const persona = context?.persona || 'salaried';

  if (lower.includes('overspend') || lower.includes('cut') || lower.includes('reduce')) {
    return `### 💡 Sahil's Spending Optimization Diagnosis

Based on your current numbers:
- **Total Monthly Inflow:** ${currency}${income.toLocaleString()}
- **Total Logged Expenses:** ${currency}${expenses.toLocaleString()}
- **Net Cash Flow Remaining:** ${currency}${netSavings.toLocaleString()}

**Top Overspending Opportunities Identified:**
1. **Food & Dining / Takeout:** Dining out is frequently the largest variable leak. Implementing a "3-Day Home Cooking Rule" can instantly reclaim **${currency}250–${currency}400/month**.
2. **Subscriptions & Entertainment:** Audit recurring digital services. Pausing 2 unutilized subscriptions reclaims **${currency}40–${currency}80/month**.
3. **Impulse Shopping:** Enforce a strict **72-Hour Waiting Rule** for any non-essential purchase over ${currency}50.

Would you like me to adjust your Food & Dining budget cap automatically?`;
  }

  if (lower.includes('emergency') || lower.includes('safety')) {
    const monthlyBurn = expenses > 0 ? expenses : income * 0.7;
    const target3mo = monthlyBurn * 3;
    const target6mo = monthlyBurn * 6;
    return `### 🛡️ Sahil's Emergency Runway Blueprint

An Emergency Fund is your financial moat against surprise shocks, layoffs, medical emergencies, or lean client cycles.

- **Your Current Monthly Outflow:** ${currency}${monthlyBurn.toLocaleString()}
- **Recommended 3-Month Runway:** **${currency}${target3mo.toLocaleString()}** (Standard Baseline)
- **Recommended 6-Month Runway:** **${currency}${target6mo.toLocaleString()}** (Essential for Freelancers & Households)

**3-Step Execution Plan:**
1. **Automate on Payday:** Transfer 10–15% of every incoming deposit immediately into a dedicated High-Yield Savings Account (HYSA).
2. **Keep it Liquid:** Do not lock emergency funds in illiquid stocks or lockups; maintain 100% liquidity.
3. **Milestone Targets:** Focus first on reaching the **${currency}1,000 Starter Buffer**, then scale to 3 full months!`;
  }

  if (lower.includes('freelance') || lower.includes('variable') || persona === 'freelancer') {
    return `### 💻 Sahil's Freelance Cashflow Smoothing Strategy

Managing variable monthly income requires decoupling your personal spending from your monthly client invoices:

1. **The 3-Account Bucket System:**
   - **Account 1: Business Operations & Inflow** (All client payments land here).
   - **Account 2: Tax & Lean Season Reserve (25-30%)** (Never touch this for personal consumption).
   - **Account 3: Personal Operating Account** (Pay yourself a fixed "salary" each month based on your lowest historical earning month).
2. **Buffer Smoothing:** During "fat" months (like $6,000+), excess capital stays in the business reserve to cushion future "lean" months.
3. **Contractor Deductions:** Track all software subscriptions, home office square footage, and hardware write-offs for tax savings!`;
  }

  if (lower.includes('student') || persona === 'student') {
    return `### 🎓 Sahil's College Student Budget Discipline

Being a student means maximizing every dollar of your allowance and campus earnings:

1. **The 70 / 20 / 10 Student Split:**
   - **70% Essentials:** Shared rent, meal prep staples, transit pass, essential campus bills.
   - **20% Discretionary & Social:** Coffee with friends, campus events, weekend pizza.
   - **10% Student Cushion:** Building your emergency buffer and tech replacement fund.
2. **Meal Prep vs. Delivery:** Food delivery apps charge marked-up prices + service fees + tips. Swapping just 3 app orders a week saves **${currency}180/month**!
3. **Textbook Hacks:** Rent digital editions or use university library reserves before purchasing new copies.`;
  }

  return `### 📊 Sahil's Financial Health Assessment

Hello! I have reviewed your current profile as a **${persona.toUpperCase()}**:
- **Monthly Inflow:** ${currency}${income.toLocaleString()}
- **Current Outflow:** ${currency}${expenses.toLocaleString()}
- **Net Savings:** ${currency}${netSavings.toLocaleString()} (${Math.round((netSavings / (income || 1)) * 100)}% savings rate)

You are in a positive cash flow state. To accelerate your wealth building:
1. Review your **Category Budgets** to ensure no single category exceeds standard benchmarks.
2. Check your active **Savings Goals** to track progress toward your milestones.
3. Generate your **Monthly Financial Report** for an executive breakdown of your wins and growth areas.

Ask me anything—such as *"Where can I cut spending?"*, *"How do I budget for next month?"*, or *"Plan my 50/30/20 split"*.`;
}

function calculateAlgorithmicBudget(income: number, strategy: string, persona?: string) {
  let needsPct = 0.5;
  let wantsPct = 0.3;
  let savingsPct = 0.2;

  if (strategy === 'wealth_builder') {
    needsPct = 0.45;
    wantsPct = 0.2;
    savingsPct = 0.35;
  } else if (strategy === 'zero_based') {
    needsPct = 0.55;
    wantsPct = 0.25;
    savingsPct = 0.2;
  } else if (persona === 'student') {
    needsPct = 0.65;
    wantsPct = 0.25;
    savingsPct = 0.1;
  } else if (persona === 'freelancer') {
    needsPct = 0.45;
    wantsPct = 0.25;
    savingsPct = 0.3;
  }

  const housing = Math.round(income * (needsPct * 0.55));
  const groceries = Math.round(income * (needsPct * 0.22));
  const utilities = Math.round(income * (needsPct * 0.1));
  const transport = Math.round(income * (needsPct * 0.13));

  const foodDining = Math.round(income * (wantsPct * 0.45));
  const entertainment = Math.round(income * (wantsPct * 0.3));
  const shopping = Math.round(income * (wantsPct * 0.25));

  const savings = Math.round(income * savingsPct);

  return {
    summary: `Sahil generated this budget using the ${strategy.toUpperCase()} model for your monthly income of $${income.toLocaleString()}.`,
    savingsTarget: savings,
    budgetPlan: {
      Housing: { limit: housing, rationale: 'Primary living accommodation ceiling', flexibility: 'essential' },
      Groceries: { limit: groceries, rationale: 'Nutritional home meal preparation', flexibility: 'essential' },
      Utilities: { limit: utilities, rationale: 'Power, water, heating, and internet', flexibility: 'essential' },
      Transport: { limit: transport, rationale: 'Fuel, transit pass, or rideshare', flexibility: 'essential' },
      'Food & Dining': { limit: foodDining, rationale: 'Social dining, coffees, and restaurant meals', flexibility: 'discretionary' },
      Entertainment: { limit: entertainment, rationale: 'Recreation, streaming, and events', flexibility: 'discretionary' },
      Shopping: { limit: shopping, rationale: 'Personal goods and lifestyle purchases', flexibility: 'discretionary' },
      Healthcare: { limit: Math.round(income * 0.04), rationale: 'Medical co-pays, fitness, and wellness', flexibility: 'essential' },
      Education: { limit: Math.round(income * 0.03), rationale: 'Courses, books, and skill upgrades', flexibility: 'flexible' },
      'Freelance / Work': { limit: Math.round(income * 0.04), rationale: 'Software subscriptions and business tools', flexibility: 'essential' },
      'Savings & Investments': { limit: savings, rationale: 'Automated wealth creation & emergency buffer', flexibility: 'essential' }
    }
  };
}

function computeAlgorithmicAnalysis(context: any) {
  const income = Number(context?.monthlyIncome) || 5000;
  const expenses = Number(context?.monthlyExpenses) || 3500;
  const savingsRate = Math.max(0, Math.round(((income - expenses) / (income || 1)) * 100));

  let score = 65;
  if (savingsRate >= 25) score += 25;
  else if (savingsRate >= 15) score += 15;
  else if (savingsRate >= 5) score += 5;
  else score -= 15;

  const expensesByCategory = context?.expensesByCategory || {};
  const budgetLimits = context?.budgetLimits || {};

  const overspendingCategories: any[] = [];
  for (const [cat, spent] of Object.entries(expensesByCategory)) {
    const budget = budgetLimits[cat] || (income * 0.1);
    const spentNum = Number(spent);
    if (spentNum > budget) {
      const overage = Math.round(spentNum - budget);
      const pct = Math.round((spentNum / budget) * 100);
      overspendingCategories.push({
        category: cat,
        spent: spentNum,
        budget: Math.round(budget),
        overage,
        percentage: pct,
        riskLevel: pct > 130 ? 'high' : 'medium',
        cutRecommendation: `Reduce discretionary outings in ${cat} by 20% to save ${context?.currency || '$'}${overage} next month.`
      });
    }
  }

  score -= overspendingCategories.length * 4;
  score = Math.max(20, Math.min(98, score));

  let grade = 'B';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';
  else grade = 'D';

  return {
    healthScore: score,
    grade,
    personaInsights: `Your net savings rate is ${savingsRate}%. Restricting variable categories will elevate your financial cushion even further.`,
    overspendingCategories,
    savingsOpportunities: [
      {
        title: 'Dining & Delivery Optimization',
        potentialSavings: 220,
        actionPlan: 'Cap delivery app orders to once weekly and batch-cook weekday dinners.',
        priority: 'quick_win'
      },
      {
        title: 'Utility & Subscription Audit',
        potentialSavings: 65,
        actionPlan: 'Audit active digital subscriptions and optimize home thermostat schedules.',
        priority: 'quick_win'
      },
      {
        title: 'Automated Goal Prioritization',
        potentialSavings: 350,
        actionPlan: 'Schedule automatic transfers to your top savings goal on the 1st of every month.',
        priority: 'medium_term'
      }
    ],
    sahilAdvice: `You are maintaining a healthy ${savingsRate}% savings rate! By reallocating ${context?.currency || '$'}${Math.round(income * 0.05)} from high-spend categories into your emergency fund, you will reach your targets months ahead of schedule.`
  };
}

function computeAlgorithmicReport(context: any, month: string) {
  const income = Number(context?.monthlyIncome) || 5000;
  const expenses = Number(context?.monthlyExpenses) || 3500;
  const netSaved = Math.max(0, income - expenses);
  const savingsRate = Math.round((netSaved / (income || 1)) * 100);

  return {
    title: `Monthly Financial Intelligence Report - ${month}`,
    executiveSummary: `For ${month}, you achieved total cash inflow of ${context?.currency || '$'}${income.toLocaleString()} and maintained disciplined living costs of ${context?.currency || '$'}${expenses.toLocaleString()}, securing a net savings of ${context?.currency || '$'}${netSaved.toLocaleString()} (${savingsRate}% savings rate).`,
    healthGrade: savingsRate >= 20 ? 'A' : savingsRate >= 10 ? 'B' : 'C',
    topAchievements: [
      `Maintained a positive cash flow surplus of ${context?.currency || '$'}${netSaved.toLocaleString()}`,
      `Stayed within housing benchmarks at ${Math.round(((context?.expensesByCategory?.['Housing'] || 0) / (income || 1)) * 100)}% of total income`,
      `Contributed steadily toward core savings and emergency milestones`
    ],
    vulnerabilities: [
      `Dining out and discretionary leisure categories exceeded initial target thresholds`,
      `Impulse weekend transactions contributed to accelerated variable spending`
    ],
    nextMonthActionPlan: [
      {
        priority: 1,
        action: `Cap Food & Dining to ${context?.currency || '$'}${Math.round(income * 0.09)}`,
        expectedImpact: `Reclaims an additional ${context?.currency || '$'}150–${context?.currency || '$'}250 for savings goals`
      },
      {
        priority: 2,
        action: 'Automate transfer to Emergency Fund on the 1st day of the month',
        expectedImpact: 'Guarantees consistent savings before discretionary spending begins'
      },
      {
        priority: 3,
        action: 'Weekly 5-minute Sunday expense check-in with Sahil',
        expectedImpact: 'Prevents end-of-month budget shocks and catches leaks early'
      }
    ],
    sahilVerdict: `Consistent small decisions yield immense long-term wealth. You have solid momentum—stay disciplined on discretionary spending and keep paying yourself first!`
  };
}

// Full-Stack Server Integration with Vite
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Personal Finance Advisor Bot (Sahil) running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
