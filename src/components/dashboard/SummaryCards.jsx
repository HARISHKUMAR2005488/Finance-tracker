import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { useDashboardAnalyticsState } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

function SummaryCard({ label, value, accentClass, icon, helper, helperTone }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100/80 group-hover:scale-110 dark:bg-slate-700/40" />

      <div className="relative mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">{label}</p>
        <div className={`rounded-xl p-2.5 text-white shadow ${accentClass}`}>{icon}</div>
      </div>

      <div className="relative space-y-1">
        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{formatCurrency(value)}</p>
        <p className={`text-sm font-medium ${helperTone}`}>{helper}</p>
      </div>
    </article>
  );
}

function SummaryCards() {
  const { summary } = useDashboardAnalyticsState();

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        label="Total Balance"
        value={summary.balance}
        accentClass={summary.balance >= 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-rose-500 to-red-500'}
        icon={summary.balance >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
        helper={summary.balance >= 0 ? 'You are cash-flow positive' : 'Expenses currently exceed income'}
        helperTone={summary.balance >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}
      />
      <SummaryCard
        label="Income"
        value={summary.income}
        accentClass="bg-gradient-to-br from-cyan-500 to-blue-500"
        icon={<ArrowUpRight className="h-5 w-5" />}
        helper={`${summary.incomeCount} income transactions logged`}
        helperTone="text-cyan-700 dark:text-cyan-300"
      />
      <SummaryCard
        label="Expenses"
        value={summary.expenses}
        accentClass="bg-gradient-to-br from-orange-500 to-amber-500"
        icon={<Wallet className="h-5 w-5" />}
        helper={`${summary.expenseCount} expense transactions tracked`}
        helperTone="text-orange-700 dark:text-orange-300"
      />
    </section>
  );
}

export default SummaryCards;
