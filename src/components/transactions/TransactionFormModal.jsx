import { useMemo, useState } from 'react';
import { useDashboardActions, useDashboardFiltersState } from '../../context/DashboardContext';

function toFormValue(transaction) {
  if (!transaction) {
    return {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      category: 'Food & Dining',
      type: 'expense',
      amount: '',
      status: 'completed',
    };
  }

  return {
    ...transaction,
    amount: String(Math.abs(transaction.amount)),
  };
}

function TransactionFormModal({ selected, onClose }) {
  const { categories } = useDashboardFiltersState();
  const { addTransaction, updateTransaction } = useDashboardActions();
  const [formData, setFormData] = useState(() => toFormValue(selected));
  const [formError, setFormError] = useState('');

  const categoryOptions = useMemo(
    () => (formData.type === 'income' ? categories.income : categories.expense),
    [categories, formData.type],
  );

  const updateField = (key, value) => {
    setFormError('');
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'type' ? { category: value === 'income' ? categories.income[0] : categories.expense[0] } : {}),
    }));
  };

  const normalizedDescription = formData.description.trim();
  const numericAmount = Number(formData.amount);
  const isDescriptionValid = normalizedDescription.length >= 3;
  const isAmountValid = Number.isFinite(numericAmount) && numericAmount > 0;
  const canSubmit = isDescriptionValid && isAmountValid;

  const onSubmit = (event) => {
    event.preventDefault();

    if (!isDescriptionValid) {
      setFormError('Description must be at least 3 characters long.');
      return;
    }

    if (!isAmountValid) {
      setFormError('Amount must be greater than 0.');
      return;
    }

    const absoluteAmount = Math.abs(numericAmount);
    const payload = {
      ...formData,
      description: normalizedDescription,
      id: selected?.id || `txn-${Date.now()}`,
      amount: formData.type === 'income' ? absoluteAmount : -absoluteAmount,
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
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:p-6"
      >
        <div className="mb-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-300">{selected ? 'Update' : 'Create'}</p>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {selected ? 'Edit transaction' : 'Add transaction'}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Date
            <input
              required
              type="date"
              value={formData.date}
              onChange={(event) => updateField('date', event.target.value)}
              className="field-control mt-1 w-full rounded-lg px-3 py-2 outline-none ring-cyan-200 focus:ring"
            />
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            Type
            <select
              value={formData.type}
              onChange={(event) => updateField('type', event.target.value)}
              className="field-control mt-1 w-full rounded-lg px-3 py-2 outline-none ring-cyan-200 focus:ring"
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
              className="field-control mt-1 w-full rounded-lg px-3 py-2 outline-none ring-cyan-200 focus:ring"
              placeholder="Example: Grocery shopping"
            />
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            Category
            <select
              value={formData.category}
              onChange={(event) => updateField('category', event.target.value)}
              className="field-control mt-1 w-full rounded-lg px-3 py-2 outline-none ring-cyan-200 focus:ring"
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
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(event) => updateField('amount', event.target.value)}
              className="field-control mt-1 w-full rounded-lg px-3 py-2 outline-none ring-cyan-200 focus:ring"
            />
          </label>
        </div>

        {formError && (
          <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
            {formError}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selected ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionFormModal;
