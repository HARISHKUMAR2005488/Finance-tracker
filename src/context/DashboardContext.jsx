import { createContext, useContext, useDeferredValue, useEffect, useMemo, useReducer } from 'react';
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  generateMockTransactions,
  INCOME_CATEGORIES,
} from '../data/mockData';
import {
  buildSmartObservation,
  getHighestSpendingCategory,
  getMonthlySpendingChange,
} from '../utils/insights';

const DashboardUIStateContext = createContext(null);
const DashboardFiltersStateContext = createContext(null);
const DashboardTransactionsStateContext = createContext(null);
const DashboardAnalyticsStateContext = createContext(null);
const DashboardActionsContext = createContext(null);

const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date',
  sortDirection: 'desc',
  datePreset: 'all',
  startDate: '',
  endDate: '',
};

const initialState = {
  transactions: [],
  role: 'admin',
  darkMode: false,
  filters: DEFAULT_FILTERS,
};

const storageKeys = {
  transactions: 'finance-dashboard-transactions-v2',
  role: 'finance-dashboard-role-v1',
  darkMode: 'finance-dashboard-dark-v1',
};

function readJsonStorage(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readStringStorage(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore persistence failures in restricted/private browsing environments.
  }
}

function getInitialDarkMode() {
  const savedDarkMode = readJsonStorage(storageKeys.darkMode, null);
  if (typeof savedDarkMode === 'boolean') {
    return savedDarkMode;
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
}

function getInitialDashboardState() {
  const savedTransactions = readJsonStorage(storageKeys.transactions, null);
  const savedRole = readStringStorage(storageKeys.role, 'admin');

  return {
    ...initialState,
    transactions: Array.isArray(savedTransactions) ? savedTransactions : generateMockTransactions(),
    role: savedRole === 'viewer' ? 'viewer' : 'admin',
    darkMode: getInitialDarkMode(),
  };
}

export function reducer(state, action) {
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
    case 'resetFilters':
      return {
        ...state,
        filters: DEFAULT_FILTERS,
      };
    case 'addTransaction':
      if (state.role !== 'admin') return state;
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'updateTransaction':
      if (state.role !== 'admin') return state;
      return {
        ...state,
        transactions: state.transactions.map((txn) =>
          txn.id === action.payload.id ? action.payload : txn,
        ),
      };
    case 'deleteTransaction':
      if (state.role !== 'admin') return state;
      return {
        ...state,
        transactions: state.transactions.filter((txn) => txn.id !== action.payload),
      };
    default:
      return state;
  }
}

function isWithinDateRange(txnDate, filters) {
  const date = new Date(txnDate);
  date.setHours(0, 0, 0, 0);

  if (filters.datePreset !== 'all') {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, ytd: 365 };
    const rangeDays = daysMap[filters.datePreset];

    if (filters.datePreset === 'ytd') {
      const ytdStart = new Date(now.getFullYear(), 0, 1);
      return date >= ytdStart && date <= now;
    }

    if (rangeDays) {
      const start = new Date(now);
      start.setDate(now.getDate() - (rangeDays - 1));
      return date >= start && date <= now;
    }
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    start.setHours(0, 0, 0, 0);
    if (date < start) return false;
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(0, 0, 0, 0);
    if (date > end) return false;
  }

  return true;
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
  const [state, dispatch] = useReducer(reducer, undefined, getInitialDashboardState);
  const deferredSearch = useDeferredValue(state.filters.search);

  useEffect(() => {
    writeStorage(storageKeys.transactions, JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    writeStorage(storageKeys.role, state.role);
  }, [state.role]);

  useEffect(() => {
    writeStorage(storageKeys.darkMode, JSON.stringify(state.darkMode));
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
    const incomeCount = state.transactions.filter((txn) => txn.type === 'income').length;
    const expenseCount = state.transactions.filter((txn) => txn.type === 'expense').length;

    const filteredTransactions = state.transactions
      .filter((txn) => {
        const searchText = deferredSearch.trim().toLowerCase();
        const matchesSearch =
          !searchText ||
          txn.description.toLowerCase().includes(searchText) ||
          txn.category.toLowerCase().includes(searchText);

        const matchesType = state.filters.type === 'all' || txn.type === state.filters.type;
        const matchesCategory =
          state.filters.category === 'all' || txn.category === state.filters.category;
        const matchesDateRange = isWithinDateRange(txn.date, state.filters);

        return matchesSearch && matchesType && matchesCategory && matchesDateRange;
      })
      .sort((a, b) => {
        const direction = state.filters.sortDirection === 'asc' ? 1 : -1;

        if (state.filters.sortBy === 'amount') {
          return (Math.abs(a.amount) - Math.abs(b.amount)) * direction;
        }

        return (new Date(a.date) - new Date(b.date)) * direction;
      });

    const hasActiveFilters =
      Boolean(state.filters.search.trim()) ||
      state.filters.type !== 'all' ||
      state.filters.category !== 'all' ||
      state.filters.sortBy !== 'date' ||
      state.filters.sortDirection !== 'desc' ||
      state.filters.datePreset !== 'all' ||
      Boolean(state.filters.startDate) ||
      Boolean(state.filters.endDate);

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

    const monthlyChange = getMonthlySpendingChange(trend);
    const highestCategory = getHighestSpendingCategory(categoryBreakdown);

    return {
      summary: { income, expenses, balance, incomeCount, expenseCount },
      filteredTransactions,
      hasActiveFilters,
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
  }, [state.transactions, state.filters, deferredSearch]);

  const actions = useMemo(
    () => ({
      setRole: (role) => dispatch({ type: 'setRole', payload: role }),
      setDarkMode: (enabled) => dispatch({ type: 'setDarkMode', payload: enabled }),
      setFilters: (payload) => dispatch({ type: 'setFilters', payload }),
      resetFilters: () => dispatch({ type: 'resetFilters' }),
      addTransaction: (payload) => dispatch({ type: 'addTransaction', payload }),
      updateTransaction: (payload) => dispatch({ type: 'updateTransaction', payload }),
      deleteTransaction: (id) => dispatch({ type: 'deleteTransaction', payload: id }),
    }),
    [],
  );

  const uiState = useMemo(
    () => ({
      role: state.role,
      darkMode: state.darkMode,
    }),
    [state.role, state.darkMode],
  );

  const filtersState = useMemo(
    () => ({
      filters: state.filters,
      hasActiveFilters: derived.hasActiveFilters,
      categories: derived.categories,
    }),
    [state.filters, derived.hasActiveFilters, derived.categories],
  );

  const transactionsState = useMemo(
    () => ({
      transactions: state.transactions,
      filteredTransactions: derived.filteredTransactions,
    }),
    [state.transactions, derived.filteredTransactions],
  );

  const analyticsState = useMemo(
    () => ({
      summary: derived.summary,
      categoryBreakdown: derived.categoryBreakdown,
      trend: derived.trend,
      insights: derived.insights,
    }),
    [derived.summary, derived.categoryBreakdown, derived.trend, derived.insights],
  );

  return (
    <DashboardActionsContext.Provider value={actions}>
      <DashboardUIStateContext.Provider value={uiState}>
        <DashboardFiltersStateContext.Provider value={filtersState}>
          <DashboardTransactionsStateContext.Provider value={transactionsState}>
            <DashboardAnalyticsStateContext.Provider value={analyticsState}>
              {children}
            </DashboardAnalyticsStateContext.Provider>
          </DashboardTransactionsStateContext.Provider>
        </DashboardFiltersStateContext.Provider>
      </DashboardUIStateContext.Provider>
    </DashboardActionsContext.Provider>
  );
}

export function useDashboardUIState() {
  const context = useContext(DashboardUIStateContext);
  if (!context) {
    throw new Error('useDashboardUIState must be used within DashboardProvider');
  }
  return context;
}

export function useDashboardFiltersState() {
  const context = useContext(DashboardFiltersStateContext);
  if (!context) {
    throw new Error('useDashboardFiltersState must be used within DashboardProvider');
  }
  return context;
}

export function useDashboardTransactionsState() {
  const context = useContext(DashboardTransactionsStateContext);
  if (!context) {
    throw new Error('useDashboardTransactionsState must be used within DashboardProvider');
  }
  return context;
}

export function useDashboardAnalyticsState() {
  const context = useContext(DashboardAnalyticsStateContext);
  if (!context) {
    throw new Error('useDashboardAnalyticsState must be used within DashboardProvider');
  }
  return context;
}

export function useDashboardState() {
  return {
    ...useDashboardUIState(),
    ...useDashboardFiltersState(),
    ...useDashboardTransactionsState(),
    ...useDashboardAnalyticsState(),
  };
}

export function useDashboardActions() {
  const context = useContext(DashboardActionsContext);
  if (!context) {
    throw new Error('useDashboardActions must be used within DashboardProvider');
  }
  return context;
}

export function useDashboard() {
  const state = useDashboardState();
  const actions = useDashboardActions();

  return useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions],
  );
}
