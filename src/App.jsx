import { useState } from 'react';
import SummaryCards from './components/dashboard/SummaryCards';
import BalanceTrendChart from './components/dashboard/BalanceTrendChart';
import CategoryPieChart from './components/dashboard/CategoryPieChart';
import InsightsPanel from './components/dashboard/InsightsPanel';
import Header from './components/layout/Header';
import RoleBanner from './components/layout/RoleBanner';
import TransactionFormModal from './components/transactions/TransactionFormModal';
import TransactionsTable from './components/transactions/TransactionsTable';
import TransactionsToolbar from './components/transactions/TransactionsToolbar';
import { DashboardProvider } from './context/DashboardContext';

function TransactionsModule() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transactions</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, sort, and manage entries with role-based actions.</p>
      </div>

      <TransactionsToolbar onAdd={onAdd} />
      <TransactionsTable onEdit={onEdit} />

      {modalOpen && (
        <TransactionFormModal
          selected={selectedTransaction}
          onClose={() => {
            setModalOpen(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </section>
  );
}

function FinanceDashboardApp() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <RoleBanner />
          <SummaryCards />

          <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BalanceTrendChart />
            <CategoryPieChart />
          </section>

          <InsightsPanel />
          <TransactionsModule />
        </main>
      </div>
    </DashboardProvider>
  );
}

export default FinanceDashboardApp;
