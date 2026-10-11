import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ClipboardCheck,
  Package,
  Receipt,
  ShieldAlert,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import api from "../../api/axios";
import BarList from "../../components/dashboard/BarList";
import MonthlyChart from "../../components/dashboard/MonthlyChart";
import { lastMonths } from "../../utils/charts";
import {
  formatDate,
  formatPrice,
  getErrorMessage,
  orderStatusStyles,
} from "../../utils/format";

const ORDER_STATUSES = [
  "Pending",
  "Accepted",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Rejected",
];

const AdminDashboard = () => {
  const { profile, ready } = useOutletContext();
  const isAdmin = profile?.role === "admin";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return undefined;

    if (!isAdmin) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    api
      .get("/admin-dashboard/stats")
      .then(({ data }) => {
        if (active) setStats(data.stats);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Statistics could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isAdmin]);

  const months = useMemo(() => {
    const byKey = Object.fromEntries(
      (stats?.monthly || []).map((row) => [row.key, row]),
    );

    return lastMonths(6).map((month) => ({
      ...month,
      revenue: byKey[month.key]?.revenue || 0,
      orders: byKey[month.key]?.orders || 0,
    }));
  }, [stats]);

  if (!ready || loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <ShieldAlert className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 text-slate-500">
          This area is only available to administrators.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error || "Statistics could not be loaded."}
      </div>
    );
  }

  const { users, products, orders, revenue, recentOrders } = stats;

  const cards = [
    {
      title: "Total Users",
      value: users.total,
      note: `${users.newThisWeek} new this week`,
      icon: Users,
    },
    {
      title: "Sellers",
      value: users.sellers,
      note: `${users.buyers} buyers`,
      icon: UserPlus,
    },
    {
      title: "Products",
      value: products.total,
      note: `${products.approved} live`,
      icon: Package,
    },
    {
      title: "Awaiting Approval",
      value: products.pending,
      note: products.pending ? "Needs your review" : "All clear",
      icon: ClipboardCheck,
    },
    {
      title: "Orders",
      value: orders.total,
      note: `${orders.byStatus.Pending || 0} pending`,
      icon: Receipt,
    },
    {
      title: "Platform Revenue",
      value: formatPrice(revenue),
      note: "Excludes cancelled and rejected",
      icon: Wallet,
    },
  ];

  const orderBars = ORDER_STATUSES.map((status) => ({
    label: status,
    value: orders.byStatus[status] || 0,
  })).filter((item) => item.value > 0);

  const productBars = [
    { label: "Approved", value: products.approved },
    { label: "Pending", value: products.pending },
    { label: "Rejected", value: products.rejected },
  ].filter((item) => item.value > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Admin Overview
      </h1>
      <p className="mt-2 text-slate-500">
        A summary of everything happening on the marketplace.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, note, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{note}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Platform revenue, last 6 months
        </h2>
        <MonthlyChart data={months} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Orders by status
          </h2>
          <BarList items={orderBars} emptyText="No orders yet." />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Products by status
          </h2>
          <BarList items={productBars} emptyText="No products yet." />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {order.productImage ? (
                    <img
                      src={order.productImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">
                    {order.productTitle}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.buyerInfo?.name} bought from {order.sellerInfo?.name}{" "}
                    · {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">
                    {formatPrice(order.totalPrice)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      orderStatusStyles[order.orderStatus] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
