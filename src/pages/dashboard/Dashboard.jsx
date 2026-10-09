import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Truck, Wallet } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  formatPrice,
  getErrorMessage,
  orderStatusStyles,
} from "../../utils/format";

const ACTIVE_STATUSES = ["Pending", "Accepted", "Processing", "Shipped"];
const NOT_SPENT = ["Cancelled", "Rejected"];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ orders: [], wishlist: [], profile: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get("/orders/my-orders"),
      api.get("/wishlist"),
      api.get("/users/me"),
    ])
      .then(([orders, wishlist, profile]) => {
        if (!active) return;
        setData({
          orders: orders.data.orders,
          wishlist: wishlist.data.wishlist,
          profile: profile.data.user,
        });
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Dashboard data could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const { orders, wishlist, profile } = data;
  const name = profile?.name || user?.displayName || "there";

  const totalSpent = orders
    .filter((order) => !NOT_SPENT.includes(order.orderStatus))
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const activeOrders = orders.filter((order) =>
    ACTIVE_STATUSES.includes(order.orderStatus),
  ).length;

  const cards = [
    { title: "Total Orders", value: orders.length, icon: ShoppingBag },
    { title: "Active Orders", value: activeOrders, icon: Truck },
    { title: "Wishlist Items", value: wishlist.length, icon: Heart },
    { title: "Total Spent", value: formatPrice(totalSpent), icon: Wallet },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-72 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
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
        Welcome back, {name}
      </h1>
      <p className="mt-2 text-slate-500">
        Here is an overview of your marketplace activity.
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

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Purchases
            </h2>
            <Link
              to="/dashboard/orders"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
              <p className="text-slate-500">You have no purchases yet.</p>
              <Link
                to="/products"
                className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center gap-4 py-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
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
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {formatPrice(order.totalPrice)}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Name</dt>
              <dd className="font-medium text-slate-900">{profile?.name}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Email</dt>
              <dd className="break-all font-medium text-slate-900">
                {profile?.email}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Role</dt>
              <dd className="font-medium capitalize text-slate-900">
                {profile?.role}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Phone</dt>
              <dd className="font-medium text-slate-900">
                {profile?.phone || "Not added"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Location</dt>
              <dd className="font-medium text-slate-900">
                {profile?.location || "Not added"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
