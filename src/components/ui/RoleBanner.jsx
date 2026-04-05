import { Eye, ShieldCheck } from 'lucide-react';
import { useDashboardUIState } from '../../context/DashboardContext';

function RoleBanner() {
  const { role } = useDashboardUIState();

  const isAdmin = role === 'admin';

  return (
    <section
      className={`rounded-xl border px-4 py-3 text-sm sm:px-5 sm:py-3.5 sm:text-base ${
        isAdmin
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/70 dark:bg-emerald-950/40 dark:text-emerald-200'
          : 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700/70 dark:bg-sky-950/40 dark:text-sky-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${isAdmin ? 'bg-emerald-100 dark:bg-emerald-900/45' : 'bg-sky-100 dark:bg-sky-900/45'}`}>
          {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </span>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] opacity-80">Current Permission</p>
          <p className="font-semibold">
            {isAdmin ? 'Admin mode: add, edit, and delete are enabled.' : 'Viewer mode: read-only access is active.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default RoleBanner;
