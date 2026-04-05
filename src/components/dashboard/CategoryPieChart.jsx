import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboardAnalyticsState } from '../../context/DashboardContext';
import { CATEGORY_COLORS } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';

function CategoryPieChart() {
  const { categoryBreakdown } = useDashboardAnalyticsState();
  const totalSpending = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);
  const topCategories = categoryBreakdown.slice(0, 5);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="absolute -left-16 -top-12 h-44 w-44 rounded-full bg-orange-100/70 blur-2xl dark:bg-orange-900/25" />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Category Mix</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">Spending Breakdown</h3>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {formatCurrency(totalSpending)} total
        </div>
      </div>

      {categoryBreakdown.length === 0 ? (
        <EmptyState
          title="No expense data yet"
          description="Add expense transactions to unlock category analytics."
          compact
        />
      ) : (
        <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-center">
          <div className="h-72 w-full lg:col-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={102}
                  labelLine={false}
                >
                  {categoryBreakdown.map((item, index) => (
                    <Cell key={item.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 lg:col-span-2">
            {topCategories.map((item, index) => {
              const percentage = totalSpending ? (item.value / totalSpending) * 100 : 0;

              return (
                <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                      />
                      {item.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-300">{percentage.toFixed(1)}%</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(item.value)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

export default CategoryPieChart;
