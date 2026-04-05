import { TrendingDown, TrendingUp } from 'lucide-react';
import { useDashboardActions, useDashboardAnalyticsState } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

function InsightCard({ title, value, helper, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">{value}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{helper}</p>
    </button>
  );
}

function InsightsPanel() {
  const { insights } = useDashboardAnalyticsState();
  const { setFilters } = useDashboardActions();

  const up = insights.monthlyChange >= 0;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-emerald-100/70 blur-2xl dark:bg-emerald-900/20" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Signals</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">Automated Insights</h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Tap to filter
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InsightCard
          title="Highest Spending Category"
          value={insights.highestCategory?.name || 'Not enough data'}
          helper={
            insights.highestCategory
              ? `${formatCurrency(insights.highestCategory.amount)} this period`
              : 'Add expense entries to calculate this insight.'
          }
          onClick={() => {
            if (!insights.highestCategory) return;
            setFilters({
              type: 'expense',
              category: insights.highestCategory.name,
            });
          }}
        />
        <InsightCard
          title="Monthly Expense Change"
          value={`${Math.abs(insights.monthlyChange).toFixed(1)}% ${up ? 'increase' : 'decrease'}`}
          helper={up ? 'Expenses are trending upward' : 'Expense control improved this month'}
          onClick={() => {
            setFilters({
              type: 'expense',
              datePreset: '30d',
              startDate: '',
              endDate: '',
            });
          }}
        />
        <button
          type="button"
          onClick={() => {
            setFilters({
              search: '',
              type: 'expense',
              category: 'all',
              datePreset: '30d',
              startDate: '',
              endDate: '',
            });
          }}
          className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:border-cyan-800 dark:bg-cyan-950/50"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-cyan-700 dark:text-cyan-300">Smart Observation</p>
          <p className="mt-2 text-sm leading-relaxed text-cyan-800 dark:text-cyan-200">{insights.smartObservation}</p>
          <div className="mt-3 text-cyan-700 dark:text-cyan-300">
            {up ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
        </button>
      </div>
    </section>
  );
}

export default InsightsPanel;
