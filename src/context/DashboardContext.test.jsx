import { reducer } from './DashboardContext';

describe('dashboard reducer role guards', () => {
  const baseState = {
    transactions: [
      {
        id: 'txn-1',
        date: '2026-01-10',
        description: 'Sample',
        category: 'Food & Dining',
        type: 'expense',
        amount: -40,
        status: 'completed',
      },
    ],
    role: 'viewer',
    darkMode: false,
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      sortBy: 'date',
      sortDirection: 'desc',
      datePreset: 'all',
      startDate: '',
      endDate: '',
    },
  };

  it('blocks addTransaction for viewer role', () => {
    const next = reducer(baseState, {
      type: 'addTransaction',
      payload: {
        id: 'txn-2',
        date: '2026-01-11',
        description: 'Blocked',
        category: 'Salary',
        type: 'income',
        amount: 100,
        status: 'completed',
      },
    });

    expect(next.transactions).toHaveLength(1);
    expect(next.transactions[0].id).toBe('txn-1');
  });

  it('allows addTransaction for admin role', () => {
    const next = reducer({ ...baseState, role: 'admin' }, {
      type: 'addTransaction',
      payload: {
        id: 'txn-2',
        date: '2026-01-11',
        description: 'Allowed',
        category: 'Salary',
        type: 'income',
        amount: 100,
        status: 'completed',
      },
    });

    expect(next.transactions).toHaveLength(2);
    expect(next.transactions[0].id).toBe('txn-2');
  });
});
