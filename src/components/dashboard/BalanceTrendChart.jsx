import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardAnalyticsState } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

function BalanceTrendChart() {
  const { trend } = useDashboardAnalyticsState();

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="absolute -top-20 right-0 h-52 w-52 rounded-full bg-cyan-100/60 blur-2xl dark:bg-cyan-900/20" />

      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Trend Analysis</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">Balance Trajectory</h3>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Last 6 months
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-500" /> Balance
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Income
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
          <span className="h-2 w-2 rounded-full bg-orange-500" /> Expenses
        </span>
      </div>

      <div className="relative h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(value) => `$${Number(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
              }}
            />
            <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={3.5} dot={false} />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2.2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default BalanceTrendChart;
