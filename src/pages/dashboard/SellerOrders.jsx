import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Clock3, PackageCheck, Receipt, Truck } from "lucide-react";
import api from "../../api/axios";
import {
  formatDate,
  formatPrice,
  getErrorMessage,
  orderStatusStyles,
} from "../../utils/format";
import { confirmAction, showError, toast } from "../../utils/notify";

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

const actionsByStatus = {
  Pending: [
    { label: "Accept", next: "Accepted", tone: "primary" },
    { label: "Reject", next: "Rejected", tone: "danger" },
  ],
  Accepted: [{ label: "Start processing", next: "Processing", tone: "primary" }],
  Processing: [{ label: "Mark as shipped", next: "Shipped", tone: "primary" }],
  Shipped: [{ label: "Mark as delivered", next: "Delivered", tone: "primary" }],
};

const toneClass = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "border border-rose-200 text-rose-600 hover:bg-rose-50",
};

const IN_PROGRESS = ["Accepted", "Processing", "Shipped"];

const SellerOrders = () => {
  const { profile, ready } = useOutletContext();
  const isSeller = ["seller", "admin"].includes(profile?.role);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!ready) return undefined;

    if (!isSeller) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);

    api
      .get("/orders/seller-orders")
      .then(({ data }) => {
        if (active) setOrders(data.orders);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Orders could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isSeller]);

  const changeStatus = async (order, action) => {
    if (action.tone === "danger") {
      const confirmed = await confirmAction({
        title: "Reject this order?",
        text: "The buyer will be notified and the stock will be restored.",
        confirmText: "Yes, reject",
      });

      if (!confirmed) return;
    }

    setBusyId(order._id);

    try {
      const { data } = await api.patch(`/orders/${order._id}/status`, {
        orderStatus: action.next,
      });

      setOrders((current) =>
        current.map((item) => (item._id === order._id ? data.order : item)),
      );
      toast(`Order ${action.next.toLowerCase()}`);
    } catch (err) {
      showError(getErrorMessage(err, "The order could not be updated."));
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(
    () => [
      { title: "Total Orders", value: orders.length, icon: Receipt },
      {
        title: "Needs Review",
        value: orders.filter((o) => o.orderStatus === "Pending").length,
        icon: Clock3,
      },
      {
        title: "In Progress",
        value: orders.filter((o) => IN_PROGRESS.includes(o.orderStatus))
          .length,
        icon: Truck,
      },
      {
        title: "Delivered",
        value: orders.filter((o) => o.orderStatus === "Delivered").length,
        icon: PackageCheck,
      },
    ],
    [orders],
  );

  const visibleOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

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
        <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Sales Orders
        </h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-500">
            You need a seller account to receive orders.
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Sales Orders
      </h1>
      <p className="mt-2 text-slate-500">
        Review and fulfil the orders placed on your products.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
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

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === item
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          {orders.length === 0
            ? "You have not received any orders yet."
            : `No ${filter.toLowerCase()} orders.`}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleOrders.map((order) => {
            const actions = actionsByStatus[order.orderStatus] || [];

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {order.productImage ? (
                      <img
                        src={order.productImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-slate-900">
                      {order.productTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Order #{order._id.slice(-6).toUpperCase()} ·{" "}
                      {formatDate(order.createdAt)} · Qty {order.quantity}
                    </p>
                    <p className="mt-2 font-bold text-emerald-600">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>

                  <span
                    className={`self-start rounded-full px-3 py-1 text-sm font-medium md:self-center ${
                      orderStatusStyles[order.orderStatus] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-slate-400">Buyer</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {order.buyerInfo?.name}
                    </p>
                    <p className="break-all text-slate-600">
                      {order.buyerInfo?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Ship to</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {order.shippingAddress?.name}
                    </p>
                    <p className="text-slate-600">
                      {order.shippingAddress?.phone}
                    </p>
                    <p className="text-slate-600">
                      {order.shippingAddress?.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Payment</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                {actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    {actions.map((action) => (
                      <button
                        key={action.next}
                        type="button"
                        onClick={() => changeStatus(order, action)}
                        disabled={busyId === order._id}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                          toneClass[action.tone]
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;