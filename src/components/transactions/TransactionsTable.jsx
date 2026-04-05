import { Pencil, Trash2 } from 'lucide-react';
import {
  useDashboardFiltersState,
  useDashboardTransactionsState,
  useDashboardUIState,
} from '../../context/DashboardContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';

function TransactionsTable({ onEdit, onDeleteRequest, onAdd, onClearFilters, onRestrictedAction }) {
  const { filteredTransactions, transactions } = useDashboardTransactionsState();
  const { hasActiveFilters } = useDashboardFiltersState();
  const { role } = useDashboardUIState();

  if (filteredTransactions.length === 0) {
    if (transactions.length === 0) {
      return (
        <EmptyState
          title="No transactions yet"
          description={
            role === 'admin'
              ? 'Start by adding your first income or expense transaction.'
              : 'No transactions are available for this account yet.'
          }
          actionLabel={role === 'admin' ? 'Add your first transaction' : undefined}
          onAction={role === 'admin' ? onAdd : undefined}
        />
      );
    }

    return (
      <EmptyState
        title="No transactions match your filters"
        description="Try clearing search, category, or type filters to see more results."
        actionLabel={hasActiveFilters ? 'Reset filters' : undefined}
        onAction={hasActiveFilters ? onClearFilters : undefined}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="space-y-3 p-3 md:hidden">
        {filteredTransactions.map((txn, index) => (
          <article
            key={txn.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/50"
            style={{ animation: 'fadeInRow 0.2s ease-out', animationDelay: `${index * 15}ms` }}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{txn.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(txn.date)}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  txn.type === 'income'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                }`}
              >
                {txn.type}
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">{txn.category}</span>
              <span
                className={`font-semibold ${
                  txn.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'}
                {formatCurrency(Math.abs(txn.amount))}
              </span>
            </div>

            {role === 'admin' ? (
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(txn)}
                  className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label="Edit transaction"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(txn)}
                  className="rounded-md border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onRestrictedAction}
                  className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Admin only
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/70">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-500 dark:text-slate-300">Amount</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-300">
                {role === 'admin' ? 'Actions' : 'Access'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, index) => (
              <tr
                key={txn.id}
                className="border-t border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/50"
                style={{ animation: 'fadeInRow 0.2s ease-out', animationDelay: `${index * 15}ms` }}
              >
                <td className="px-4 py-3">{formatDate(txn.date)}</td>
                <td className="px-4 py-3 font-medium">{txn.description}</td>
                <td className="px-4 py-3">{txn.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      txn.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    }`}
                  >
                    {txn.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    txn.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(txn.amount))}
                </td>
                <td className="px-4 py-3">
                  {role === 'admin' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(txn)}
                        className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        aria-label="Edit transaction"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(txn)}
                        className="rounded-md border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={onRestrictedAction}
                        className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Admin only
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsTable;
