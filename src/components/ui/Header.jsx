import { DollarSign, Moon, Shield, Sun } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

function Header() {
  const { darkMode, role, setDarkMode, setRole } = useDashboard();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-content-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">FinanceTrack</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Clean personal finance command center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 sm:flex">
            <Shield className="h-4 w-4 text-slate-500" />
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none dark:text-slate-200"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200/70 px-4 py-3 dark:border-slate-700 sm:hidden">
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
          <Shield className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600 dark:text-slate-300">Role:</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="ml-auto bg-transparent font-medium text-slate-700 outline-none dark:text-slate-200"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
      </div>
    </header>
  );
}

export default Header;
