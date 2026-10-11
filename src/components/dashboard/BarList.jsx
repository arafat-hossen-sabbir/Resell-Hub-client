const BarList = ({ items, emptyText = "No data yet." }) => {
  const max = Math.max(...items.map((item) => item.value), 0);

  if (items.length === 0 || max === 0) {
    return <p className="mt-5 text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="mt-5 space-y-4">
      {items.map(({ label, value, display }) => (
        <div key={label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate pr-3 text-slate-600">{label}</span>
            <span className="font-semibold text-slate-900">
              {display ?? value}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarList;
