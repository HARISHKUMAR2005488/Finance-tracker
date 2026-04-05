import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

function SummaryCard({ label, value, accentClass, icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{label}</p>
        <div className={`rounded-lg p-2 text-white ${accentClass}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{formatCurrency(value)}</p>
    </article>
  );
}

function SummaryCards() {
  const { summary } = useDashboard();

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        label="Total Balance"
        value={summary.balance}
        accentClass={summary.balance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}
        icon={summary.balance >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
      />
      <SummaryCard
        label="Income"
        value={summary.income}
        accentClass="bg-cyan-500"
        icon={<ArrowUpRight className="h-5 w-5" />}
      />
      <SummaryCard
        label="Expenses"
        value={summary.expenses}
        accentClass="bg-orange-500"
        icon={<Wallet className="h-5 w-5" />}
      />
    </section>
  );
}

export default SummaryCards;
