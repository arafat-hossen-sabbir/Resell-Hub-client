import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import api from "../../api/axios";
import BarList from "../../components/dashboard/BarList";
import ColumnChart from "../../components/dashboard/ColumnChart";
import { lastMonths } from "../../utils/charts";
import { formatPrice, getErrorMessage } from "../../utils/format";

const fillMonths = (rows = []) => {
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return lastMonths(6).map((month) => ({
    ...month,
    value: byKey[month.key] || 0,
  }));
};

const AdminAnalytics = () => {
  const { profile, ready } = useOutletContext();
  const isAdmin = profile?.role === "admin";

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !isAdmin) return undefined;

    let active = true;

    api
      .get("/admin/analytics")
      .then(({ data }) => {
        if (active) setAnalytics(data.analytics);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Analytics could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isAdmin]);

  const growth = useMemo(() => fillMonths(analytics?.userGrowth), [analytics]);
  const monthly = useMemo(
    () => fillMonths(analytics?.monthlyOrders),
    [analytics],
  );

  if (ready && !isAdmin) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <ShieldAlert className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 text-slate-500">
          This area is only available to administrators.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!ready || loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error || "Analytics could not be loaded."}
      </div>
    );
  }

  const performance = analytics.categoryPerformance.map((item) => ({
    ...item,
    display: formatPrice(item.value),
  }));

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Platform Analytics
      </h1>
      <p className="mt-2 text-slate-500">
        Growth, orders and category performance.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-slate-900">User growth</h2>
          <ColumnChart data={growth} emptyText="No new users in this period." />
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-slate-900">
            Monthly orders
          </h2>
          <ColumnChart data={monthly} emptyText="No orders in this period." />
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-slate-900">
            Category performance (revenue)
          </h2>
          <BarList items={performance} emptyText="No sales yet." />
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-slate-900">
            Top categories (live listings)
          </h2>
          <BarList
            items={analytics.topCategories}
            emptyText="No listings yet."
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
