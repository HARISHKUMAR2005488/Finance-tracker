import { Download, Plus, Search } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function TransactionsToolbar({ onAdd }) {
  const { filters, setFilters, role, filteredTransactions, categories } = useDashboard();

  const exportCsv = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
    const rows = filteredTransactions.map((txn) => [
      txn.date,
      txn.description,
      txn.category,
      txn.type,
      txn.amount,
      txn.status,
    ]);
    const content = [headers, ...rows].map((row) => row.join(',')).join('\n');
    downloadFile(content, `transactions-${Date.now()}.csv`, 'text/csv');
  };

  const exportJson = () => {
    downloadFile(
      JSON.stringify(filteredTransactions, null, 2),
      `transactions-${Date.now()}.json`,
      'application/json',
    );
  };

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {role === 'admin' && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
        )}
      </div>
    </div>
  );
}

export default TransactionsToolbar;
