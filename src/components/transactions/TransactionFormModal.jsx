import { useMemo, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

function toFormValue(transaction) {
  if (!transaction) {
    return {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      category: 'Food & Dining',
      type: 'expense',
      amount: '0',
      status: 'completed',
    };
  }

  return {
    ...transaction,
    amount: String(Math.abs(transaction.amount)),
  };
}

function TransactionFormModal({ selected, onClose }) {
  const { addTransaction, updateTransaction, categories } = useDashboard();
  const [formData, setFormData] = useState(() => toFormValue(selected));

  const categoryOptions = useMemo(
    () => (formData.type === 'income' ? categories.income : categories.expense),
    [categories, formData.type],
  );

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'type' ? { category: value === 'income' ? categories.income[0] : categories.expense[0] } : {}),
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const numericAmount = Math.abs(Number(formData.amount) || 0);
    const payload = {
      ...formData,
      id: selected?.id || `txn-${Date.now()}`,
      amount: formData.type === 'income' ? numericAmount : -numericAmount,
    };

    if (selected) {
      updateTransaction(payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-content-center bg-slate-950/45 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
          {selected ? 'Edit transaction' : 'Add transaction'}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Date
            <input
              required
              type="date"
              value={formData.date}
              onChange={(event) => updateField('date', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-cyan-200 focus:ring dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            Type
            <select
              value={formData.type}
              onChange={(event) => updateField('type', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-cyan-200 focus:ring dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
            Description
            <input
              required
              type="text"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-cyan-200 focus:ring dark:border-slate-700 dark:bg-slate-900"
              placeholder="Example: Grocery shopping"
            />
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            Category
            <select
              value={formData.category}
              onChange={(event) => updateField('category', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-cyan-200 focus:ring dark:border-slate-700 dark:bg-slate-900"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            Amount
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(event) => updateField('amount', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-cyan-200 focus:ring dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white"
          >
            {selected ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionFormModal;
