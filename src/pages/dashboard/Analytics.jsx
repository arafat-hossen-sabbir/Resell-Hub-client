import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  Package,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import api from "../../api/axios";
import BarList from "../../components/dashboard/BarList";
import MonthlyChart from "../../components/dashboard/MonthlyChart";
import { lastMonths, monthKey, NOT_COUNTED } from "../../utils/charts";
import { formatPrice, getErrorMessage } from "../../utils/format";

const STATUSES = [
  "Pending",
  "Accepted",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Rejected",
];

const Analytics = () => {
  const { profile, ready } = useOutletContext();
  const isSeller = ["seller", "admin"].includes(profile?.role);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return undefined;

    if (!isSeller) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    Promise.all([api.get("/orders/seller-orders"), api.get("/products/my")])
      .then(([orderRes, productRes]) => {
        if (!active) return;
        setOrders(orderRes.data.orders);
        setProducts(productRes.data.products);
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
  }, [ready, isSeller]);

  const stats = useMemo(() => {
    const counted = orders.filter((o) => !NOT_COUNTED.includes(o.orderStatus));
    const revenue = counted.reduce((sum, o) => sum + o.totalPrice, 0);

    const months = lastMonths(6).map((month) => ({
      ...month,
      revenue: 0,
      orders: 0,
    }));

    counted.forEach((order) => {
      const slot = months.find((m) => m.key === monthKey(order.createdAt));
      if (slot) {
        slot.revenue += order.totalPrice;
        slot.orders += 1;
      }
    });

    const byStatus = STATUSES.map((status) => ({
      label: status,
      value: orders.filter((o) => o.orderStatus === status).length,
    })).filter((item) => item.value > 0);

    const perProduct = {};
    counted.forEach((order) => {
      const id = String(order.productId);
      perProduct[id] = perProduct[id] || {
        label: order.productTitle,
        value: 0,
      };
      perProduct[id].value += order.totalPrice;
    });

    const topProducts = Object.values(perProduct)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item) => ({ ...item, display: formatPrice(item.value) }));

    const delivered = orders.filter((o) => o.orderStatus === "Delivered");

    return {
      revenue,
      counted: counted.length,
      average: counted.length ? Math.round(revenue / counted.length) : 0,
      deliveredRevenue: delivered.reduce((sum, o) => sum + o.totalPrice, 0),
      months,
      byStatus,
      topProducts,
    };
  }, [orders]);

  const productStats = useMemo(
    () => ({
      total: products.length,
      approved: products.filter((p) => p.status === "approved").length,
      pending: products.filter((p) => p.status === "pending").length,
      lowStock: products.filter((p) => p.status === "approved" && p.stock <= 1),
    }),
    [products],
  );

  if (!ready || loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
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

  if (!isSeller) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Analytics
        </h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-500">
            Analytics are available once you become a seller.
          </p>
          <Link
            to="/dashboard/products"
            className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start selling
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </div>
    );
  }

  const cards = [
    { title: "Total Revenue", value: formatPrice(stats.revenue), icon: Wallet },
    { title: "Orders", value: stats.counted, icon: Receipt },
    {
      title: "Average Order",
      value: formatPrice(stats.average),
      icon: TrendingUp,
    },
    {
      title: "Active Listings",
      value: `${productStats.approved} / ${productStats.total}`,
      icon: Package,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Analytics
      </h1>
      <p className="mt-2 text-slate-500">
        See how your listings and sales are performing.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon }) => (
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
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue, last 6 months
          </h2>
          <p className="text-sm text-slate-500">
            Delivered so far: {formatPrice(stats.deliveredRevenue)}
          </p>
        </div>
        <MonthlyChart data={stats.months} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Orders by status
          </h2>
          <BarList items={stats.byStatus} emptyText="No orders received yet." />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Top products by revenue
          </h2>
          <BarList
            items={stats.topProducts}
            emptyText="Your best sellers will show up here."
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <AlertTriangle size={18} className="text-amber-500" />
          Low stock
        </h2>

        {productStats.lowStock.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            All your live listings have enough stock.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {productStats.lowStock.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="truncate pr-4 text-slate-700">
                  {product.title}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.stock === 0
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : `${product.stock} left`}
                </span>
              </div>
            ))}
          </div>
        )}

        {productStats.pending > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {productStats.pending} listing
            {productStats.pending > 1 ? "s are" : " is"} waiting for admin
            approval.
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
