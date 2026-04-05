import { TrendingDown, TrendingUp } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

function InsightCard({ title, value, helper }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </article>
  );
}

function InsightsPanel() {
  const { insights } = useDashboard();

  const up = insights.monthlyChange >= 0;

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Dynamic Insights</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InsightCard
          title="Highest Spending Category"
          value={insights.highestCategory?.name || 'Not enough data'}
          helper={
            insights.highestCategory
              ? `${formatCurrency(insights.highestCategory.amount)} this period`
              : 'Add expense entries to calculate this insight.'
          }
        />
        <InsightCard
          title="Monthly Expense Change"
          value={`${Math.abs(insights.monthlyChange).toFixed(1)}% ${up ? 'increase' : 'decrease'}`}
          helper={up ? 'Expenses are trending upward' : 'Expense control improved this month'}
        />
        <article className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950/50">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Smart Observation</p>
          <p className="mt-2 text-sm leading-relaxed text-cyan-800 dark:text-cyan-200">{insights.smartObservation}</p>
          <div className="mt-3 text-cyan-700 dark:text-cyan-300">
            {up ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
        </article>
      </div>
    </section>
  );
}

export default InsightsPanel;
