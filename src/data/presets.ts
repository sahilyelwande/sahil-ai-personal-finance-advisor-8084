import { PersonaPreset } from '../types/finance';

export const SCENARIO_PRESETS: Record<string, PersonaPreset> = {
  salaried: {
    id: 'salaried',
    name: 'Alex Rivera',
    role: 'Senior Product Analyst (Salaried)',
    tagline: 'Fixed monthly paycheck, managing urban living costs & lifestyle inflation',
    avatar: '👔',
    currency: '$',
    monthlyIncome: 5200,
    description: 'Scenario 1: Salaried professional tracking rent, dining, transport, and leisure expenses with actionable budget optimization and monthly reporting.',
    sahilWelcomePrompt: "Hi Alex! I've loaded your profile as a salaried professional. Your fixed monthly net income is $5,200. I noticed your Dining Out ($680) and Entertainment ($390) are pacing well above standard guidelines. Let's optimize your 50/30/20 balance and direct an extra $400 into your Emergency & Travel funds this month!",
    incomeSources: [
      {
        id: 'inc-sal-1',
        source: 'Acme Corp Net Monthly Salary',
        amount: 4800,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-01',
        notes: 'Direct deposit after tax, 401k & health insurance deduction'
      },
      {
        id: 'inc-sal-2',
        source: 'Quarterly Retention Bonus (Prorated)',
        amount: 400,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-15',
        notes: 'Quarterly bonus amortized monthly'
      }
    ],
    budgetLimits: [
      { category: 'Housing', allocatedAmount: 1650, rationale: 'Rent for 1BR apartment + building fee' },
      { category: 'Food & Dining', allocatedAmount: 480, rationale: 'Recommended 9-10% of net income' },
      { category: 'Groceries', allocatedAmount: 380, rationale: 'Weekly staple meal preparation' },
      { category: 'Transport', allocatedAmount: 280, rationale: 'Metro card + occasional weekend rideshares' },
      { category: 'Utilities', allocatedAmount: 190, rationale: 'Electric, water, fiber internet' },
      { category: 'Entertainment', allocatedAmount: 220, rationale: 'Events, cinema, and social nights' },
      { category: 'Healthcare', allocatedAmount: 90, rationale: 'Prescriptions and gym membership' },
      { category: 'Shopping', allocatedAmount: 200, rationale: 'Clothing & electronics allowance' },
      { category: 'Savings & Investments', allocatedAmount: 1300, rationale: 'Target 25% aggressive savings rate' },
      { category: 'Other', allocatedAmount: 100, rationale: 'Incidental buffer' }
    ],
    expenses: [
      { id: 'exp-sal-1', category: 'Housing', amount: 1650, date: '2026-09-01', description: 'Downtown Apartment Rent', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-sal-2', category: 'Utilities', amount: 120, date: '2026-09-03', description: 'City Power & Electric', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-sal-3', category: 'Utilities', amount: 75, date: '2026-09-04', description: 'Gigabit Fiber Internet', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-sal-4', category: 'Groceries', amount: 145, date: '2026-09-05', description: 'Trader Joe’s Weekly Restock', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-5', category: 'Food & Dining', amount: 92, date: '2026-09-06', description: 'Dinner with coworkers at Bistro', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-6', category: 'Transport', amount: 135, date: '2026-09-07', description: 'Monthly Transit Pass', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-sal-7', category: 'Food & Dining', amount: 140, date: '2026-09-10', description: 'Saturday Sushi & Drinks', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-8', category: 'Entertainment', amount: 160, date: '2026-09-12', description: 'Live Concert Tickets', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-9', category: 'Groceries', amount: 110, date: '2026-09-14', description: 'Organic Market Fresh Produce', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-10', category: 'Food & Dining', amount: 84, date: '2026-09-17', description: 'Weekend Brunch & Cocktails', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-11', category: 'Shopping', amount: 180, date: '2026-09-19', description: 'Fall Jacket & Casual Shoes', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-12', category: 'Entertainment', amount: 120, date: '2026-09-21', description: 'Golf simulator & evening outing', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-13', category: 'Food & Dining', amount: 135, date: '2026-09-24', description: 'Food delivery apps (UberEats x3)', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-14', category: 'Healthcare', amount: 85, date: '2026-09-25', description: 'Gym & Fitness studio monthly', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-sal-15', category: 'Transport', amount: 85, date: '2026-09-27', description: 'Weekend Uber rides', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-16', category: 'Food & Dining', amount: 115, date: '2026-09-28', description: 'Artisan coffee & bakery runs', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-sal-17', category: 'Entertainment', amount: 110, date: '2026-09-29', description: 'Cinema IMAX & Board game cafe', isRecurring: false, paymentMethod: 'Card' }
    ],
    savingsGoals: [
      {
        id: 'goal-sal-1',
        name: '3-Month Emergency Runway',
        targetAmount: 12000,
        currentAmount: 8200,
        targetDate: '2027-02-01',
        monthlyContribution: 650,
        iconName: 'ShieldCheck',
        category: 'emergency'
      },
      {
        id: 'goal-sal-2',
        name: 'Japan Autumn Trip',
        targetAmount: 3800,
        currentAmount: 1900,
        targetDate: '2027-04-15',
        monthlyContribution: 350,
        iconName: 'Plane',
        category: 'purchase'
      },
      {
        id: 'goal-sal-3',
        name: 'Index Fund Investment Portfolio',
        targetAmount: 25000,
        currentAmount: 14500,
        targetDate: '2027-12-31',
        monthlyContribution: 400,
        iconName: 'TrendingUp',
        category: 'milestone'
      }
    ]
  },

  student: {
    id: 'student',
    name: 'Maya Chen',
    role: 'Undergraduate College Student',
    tagline: 'Navigating college allowance, tight discretionary spending, and textbook bills',
    avatar: '🎓',
    currency: '$',
    monthlyIncome: 1050,
    description: 'Scenario 2: College student managing a limited monthly allowance, categorizing essential vs discretionary expenses, cutting snacking/subscription waste, and building early savings discipline.',
    sahilWelcomePrompt: "Hey Maya! Welcome! As a college student managing $1,050/month, every dollar counts. I've analyzed your essentials (shared housing & campus meals) and flagged that spontaneous cafe runs and snack delivery are eating into your textbook and tech savings. Let's set realistic spending limits that leave room for fun without going broke!",
    incomeSources: [
      {
        id: 'inc-stu-1',
        source: 'Parental Monthly Living Allowance',
        amount: 700,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-01',
        notes: 'Designated for rent share and grocery essentials'
      },
      {
        id: 'inc-stu-2',
        source: 'Campus Peer Tutoring (Calculus & Bio)',
        amount: 350,
        type: 'variable',
        frequency: 'monthly',
        dateReceived: '2026-09-15',
        notes: '10 hours/week student job'
      }
    ],
    budgetLimits: [
      { category: 'Housing', allocatedAmount: 480, rationale: 'Shared 3-room student apartment rent' },
      { category: 'Groceries', allocatedAmount: 180, rationale: 'Costco bulk staples, eggs, oats, pasta' },
      { category: 'Food & Dining', allocatedAmount: 90, rationale: 'Strict cap on campus coffee & takeout' },
      { category: 'Education', allocatedAmount: 70, rationale: 'Textbook rentals & lab materials' },
      { category: 'Transport', allocatedAmount: 35, rationale: 'Campus bike maintenance & bus reload' },
      { category: 'Entertainment', allocatedAmount: 60, rationale: 'Student movie nights & club events' },
      { category: 'Utilities', allocatedAmount: 45, rationale: 'Split Wi-Fi & heating bill' },
      { category: 'Shopping', allocatedAmount: 30, rationale: 'Stationery and essentials' },
      { category: 'Savings & Investments', allocatedAmount: 60, rationale: 'Student emergency cushion' }
    ],
    expenses: [
      { id: 'exp-stu-1', category: 'Housing', amount: 480, date: '2026-09-01', description: 'Student Room Rent (Shared)', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-stu-2', category: 'Utilities', amount: 40, date: '2026-09-02', description: 'Shared High-Speed Wi-Fi', isRecurring: true, paymentMethod: 'Digital Wallet' },
      { id: 'exp-stu-3', category: 'Groceries', amount: 62, date: '2026-09-04', description: 'Aldi Grocery haul for 2 weeks', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-4', category: 'Food & Dining', amount: 28, date: '2026-09-06', description: 'Late night pizza with study group', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-5', category: 'Education', amount: 65, date: '2026-09-08', description: 'Organic Chemistry e-Textbook rental', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-6', category: 'Food & Dining', amount: 34, date: '2026-09-11', description: 'Campus Starbucks drinks (x6 visits)', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-7', category: 'Groceries', amount: 55, date: '2026-09-14', description: 'Produce, bread, protein powder', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-8', category: 'Transport', amount: 25, date: '2026-09-16', description: 'Campus bike lock & tube fix', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-9', category: 'Entertainment', amount: 45, date: '2026-09-19', description: 'College football match ticket', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-10', category: 'Food & Dining', amount: 42, date: '2026-09-22', description: 'Food delivery app fee & noodles', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-11', category: 'Shopping', amount: 24, date: '2026-09-25', description: 'Highlighters, notebook, sticky notes', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-stu-12', category: 'Entertainment', amount: 35, date: '2026-09-27', description: 'Dorm movie night snacks share', isRecurring: false, paymentMethod: 'Cash' }
    ],
    savingsGoals: [
      {
        id: 'goal-stu-1',
        name: 'New Study Laptop (Refurb M2)',
        targetAmount: 900,
        currentAmount: 430,
        targetDate: '2027-01-15',
        monthlyContribution: 50,
        iconName: 'Laptop',
        category: 'purchase'
      },
      {
        id: 'goal-stu-2',
        name: 'Semester Buffer Fund',
        targetAmount: 500,
        currentAmount: 220,
        targetDate: '2026-12-20',
        monthlyContribution: 30,
        iconName: 'ShieldCheck',
        category: 'emergency'
      }
    ]
  },

  freelancer: {
    id: 'freelancer',
    name: 'Liam Vance',
    role: 'Independent Brand & Product Designer',
    tagline: 'Variable client revenue streams, quarterly taxes, lean month buffer management',
    avatar: '💻',
    currency: '$',
    monthlyIncome: 6200,
    description: 'Scenario 3: Freelancer with fluctuating client income logging retainers, project expenses, tax withholding buffers, and establishing a rolling 6-month safety net.',
    sahilWelcomePrompt: "Welcome Liam! As a freelancer, income volatility is your #1 financial risk. This month was strong at $6,200 across 3 clients, but we must protect your future self. I've automatically isolated a 25% Tax & Lean-Month Reserve ($1,550) so you never get caught off-guard. Here is your cashflow buffer breakdown!",
    incomeSources: [
      {
        id: 'inc-free-1',
        source: 'FinTech Startup UI Retainer',
        amount: 3200,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-02',
        notes: 'Monthly recurring design advisory retainer'
      },
      {
        id: 'inc-free-2',
        source: 'SaaS Design System Sprint Project',
        amount: 2200,
        type: 'variable',
        frequency: 'one-off',
        dateReceived: '2026-09-14',
        notes: 'Milestone 2 payout from Nova Labs'
      },
      {
        id: 'inc-free-3',
        source: 'E-commerce Brand Identity Package',
        amount: 800,
        type: 'variable',
        frequency: 'one-off',
        dateReceived: '2026-09-22',
        notes: 'Final 50% deposit on logo & guidelines'
      }
    ],
    budgetLimits: [
      { category: 'Housing', allocatedAmount: 1550, rationale: 'Home office hybrid studio rent' },
      { category: 'Freelance / Work', allocatedAmount: 320, rationale: 'Figma, Adobe CC, Loom, domain hosting' },
      { category: 'Healthcare', allocatedAmount: 340, rationale: 'Self-employed health & dental insurance' },
      { category: 'Groceries', allocatedAmount: 420, rationale: 'Weekly home meal cooking' },
      { category: 'Food & Dining', allocatedAmount: 300, rationale: 'Client coffee meetings & quick lunches' },
      { category: 'Utilities', allocatedAmount: 180, rationale: 'Gigabit connection & power' },
      { category: 'Transport', allocatedAmount: 160, rationale: 'Client site meetings & fuel' },
      { category: 'Entertainment', allocatedAmount: 180, rationale: 'Recreation & weekend unwind' },
      { category: 'Savings & Investments', allocatedAmount: 2200, rationale: 'Tax buffer (25%) + Emergency runway' }
    ],
    expenses: [
      { id: 'exp-free-1', category: 'Housing', amount: 1550, date: '2026-09-01', description: 'Studio Loft Live/Work Rent', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-free-2', category: 'Healthcare', amount: 340, date: '2026-09-03', description: 'Individual Health Insurance Premium', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-free-3', category: 'Freelance / Work', amount: 145, date: '2026-09-04', description: 'Adobe Creative Cloud + Figma Org seat', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-free-4', category: 'Freelance / Work', amount: 48, date: '2026-09-06', description: 'Vercel, GitHub & Notion workspace', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-free-5', category: 'Utilities', amount: 165, date: '2026-09-07', description: 'Electricity & High-speed fiber internet', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-free-6', category: 'Groceries', amount: 160, date: '2026-09-09', description: 'Weekly groceries & meal prep supplies', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-free-7', category: 'Food & Dining', amount: 75, date: '2026-09-12', description: 'Prospective Client Lunch at Osteria', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-free-8', category: 'Transport', amount: 80, date: '2026-09-15', description: 'Fuel & tolls for client on-site workshop', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-free-9', category: 'Groceries', amount: 145, date: '2026-09-18', description: 'Mid-month grocery replenishment', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-free-10', category: 'Freelance / Work', amount: 85, date: '2026-09-20', description: 'Shutterstock & Typeface commercial licensing', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-free-11', category: 'Food & Dining', amount: 125, date: '2026-09-23', description: 'Weekend dining & client wrap dinner', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-free-12', category: 'Entertainment', amount: 95, date: '2026-09-26', description: 'Design museum exhibit & film tickets', isRecurring: false, paymentMethod: 'Card' }
    ],
    savingsGoals: [
      {
        id: 'goal-free-1',
        name: '6-Month Lean Season Buffer',
        targetAmount: 18000,
        currentAmount: 11400,
        targetDate: '2027-03-31',
        monthlyContribution: 1000,
        iconName: 'ShieldAlert',
        category: 'emergency'
      },
      {
        id: 'goal-free-2',
        name: 'Estimated Quarterly Tax Reserve',
        targetAmount: 4800,
        currentAmount: 3600,
        targetDate: '2026-10-15',
        monthlyContribution: 800,
        iconName: 'Building',
        category: 'milestone'
      },
      {
        id: 'goal-free-3',
        name: '4K Color Reference Display & Ergonomics',
        targetAmount: 2200,
        currentAmount: 1400,
        targetDate: '2026-11-30',
        monthlyContribution: 300,
        iconName: 'Monitor',
        category: 'purchase'
      }
    ]
  },

  household: {
    id: 'household',
    name: 'The Sharma Family',
    role: 'Household Financial Managers (4 Members)',
    tagline: 'Dual income, children schooling, mortgage, healthcare & family wealth building',
    avatar: '🏡',
    currency: '$',
    monthlyIncome: 8600,
    description: 'Scenario 4: Household manager monitoring combined family income, groceries, utilities, childcare, healthcare, and consolidating multi-category monthly reports to meet long-term family goals.',
    sahilWelcomePrompt: "Hello Sharma Family! Managing a household of 4 requires clear transparency. Your combined monthly inflow is $8,600. Your mortgage and childcare are fixed anchors, but grocery and utility overruns last month totaled $340 above baseline. I have tailored a family budget plan and a consolidated monthly report to keep your children's 529 college fund and roof renovation on schedule!",
    incomeSources: [
      {
        id: 'inc-fam-1',
        source: 'Priya - Corporate Marketing Lead Salary',
        amount: 5400,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-01',
        notes: 'Take-home direct deposit after family health coverage'
      },
      {
        id: 'inc-fam-2',
        source: 'Raj - Senior Engineering Consultant',
        amount: 3200,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-05',
        notes: 'Net contract retainer'
      }
    ],
    budgetLimits: [
      { category: 'Housing', allocatedAmount: 2500, rationale: 'Home mortgage, HOA & property taxes' },
      { category: 'Groceries', allocatedAmount: 950, rationale: 'Family of 4 wholesale groceries & organic produce' },
      { category: 'Education', allocatedAmount: 750, rationale: 'After-school tutoring, soccer & music lessons' },
      { category: 'Transport', allocatedAmount: 580, rationale: 'Family SUV financing, insurance & gas' },
      { category: 'Utilities', allocatedAmount: 360, rationale: 'Power, municipal water, trash & family mobile plan' },
      { category: 'Healthcare', allocatedAmount: 320, rationale: 'Pediatric co-pays, dental & prescriptions' },
      { category: 'Food & Dining', allocatedAmount: 350, rationale: 'Bi-weekly family dining out & weekend pizza' },
      { category: 'Entertainment', allocatedAmount: 240, rationale: 'Streaming bundles, zoo pass, science museum' },
      { category: 'Shopping', allocatedAmount: 220, rationale: 'Kids clothing & household essentials' },
      { category: 'Savings & Investments', allocatedAmount: 2200, rationale: '529 College plan + emergency fund' }
    ],
    expenses: [
      { id: 'exp-fam-1', category: 'Housing', amount: 2500, date: '2026-09-01', description: 'Home Mortgage & Escrow', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-fam-2', category: 'Education', amount: 480, date: '2026-09-02', description: 'Kids Montessori & STEM Afterschool', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-fam-3', category: 'Utilities', amount: 210, date: '2026-09-03', description: 'Electric & Gas (Seasonal cooling)', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-fam-4', category: 'Groceries', amount: 380, date: '2026-09-05', description: 'Costco Wholesale family bulk trip', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-5', category: 'Transport', amount: 390, date: '2026-09-07', description: 'Family Car Auto Loan payment', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-fam-6', category: 'Education', amount: 240, date: '2026-09-09', description: 'Soccer league gear & swimming lessons', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-7', category: 'Healthcare', amount: 165, date: '2026-09-12', description: 'Pediatric checkups & asthma medication', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-8', category: 'Groceries', amount: 285, date: '2026-09-14', description: 'Weekly fresh dairy, fruit & bakery', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-9', category: 'Utilities', amount: 145, date: '2026-09-16', description: 'Municipal Water & Trash collection', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-fam-10', category: 'Food & Dining', amount: 185, date: '2026-09-18', description: 'Family Sunday Dinner at Italian Trattoria', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-11', category: 'Transport', amount: 180, date: '2026-09-20', description: 'Family Auto Insurance monthly', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-fam-12', category: 'Groceries', amount: 310, date: '2026-09-22', description: 'Mid-month specialty market & pantry staples', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-13', category: 'Shopping', amount: 195, date: '2026-09-24', description: 'Back-to-school shoes and winter coats', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-14', category: 'Entertainment', amount: 135, date: '2026-09-26', description: 'Family Science Center annual pass renewal', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-15', category: 'Food & Dining', amount: 120, date: '2026-09-28', description: 'Friday family pizza & ice cream night', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-fam-16', category: 'Healthcare', amount: 95, date: '2026-09-29', description: 'Dental cleaning copay for kids', isRecurring: false, paymentMethod: 'Card' }
    ],
    savingsGoals: [
      {
        id: 'goal-fam-1',
        name: 'Children 529 College Growth Fund',
        targetAmount: 60000,
        currentAmount: 28500,
        targetDate: '2031-08-01',
        monthlyContribution: 800,
        iconName: 'GraduationCap',
        category: 'education'
      },
      {
        id: 'goal-fam-2',
        name: 'Family Rainy Day Safety Reserve',
        targetAmount: 25000,
        currentAmount: 18200,
        targetDate: '2027-06-30',
        monthlyContribution: 600,
        iconName: 'ShieldCheck',
        category: 'emergency'
      },
      {
        id: 'goal-fam-3',
        name: 'Energy Efficient Solar & Roof Upgrade',
        targetAmount: 12000,
        currentAmount: 6800,
        targetDate: '2027-04-15',
        monthlyContribution: 450,
        iconName: 'Sun',
        category: 'family'
      }
    ]
  },

  custom: {
    id: 'custom',
    name: 'My Personal Finances',
    role: 'Custom Budget Profile',
    tagline: 'Customized financial plan managed with Sahil',
    avatar: '✨',
    currency: '$',
    monthlyIncome: 4500,
    description: 'Personalized scenario customized for your exact income streams, expenses, and savings targets.',
    sahilWelcomePrompt: "Hi there! I am Sahil, your personal AI finance advisor. I'm ready to help you analyze your income, track every dollar, optimize category budgets, and craft a plan to grow your savings. Let's look at your numbers together!",
    incomeSources: [
      {
        id: 'inc-cust-1',
        source: 'Primary Monthly Income',
        amount: 4500,
        type: 'fixed',
        frequency: 'monthly',
        dateReceived: '2026-09-01',
        notes: 'Net income'
      }
    ],
    budgetLimits: [
      { category: 'Housing', allocatedAmount: 1400, rationale: 'Housing target' },
      { category: 'Food & Dining', allocatedAmount: 400, rationale: 'Dining cap' },
      { category: 'Groceries', allocatedAmount: 350, rationale: 'Groceries' },
      { category: 'Transport', allocatedAmount: 250, rationale: 'Commute' },
      { category: 'Utilities', allocatedAmount: 180, rationale: 'Bills' },
      { category: 'Entertainment', allocatedAmount: 150, rationale: 'Fun' },
      { category: 'Healthcare', allocatedAmount: 100, rationale: 'Wellness' },
      { category: 'Shopping', allocatedAmount: 150, rationale: 'Personal' },
      { category: 'Savings & Investments', allocatedAmount: 1200, rationale: 'Wealth target' }
    ],
    expenses: [
      { id: 'exp-cust-1', category: 'Housing', amount: 1400, date: '2026-09-01', description: 'Apartment rent', isRecurring: true, paymentMethod: 'Bank Transfer' },
      { id: 'exp-cust-2', category: 'Groceries', amount: 180, date: '2026-09-05', description: 'Weekly groceries', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-cust-3', category: 'Food & Dining', amount: 65, date: '2026-09-08', description: 'Weekend dinner', isRecurring: false, paymentMethod: 'Card' },
      { id: 'exp-cust-4', category: 'Utilities', amount: 140, date: '2026-09-12', description: 'Electricity & internet', isRecurring: true, paymentMethod: 'Card' },
      { id: 'exp-cust-5', category: 'Transport', amount: 95, date: '2026-09-15', description: 'Gasoline & parking', isRecurring: false, paymentMethod: 'Card' }
    ],
    savingsGoals: [
      {
        id: 'goal-cust-1',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 4500,
        targetDate: '2027-03-31',
        monthlyContribution: 500,
        iconName: 'ShieldCheck',
        category: 'emergency'
      }
    ]
  }
};
