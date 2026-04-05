import { Pencil, Trash2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

function TransactionsTable({ onEdit }) {
  const { filteredTransactions, role, deleteTransaction } = useDashboard();

  if (filteredTransactions.length === 0) {
    return (
      <EmptyState
        title="No transactions match your filters"
        description="Try clearing search, category, or type filters to see more results."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/70">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-500 dark:text-slate-300">Amount</th>
              {role === 'admin' && (
                <th className="px-4 py-3 text-center font-semibold text-slate-500 dark:text-slate-300">Actions</th>
              )}
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
                {role === 'admin' && (
                  <td className="px-4 py-3">
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
                        onClick={() => deleteTransaction(txn.id)}
                        className="rounded-md border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsTable;
