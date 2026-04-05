const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
];

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment'];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const descriptions = {
  'Food & Dining': ['Whole Foods', 'Starbucks', 'Local Restaurant', 'DoorDash', 'Chipotle'],
  Transportation: ['Uber', 'Gas Station', 'Car Insurance', 'Parking', 'Metro Card'],
  Shopping: ['Amazon', 'Target', 'Best Buy', 'Clothing Store', 'Online Shop'],
  Entertainment: ['Netflix', 'Spotify', 'Movie Theater', 'Concert Tickets', 'Gaming'],
  'Bills & Utilities': ['Electricity', 'Internet', 'Water', 'Phone Bill', 'Rent'],
  Healthcare: ['Pharmacy', 'Doctor Visit', 'Health Insurance', 'Gym Membership'],
  Salary: ['Monthly Salary', 'Bonus', 'Commission'],
  Freelance: ['Project Payment', 'Consulting Fee', 'Design Work'],
  Investment: ['Stock Dividend', 'Interest', 'Rental Income'],
};

export const CATEGORY_COLORS = [
  '#0ea5e9',
  '#f97316',
  '#22c55e',
  '#eab308',
  '#14b8a6',
  '#a855f7',
  '#ef4444',
  '#64748b',
  '#06b6d4',
];

export { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES };

export function generateMockTransactions(count = 36) {
  const txns = [];
  const now = new Date();

  for (let i = 0; i < count; i += 1) {
    const category = ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
    const isIncome = INCOME_CATEGORIES.includes(category);
    const date = new Date(now);
    date.setDate(now.getDate() - Math.floor(Math.random() * 140));

    const amount = isIncome
      ? Math.floor(Math.random() * 3200) + 900
      : Math.floor(Math.random() * 420) + 15;

    txns.push({
      id: `txn-${Date.now()}-${i}`,
      date: date.toISOString().slice(0, 10),
      description: descriptions[category][Math.floor(Math.random() * descriptions[category].length)],
      category,
      type: isIncome ? 'income' : 'expense',
      amount: isIncome ? amount : -amount,
      status: Math.random() > 0.1 ? 'completed' : 'pending',
    });
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
}
