import { useEffect, useState } from 'react';
import { Download, Lock, Plus, Search, X } from 'lucide-react';
import {
  useDashboardActions,
  useDashboardFiltersState,
  useDashboardTransactionsState,
  useDashboardUIState,
} from '../../context/DashboardContext';
import { buildCsv } from '../../utils/exporters';

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function TransactionsToolbar({ onAdd, onRestrictedAction }) {
  const { filters, categories, hasActiveFilters } = useDashboardFiltersState();
  const { filteredTransactions } = useDashboardTransactionsState();
  const { role } = useDashboardUIState();
  const { setFilters } = useDashboardActions();
  const [exportNotice, setExportNotice] = useState('');

  useEffect(() => {
    if (!exportNotice) return undefined;
    const timeoutId = window.setTimeout(() => setExportNotice(''), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [exportNotice]);

  const setDatePreset = (preset) => {
    setFilters({
      datePreset: preset,
      ...(preset !== 'all' ? { startDate: '', endDate: '' } : {}),
    });
  };

  const updateDateField = (field, value) => {
    setFilters({
      [field]: value,
      datePreset: 'custom',
    });
  };

  const exportCsv = () => {
    if (!filteredTransactions.length) {
      setExportNotice('No matching transactions to export.');
      return;
    }
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
    const rows = filteredTransactions.map((txn) => [
      txn.date,
      txn.description,
      txn.category,
      txn.type,
      txn.amount,
      txn.status,
    ]);
    const content = buildCsv(headers, rows, { includeBom: true });
    downloadFile(content, `transactions-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    setExportNotice('CSV export started.');
  };

  const exportJson = () => {
    if (!filteredTransactions.length) {
      setExportNotice('No matching transactions to export.');
      return;
    }
    downloadFile(
      JSON.stringify(filteredTransactions, null, 2),
      `transactions-${Date.now()}.json`,
      'application/json',
    );
    setExportNotice('JSON export started.');
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      sortBy: 'date',
      sortDirection: 'desc',
      datePreset: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const sortDirectionLabel = filters.sortBy === 'amount' ? 'Sort amount' : 'Sort date';

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search description/category"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <select
          value={filters.type}
          onChange={(event) => setFilters({ type: event.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) => setFilters({ category: event.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All categories</option>
          {categories.all.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) => setFilters({ sortBy: event.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="date">Sort by date</option>
          <option value="amount">Sort by amount</option>
        </select>

        <select
          value={filters.sortDirection || 'desc'}
          onChange={(event) => setFilters({ sortDirection: event.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
          aria-label={sortDirectionLabel}
        >
          {filters.sortBy === 'amount' ? (
            <>
              <option value="desc">Highest first</option>
              <option value="asc">Lowest first</option>
            </>
          ) : (
            <>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </>
          )}
        </select>

        <select
          value={filters.datePreset || 'all'}
          onChange={(event) => setDatePreset(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="ytd">Year to date</option>
          <option value="custom">Custom range</option>
        </select>

        <input
          type="date"
          value={filters.startDate || ''}
          onChange={(event) => updateDateField('startDate', event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
          aria-label="Start date"
        />

        <input
          type="date"
          value={filters.endDate || ''}
          onChange={(event) => updateDateField('endDate', event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring dark:border-slate-700 dark:bg-slate-900"
          aria-label="End date"
        />
        </div>

        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" /> CSV
        </button>
        <button
          type="button"
          onClick={exportJson}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" /> JSON
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
          >
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}

        {role === 'admin' ? (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
        ) : (
          <button
            type="button"
            onClick={onRestrictedAction}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Lock className="h-4 w-4" /> Add Transaction (Admin only)
          </button>
        )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
        Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredTransactions.length}</span> matching transactions
      </div>

      {exportNotice && (
        <div
          role="status"
          aria-live="polite"
          className="animate-toast-in fixed bottom-4 right-4 z-50 max-w-xs rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg dark:border-emerald-700/70 dark:bg-emerald-950/85 dark:text-emerald-200"
        >
          {exportNotice}
        </div>
      )}
    </div>
  );
}

export default TransactionsToolbar;
