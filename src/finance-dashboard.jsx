import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart as PieIcon, Download, Search, Filter, Plus, Edit2, Eye, Shield, Moon, Sun, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock transaction data generator
const generateMockData = () => {
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Salary', 'Freelance', 'Investment'];
  const descriptions = {
    'Food & Dining': ['Whole Foods', 'Starbucks', 'Local Restaurant', 'DoorDash', 'Chipotle'],
    'Transportation': ['Uber', 'Gas Station', 'Car Insurance', 'Parking', 'Metro Card'],
    'Shopping': ['Amazon', 'Target', 'Best Buy', 'Clothing Store', 'Online Shop'],
    'Entertainment': ['Netflix', 'Spotify', 'Movie Theater', 'Concert Tickets', 'Gaming'],
    'Bills & Utilities': ['Electricity', 'Internet', 'Water', 'Phone Bill', 'Rent'],
    'Healthcare': ['Pharmacy', 'Doctor Visit', 'Health Insurance', 'Gym Membership'],
    'Salary': ['Monthly Salary', 'Bonus', 'Commission'],
    'Freelance': ['Project Payment', 'Consulting Fee', 'Design Work'],
    'Investment': ['Stock Dividend', 'Interest', 'Rental Income']
  };

  const transactions = [];
  const today = new Date();
  
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isIncome = ['Salary', 'Freelance', 'Investment'].includes(category);
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const amount = isIncome 
      ? Math.floor(Math.random() * 4000) + 1000
      : Math.floor(Math.random() * 300) + 10;
    
    transactions.push({
      id: `txn-${i + 1}`,
      date: date.toISOString().split('T')[0],
      description: descriptions[category][Math.floor(Math.random() * descriptions[category].length)],
      category,
      amount: isIncome ? amount : -amount,
      type: isIncome ? 'income' : 'expense',
      status: Math.random() > 0.1 ? 'completed' : 'pending'
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const FinanceDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState('admin'); // 'admin' or 'viewer'
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('financeTransactions');
    return saved ? JSON.parse(saved) : generateMockData();
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Persist transactions to localStorage
  useEffect(() => {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Persist dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('financeDarkMode');
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('financeDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Calculate summary metrics
  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = income - expenses;
    
    return { income, expenses, balance };
  }, [transactions]);

  // Prepare balance trend data (last 6 months)
  const balanceTrend = useMemo(() => {
    const monthlyData = {};
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { month: monthKey, balance: 0, income: 0, expenses: 0 };
    }
    
    let runningBalance = 0;
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (monthlyData[monthKey]) {
        if (t.type === 'income') {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].expenses += Math.abs(t.amount);
        }
      }
    });
    
    return Object.values(monthlyData).map(m => ({
      ...m,
      balance: m.income - m.expenses
    }));
  }, [transactions]);

  // Category breakdown for pie chart
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const category = t.category;
      breakdown[category] = (breakdown[category] || 0) + Math.abs(t.amount);
    });
    
    return Object.entries(breakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Insights calculation
  const insights = useMemo(() => {
    const categoryTotals = {};
    const monthlyTotals = {};
    
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      }
      
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'long' });
      if (!monthlyTotals[month]) monthlyTotals[month] = { income: 0, expenses: 0 };
      
      if (t.type === 'income') {
        monthlyTotals[month].income += t.amount;
      } else {
        monthlyTotals[month].expenses += Math.abs(t.amount);
      }
    });
    
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    const avgExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0) / Object.keys(categoryTotals).length;
    
    const months = Object.keys(monthlyTotals);
    const currentMonth = months[0];
    const previousMonth = months[1];
    
    const monthlyChange = previousMonth ? 
      ((monthlyTotals[currentMonth]?.expenses || 0) - (monthlyTotals[previousMonth]?.expenses || 0)) / (monthlyTotals[previousMonth]?.expenses || 1) * 100 : 0;
    
    return {
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      avgExpense,
      monthlyChange,
      savingsRate: summary.income > 0 ? ((summary.income - summary.expenses) / summary.income * 100) : 0
    };
  }, [transactions, summary]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, sortBy]);

  // Add new transaction
  const addTransaction = (newTxn) => {
    setTransactions([newTxn, ...transactions]);
    setShowAddModal(false);
  };

  // Edit transaction
  const updateTransaction = (updatedTxn) => {
    setTransactions(transactions.map(t => t.id === updatedTxn.id ? updatedTxn : t));
    setEditingTransaction(null);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.amount,
      t.type,
      t.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const theme = darkMode ? {
    bg: 'bg-slate-900',
    cardBg: 'bg-slate-800',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    border: 'border-slate-700',
    hover: 'hover:bg-slate-700',
    input: 'bg-slate-700 text-slate-100 border-slate-600',
  } : {
    bg: 'bg-slate-50',
    cardBg: 'bg-white',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-50',
    input: 'bg-white text-slate-900 border-slate-300',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${theme.cardBg} border-b ${theme.border} sticky top-0 z-50 backdrop-blur-lg bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  FinanceTrack
                </h1>
                <p className={`text-xs ${theme.textMuted}`}>Personal Finance Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Role Switcher */}
              <div className="flex items-center space-x-2">
                <Shield className={`w-4 h-4 ${theme.textMuted}`} />
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${theme.hover} transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Indicator Banner */}
        <div className={`mb-6 p-4 rounded-lg ${userRole === 'admin' ? 'bg-emerald-500 bg-opacity-10 border border-emerald-500' : 'bg-blue-500 bg-opacity-10 border border-blue-500'}`}>
          <div className="flex items-center space-x-2">
            {userRole === 'admin' ? <Shield className="w-5 h-5 text-emerald-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
            <span className="font-medium">
              {userRole === 'admin' ? 'Admin Mode: You can add and edit transactions' : 'Viewer Mode: Read-only access'}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm ${theme.textMuted}`}>Total Balance</p>
                  <h3 className="text-3xl font-bold">${summary.balance.toLocaleString()}</h3>
                </div>
              </div>
              {summary.balance >= 0 ? (
                <ArrowUpRight className="w-8 h-8 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-8 h-8 text-red-500" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              {summary.balance >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${summary.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {insights.savingsRate.toFixed(1)}% savings rate
              </span>
            </div>
          </div>

          <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm ${theme.textMuted}`}>Total Income</p>
                  <h3 className="text-3xl font-bold text-blue-600">${summary.income.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <p className={`text-sm ${theme.textMuted}`}>
              {transactions.filter(t => t.type === 'income').length} income transactions
            </p>
          </div>

          <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm ${theme.textMuted}`}>Total Expenses</p>
                  <h3 className="text-3xl font-bold text-orange-600">${summary.expenses.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <p className={`text-sm ${theme.textMuted}`}>
              {transactions.filter(t => t.type === 'expense').length} expense transactions
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Trend Chart */}
          <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg`}>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Balance Trend (6 Months)</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={balanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="month" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg`}>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-blue-600" />
              <span>Spending by Category</span>
            </h3>
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-400">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Insights Section */}
        <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg mb-8`}>
          <h3 className="text-xl font-bold mb-4">📊 Financial Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 bg-opacity-10 rounded-lg border border-purple-300">
              <p className="text-sm text-purple-600 font-medium mb-1">Top Spending Category</p>
              <p className="text-2xl font-bold">{insights.topCategory?.name || 'N/A'}</p>
              <p className={`text-sm ${theme.textMuted} mt-1`}>
                ${insights.topCategory?.amount.toLocaleString() || 0} spent
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 bg-opacity-10 rounded-lg border border-blue-300">
              <p className="text-sm text-blue-600 font-medium mb-1">Monthly Comparison</p>
              <p className="text-2xl font-bold flex items-center space-x-2">
                {insights.monthlyChange >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-red-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-emerald-500" />
                )}
                <span>{Math.abs(insights.monthlyChange).toFixed(1)}%</span>
              </p>
              <p className={`text-sm ${theme.textMuted} mt-1`}>
                {insights.monthlyChange >= 0 ? 'increase' : 'decrease'} vs last month
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 bg-opacity-10 rounded-lg border border-emerald-300">
              <p className="text-sm text-emerald-600 font-medium mb-1">Average Category Spending</p>
              <p className="text-2xl font-bold">${insights.avgExpense.toLocaleString()}</p>
              <p className={`text-sm ${theme.textMuted} mt-1`}>across all categories</p>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} shadow-lg`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm w-64`}
                />
              </div>
              
              {/* Filter by Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              
              {/* Filter by Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(transactions.map(t => t.category))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="category">Sort by Category</option>
              </select>
              
              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center space-x-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export CSV</span>
              </button>
              
              {/* Add Transaction Button (Admin only) */}
              {userRole === 'admin' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center space-x-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Transaction</span>
                </button>
              )}
            </div>
          </div>

          {/* Transactions Table */}
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme.border}`}>
                    <th className={`text-left py-3 px-4 ${theme.textMuted} font-medium text-sm`}>Date</th>
                    <th className={`text-left py-3 px-4 ${theme.textMuted} font-medium text-sm`}>Description</th>
                    <th className={`text-left py-3 px-4 ${theme.textMuted} font-medium text-sm`}>Category</th>
                    <th className={`text-right py-3 px-4 ${theme.textMuted} font-medium text-sm`}>Amount</th>
                    <th className={`text-center py-3 px-4 ${theme.textMuted} font-medium text-sm`}>Status</th>
                    {userRole === 'admin' && (
                      <th className={`text-center py-3 px-4 ${theme.textMuted} font-medium text-sm`}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id} 
                      className={`border-b ${theme.border} ${theme.hover} transition-colors`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-3 px-4 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                          <span className="text-sm font-medium">{transaction.description}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${theme.textMuted} bg-opacity-20`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {transaction.status}
                        </span>
                      </td>
                      {userRole === 'admin' && (
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setEditingTransaction(transaction)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className={`text-lg ${theme.textMuted}`}>No transactions found</p>
              <p className={`text-sm ${theme.textMuted} mt-2`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <TransactionModal
            onClose={() => setShowAddModal(false)}
            onSave={addTransaction}
            theme={theme}
          />
        )}

        {/* Edit Transaction Modal */}
        {editingTransaction && (
          <TransactionModal
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onSave={updateTransaction}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
};

// Transaction Modal Component
const TransactionModal = ({ transaction, onClose, onSave, theme }) => {
  const [formData, setFormData] = useState(transaction || {
    id: `txn-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food & Dining',
    amount: 0,
    type: 'expense',
    status: 'completed'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount))
    };
    onSave(processedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.cardBg} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
        <h3 className="text-2xl font-bold mb-6">
          {transaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <option>Food & Dining</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Bills & Utilities</option>
              <option>Healthcare</option>
              <option>Salary</option>
              <option>Freelance</option>
              <option>Investment</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Amount</label>
            <input
              type="number"
              value={Math.abs(formData.amount)}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg ${theme.input} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg border ${theme.border} ${theme.hover} transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceDashboard;
