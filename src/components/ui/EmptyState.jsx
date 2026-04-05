function EmptyState({ title, description, compact = false }) {
  return (
    <div className={`grid place-content-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-900/40 ${compact ? 'h-56 px-4' : 'h-72 px-6'}`}>
      <div>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
