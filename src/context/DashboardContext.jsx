import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  generateMockTransactions,
  INCOME_CATEGORIES,
} from '../data/mockData';
import { buildSmartObservation } from '../utils/insights';

const DashboardContext = createContext(null);

const initialState = {
  transactions: [],
  role: 'admin',
  darkMode: false,
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
  },
};

const storageKeys = {
  transactions: 'finance-dashboard-transactions-v2',
  role: 'finance-dashboard-role-v1',
  darkMode: 'finance-dashboard-dark-v1',
};

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return {
        ...state,
        ...action.payload,
      };
    case 'setRole':
      return { ...state, role: action.payload };
    case 'setDarkMode':
      return { ...state, darkMode: action.payload };
    case 'setFilters':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case 'addTransaction':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'updateTransaction':
      return {
        ...state,
        transactions: state.transactions.map((txn) =>
          txn.id === action.payload.id ? action.payload : txn,
        ),
      };
    case 'deleteTransaction':
      return {
        ...state,
        transactions: state.transactions.filter((txn) => txn.id !== action.payload),
      };
    default:
      return state;
  }
}

function monthlyBuckets(transactions) {
  const now = new Date();
  const map = {};

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    map[key] = { month: key, income: 0, expenses: 0, balance: 0 };
  }

  transactions.forEach((txn) => {
    const txnDate = new Date(txn.date);
    const key = txnDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!map[key]) return;

    if (txn.type === 'income') {
      map[key].income += txn.amount;
    } else {
      map[key].expenses += Math.abs(txn.amount);
    }
  });

  return Object.values(map).map((entry) => ({
    ...entry,
    balance: entry.income - entry.expenses,
  }));
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedTransactions = localStorage.getItem(storageKeys.transactions);
    const savedRole = localStorage.getItem(storageKeys.role);
    const savedDarkMode = localStorage.getItem(storageKeys.darkMode);

    dispatch({
      type: 'hydrate',
      payload: {
        transactions: savedTransactions ? JSON.parse(savedTransactions) : generateMockTransactions(),
        role: savedRole || 'admin',
        darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false,
      },
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKeys.transactions, JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem(storageKeys.role, state.role);
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem(storageKeys.darkMode, JSON.stringify(state.darkMode));
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const derived = useMemo(() => {
    const income = state.transactions
      .filter((txn) => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const expenses = state.transactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

    const balance = income - expenses;

    const filteredTransactions = state.transactions
      .filter((txn) => {
        const searchText = state.filters.search.trim().toLowerCase();
        const matchesSearch =
          !searchText ||
          txn.description.toLowerCase().includes(searchText) ||
          txn.category.toLowerCase().includes(searchText);

        const matchesType = state.filters.type === 'all' || txn.type === state.filters.type;
        const matchesCategory =
          state.filters.category === 'all' || txn.category === state.filters.category;

        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        if (state.filters.sortBy === 'amount') {
          return Math.abs(b.amount) - Math.abs(a.amount);
        }
        return new Date(b.date) - new Date(a.date);
      });

    const categoryMap = {};
    state.transactions
      .filter((txn) => txn.type === 'expense')
      .forEach((txn) => {
        categoryMap[txn.category] = (categoryMap[txn.category] || 0) + Math.abs(txn.amount);
      });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const trend = monthlyBuckets(state.transactions);

    const currentMonth = trend[trend.length - 1] || { expenses: 0 };
    const previousMonth = trend[trend.length - 2] || { expenses: 0 };
    const monthlyChange = previousMonth.expenses
      ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
      : 0;

    const highestCategory = categoryBreakdown[0] || null;

    return {
      summary: { income, expenses, balance },
      filteredTransactions,
      categoryBreakdown,
      trend,
      insights: {
        highestCategory,
        monthlyChange,
        smartObservation: buildSmartObservation({
          highestCategory,
          monthlyChange,
        }),
      },
      categories: {
        all: ALL_CATEGORIES,
        expense: EXPENSE_CATEGORIES,
        income: INCOME_CATEGORIES,
      },
    };
  }, [state.transactions, state.filters]);

  const actions = useMemo(
    () => ({
      setRole: (role) => dispatch({ type: 'setRole', payload: role }),
      setDarkMode: (enabled) => dispatch({ type: 'setDarkMode', payload: enabled }),
      setFilters: (payload) => dispatch({ type: 'setFilters', payload }),
      addTransaction: (payload) => dispatch({ type: 'addTransaction', payload }),
      updateTransaction: (payload) => dispatch({ type: 'updateTransaction', payload }),
      deleteTransaction: (id) => dispatch({ type: 'deleteTransaction', payload: id }),
    }),
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      ...derived,
      ...actions,
    }),
    [state, derived, actions],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
