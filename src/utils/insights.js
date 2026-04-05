import { formatCurrency } from './formatters';

export function getHighestSpendingCategory(categoryBreakdown) {
  return categoryBreakdown?.[0] || null;
}

export function getMonthlySpendingChange(trend) {
  if (!trend?.length || trend.length < 2) return 0;

  const currentMonth = trend[trend.length - 1] || { expenses: 0 };
  const previousMonth = trend[trend.length - 2] || { expenses: 0 };

  if (!previousMonth.expenses) return 0;
  return ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
}

export function buildSmartObservation({ highestCategory, monthlyChange }) {
  if (!highestCategory) {
    return 'Add a few expense entries to unlock meaningful spending insights.';
  }

  const changeMagnitude = Math.abs(monthlyChange).toFixed(1);

  if (monthlyChange > 15) {
    return `${highestCategory.name} is driving your spend up by ${changeMagnitude}% this month. Consider setting a category cap.`;
  }

  if (monthlyChange < -10) {
    return `Great control: spending is down ${changeMagnitude}% versus last month while ${highestCategory.name} remains your biggest category.`;
  }

  return `${highestCategory.name} is still your top expense at ${formatCurrency(highestCategory.amount)}. A small 5-10% cut here could boost savings fast.`;
}
