import { formatPrice } from "../../utils/format";

const MonthlyChart = ({ data }) => {
  const max = Math.max(...data.map((item) => item.revenue), 0);

  if (max === 0) {
    return (
      <p className="mt-5 text-sm text-slate-500">
        Revenue will appear here once orders come in.
      </p>
    );
  }

  return (
    <div className="mt-6 flex h-52 items-end gap-3">
      {data.map(({ key, label, revenue, orders }) => (
        <div
          key={key}
          className="flex h-full flex-1 flex-col items-center justify-end"
          title={`${formatPrice(revenue)} from ${orders} orders`}
        >
          <span className="mb-1 text-xs font-medium text-slate-500">
            {revenue > 0 ? formatPrice(revenue).replace("৳ ", "") : ""}
          </span>
          <div
            className="w-full rounded-t-lg bg-emerald-500 transition-all"
            style={{
              height: `${Math.max((revenue / max) * 100, revenue > 0 ? 4 : 0)}%`,
            }}
          />
          <span className="mt-2 text-xs text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default MonthlyChart;
