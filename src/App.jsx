import { lazy, Suspense, useState } from 'react';
import SummaryCards from './components/dashboard/SummaryCards';
import InsightsPanel from './components/dashboard/InsightsPanel';
import Header from './components/ui/Header';
import RoleBanner from './components/ui/RoleBanner';
import ConfirmDialog from './components/ui/ConfirmDialog';
import TransactionFormModal from './components/transactions/TransactionFormModal';
import TransactionsTable from './components/transactions/TransactionsTable';
import TransactionsToolbar from './components/transactions/TransactionsToolbar';
import { DashboardProvider, useDashboard } from './context/DashboardContext';

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
  const { deleteTransaction } = useDashboard();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pendingDeleteTransaction, setPendingDeleteTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onAdd = () => {
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const onEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  return (
    <section className="glass-panel rounded-2xl p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transactions</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, sort, and manage entries with role-based actions.</p>
      </div>

      <TransactionsToolbar onAdd={onAdd} />
      <TransactionsTable
        onEdit={onEdit}
        onDeleteRequest={(transaction) => setPendingDeleteTransaction(transaction)}
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
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <RoleBanner />
          <SummaryCards />

          <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Suspense fallback={<ChartCardFallback />}>
              <BalanceTrendChart />
            </Suspense>
            <Suspense fallback={<ChartCardFallback />}>
              <CategoryPieChart />
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
