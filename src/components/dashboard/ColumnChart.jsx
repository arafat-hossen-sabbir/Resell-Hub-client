const ColumnChart = ({ data, emptyText = "No data yet." }) => {
  const max = Math.max(...data.map((item) => item.value), 0);

  if (max === 0) {
    return <p className="mt-5 text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="mt-6 flex h-48 items-end gap-3">
      {data.map(({ key, label, value }) => (
        <div
          key={key}
          className="flex h-full flex-1 flex-col items-center justify-end"
        >
          <span className="mb-1 text-xs font-medium text-slate-500">
            {value || ""}
          </span>
          <div
            className="w-full rounded-t-lg bg-emerald-500"
            style={{
              height: `${Math.max((value / max) * 100, value ? 4 : 0)}%`,
            }}
          />
          <span className="mt-2 text-xs text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ColumnChart;
