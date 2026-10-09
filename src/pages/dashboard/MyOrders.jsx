import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Eye, XCircle } from "lucide-react";
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

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/orders/my-orders")
      .then(({ data }) => {
        if (active) setOrders(data.orders);
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
  }, []);

  const handleCancel = async (id) => {
    const confirmed = await confirmAction({
      title: "Cancel this order?",
      text: "Orders can only be cancelled before processing starts.",
      confirmText: "Yes, cancel order",
    });

    if (!confirmed) return;

    setCancellingId(id);

    try {
      await api.patch(`/orders/${id}/cancel`);

      setOrders((current) =>
        current.map((order) =>
          order._id === id ? { ...order, orderStatus: "Cancelled" } : order,
        ),
      );
      toast("Order cancelled");
    } catch (err) {
      showError(getErrorMessage(err, "Unable to cancel the order."));
    } finally {
      setCancellingId(null);
    }
  };

  const visibleOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
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
        My Orders
      </h1>
      <p className="mt-2 text-slate-500">Track and manage your purchases.</p>

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
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-500">
            {orders.length === 0
              ? "You haven't placed any orders yet."
              : `No ${filter.toLowerCase()} orders.`}
          </p>

          {orders.length === 0 && (
            <Link
              to="/products"
              className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Browse Products
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleOrders.map((order) => {
            const open = openId === order._id;
            const canCancel = ["Pending", "Accepted"].includes(
              order.orderStatus,
            );

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

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        orderStatusStyles[order.orderStatus] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : order._id)}
                      aria-label="Order details"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition ${open ? "rotate-180" : ""}`}
                      />
                    </button>

                    <Link
                      to={`/products/${order.productId}`}
                      title="View product"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                    >
                      <Eye size={18} />
                    </Link>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        title="Cancel order"
                        className="rounded-lg border border-slate-200 p-2 text-rose-500 hover:border-rose-300 disabled:opacity-50"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {open && (
                  <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-slate-400">Shipping to</p>
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

                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400">Seller</p>
                        <p className="mt-1 font-medium text-slate-900">
                          {order.sellerInfo?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Payment</p>
                        <p className="mt-1 font-medium text-slate-900">
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
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

export default MyOrders;
