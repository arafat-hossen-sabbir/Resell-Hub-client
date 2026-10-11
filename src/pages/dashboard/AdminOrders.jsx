import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Receipt, ShieldAlert } from "lucide-react";
import api from "../../api/axios";
import Pager from "../../components/dashboard/Pager";
import {
  formatDate,
  formatPrice,
  getErrorMessage,
  orderStatusStyles,
} from "../../utils/format";
import { showError, toast } from "../../utils/notify";

const FILTERS = [
  "All",
  "Pending",
  "Accepted",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Rejected",
];

const AdminOrders = () => {
  const { profile, ready } = useOutletContext();
  const isAdmin = profile?.role === "admin";

  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ orders: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !isAdmin) return undefined;

    let active = true;
    setLoading(true);

    api
      .get("/admin/orders", { params: { status, page } })
      .then(({ data: res }) => {
        if (active) {
          setData({ orders: res.orders, pagination: res.pagination });
          setError("");
        }
      })
      .catch((err) => {
        if (active)
          setError(getErrorMessage(err, "Orders could not be loaded."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isAdmin, status, page]);

  const changeStatus = async (order, orderStatus) => {
    try {
      const { data: res } = await api.patch(
        `/admin/orders/${order._id}/status`,
        { orderStatus },
      );

      setData((current) => ({
        ...current,
        orders: current.orders.map((item) =>
          item._id === order._id ? res.order : item,
        ),
      }));
      toast("Order updated");
    } catch (err) {
      showError(getErrorMessage(err, "The order could not be updated."));
    }
  };

  if (ready && !isAdmin) {
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

  const { orders, pagination } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        All Orders
      </h1>
      <p className="mt-2 text-slate-500">
        Every order on the marketplace. Change a status to resolve a dispute.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setStatus(item);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === item
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Receipt className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">No orders in this view.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {order.productImage ? (
                  <img
                    src={order.productImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {order.productTitle}
                </p>
                <p className="text-sm text-slate-500">
                  #{order._id.slice(-6).toUpperCase()} ·{" "}
                  {formatDate(order.createdAt)} · Qty {order.quantity}
                </p>
                <p className="text-sm text-slate-500">
                  {order.buyerInfo?.name} bought from {order.sellerInfo?.name}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-900">
                  {formatPrice(order.totalPrice)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
                <select
                  value={order.orderStatus}
                  disabled={["Cancelled", "Rejected"].includes(
                    order.orderStatus,
                  )}
                  onChange={(e) => changeStatus(order, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-medium outline-none disabled:opacity-70 ${
                    orderStatusStyles[order.orderStatus] ||
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {FILTERS.filter((item) => item !== "All").map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pager pagination={pagination} onChange={setPage} />
    </div>
  );
};

export default AdminOrders;
