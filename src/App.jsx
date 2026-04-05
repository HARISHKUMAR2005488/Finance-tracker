import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SummaryCards from './components/dashboard/SummaryCards';
import InsightsPanel from './components/dashboard/InsightsPanel';
import Header from './components/ui/Header';
import RoleBanner from './components/ui/RoleBanner';
import ConfirmDialog from './components/ui/ConfirmDialog';
import TransactionFormModal from './components/transactions/TransactionFormModal';
import TransactionsTable from './components/transactions/TransactionsTable';
import TransactionsToolbar from './components/transactions/TransactionsToolbar';
import { DashboardProvider, useDashboardActions, useDashboardUIState } from './context/DashboardContext';

const BalanceTrendChart = lazy(() => import('./components/dashboard/BalanceTrendChart'));
const CategoryPieChart = lazy(() => import('./components/dashboard/CategoryPieChart'));

function ChartCardFallback() {
  return (
    <div className="h-[22rem] animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-[16.5rem] rounded bg-slate-100 dark:bg-slate-900/70" />
    </div>
  );
}

function TransactionsModule() {
  const { role } = useDashboardUIState();
  const { deleteTransaction, setFilters } = useDashboardActions();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pendingDeleteTransaction, setPendingDeleteTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [restrictedActionFeedback, setRestrictedActionFeedback] = useState('');
  const restrictedFeedbackTimeoutRef = useRef(null);

  const showRestrictedActionFeedback = () => {
    setRestrictedActionFeedback('Viewer mode is read-only. Switch role to Admin to add, edit, or delete transactions.');
    if (restrictedFeedbackTimeoutRef.current) {
      window.clearTimeout(restrictedFeedbackTimeoutRef.current);
    }
    restrictedFeedbackTimeoutRef.current = window.setTimeout(() => {
      setRestrictedActionFeedback('');
    }, 2400);
  };

  useEffect(() => {
    return () => {
      if (restrictedFeedbackTimeoutRef.current) {
        window.clearTimeout(restrictedFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const onAdd = () => {
    if (role !== 'admin') {
      showRestrictedActionFeedback();
      return;
    }
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const onEdit = (transaction) => {
    if (role !== 'admin') {
      showRestrictedActionFeedback();
      return;
    }
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  return (
    <section className="glass-panel panel-surface rounded-2xl p-5 sm:p-6">
      <div className="mb-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Records</p>
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Transactions</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, sort, and manage entries with role-based actions.</p>
      </div>

      {role === 'viewer' && (
        <div className="mb-3 rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 dark:border-sky-700/70 dark:bg-sky-950/40 dark:text-sky-200">
          Read-only mode: transaction management is restricted.
        </div>
      )}

      {restrictedActionFeedback && (
        <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-200">
          {restrictedActionFeedback}
        </div>
      )}

      <TransactionsToolbar onAdd={onAdd} onRestrictedAction={showRestrictedActionFeedback} />
      <TransactionsTable
        onEdit={onEdit}
        onDeleteRequest={(transaction) => setPendingDeleteTransaction(transaction)}
        onAdd={onAdd}
        onRestrictedAction={showRestrictedActionFeedback}
        onClearFilters={() =>
          setFilters({
            search: '',
            type: 'all',
            category: 'all',
            sortBy: 'date',
            sortDirection: 'desc',
            datePreset: 'all',
            startDate: '',
            endDate: '',
          })
        }
      />

      {modalOpen && (
        <TransactionFormModal
          selected={selectedTransaction}
          onClose={() => {
            setModalOpen(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {pendingDeleteTransaction && (
        <ConfirmDialog
          title="Delete transaction"
          description={`Delete \"${pendingDeleteTransaction.description}\" from ${new Date(
            pendingDeleteTransaction.date,
          ).toLocaleDateString()}? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmTone="danger"
          onCancel={() => setPendingDeleteTransaction(null)}
          onConfirm={() => {
            deleteTransaction(pendingDeleteTransaction.id);
            setPendingDeleteTransaction(null);
          }}
        />
      )}
    </section>
  );
}

function FinanceDashboardApp() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 animate-content-lift">
        <Header />
        <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 pb-10 sm:px-6 sm:py-8 lg:px-8">
          <RoleBanner />

          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              Financial Overview
            </p>
            <h2 className="text-2xl font-bold tracking-tight leading-tight text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-[2.05rem]">
              Portfolio Health Dashboard
            </h2>
            <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Track balance growth, income quality, and spending pressure in one place.
            </p>
          </section>

          <SummaryCards />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <Suspense fallback={<ChartCardFallback />}>
              <div className="xl:col-span-3">
                <BalanceTrendChart />
              </div>
            </Suspense>
            <Suspense fallback={<ChartCardFallback />}>
              <div className="xl:col-span-2">
                <CategoryPieChart />
              </div>
            </Suspense>
          </section>

          <InsightsPanel />
          <TransactionsModule />
        </main>
      </div>
    </DashboardProvider>
  );
}

export default FinanceDashboardApp;
