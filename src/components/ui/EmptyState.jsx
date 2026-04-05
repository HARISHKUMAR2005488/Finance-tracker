function EmptyState({ title, description, compact = false, actionLabel, onAction }) {
  return (
    <div className={`grid place-content-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-900/40 ${compact ? 'h-56 px-4' : 'h-72 px-6'}`}>
      <div className="animate-content-lift">
        <div className="mx-auto mb-3 grid h-10 w-10 place-content-center rounded-full bg-slate-200/80 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <span className="text-lg">~</span>
        </div>
        <p className="text-base font-semibold tracking-tight text-slate-700 dark:text-slate-200">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
