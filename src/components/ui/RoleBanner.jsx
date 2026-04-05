import { Eye, ShieldCheck } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

function RoleBanner() {
  const { role } = useDashboard();

  const isAdmin = role === 'admin';

  return (
    <section
      className={`mb-6 rounded-xl border px-4 py-3 text-sm sm:text-base ${
        isAdmin
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/70 dark:bg-emerald-950/40 dark:text-emerald-200'
          : 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700/70 dark:bg-sky-950/40 dark:text-sky-200'
      }`}
    >
      <div className="flex items-center gap-2 font-medium">
        {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        {isAdmin ? 'Admin mode: add, edit, and delete are enabled.' : 'Viewer mode: read-only access is active.'}
      </div>
    </section>
  );
}

export default RoleBanner;
