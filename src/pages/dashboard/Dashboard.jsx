import { DollarSign, Heart, Package, ShoppingBag } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const stats = [
  { title: "Total Products", value: "24", icon: Package },
  { title: "Total Orders", value: "12", icon: ShoppingBag },
  { title: "Wishlist Items", value: "8", icon: Heart },
  { title: "Total Revenue", value: "৳85,500", icon: DollarSign },
];

const Dashboard = () => {
  const { user } = useAuth();
  const name = user?.displayName || user?.name || "there";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Welcome back, {name}
      </h1>
      <p className="mt-2 text-slate-500">
        Here is an overview of your marketplace activity.
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-800">New order received</p>
              <p className="mt-1 text-sm text-slate-500">
                iPhone 13 order is waiting for confirmation.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-800">Product added</p>
              <p className="mt-1 text-sm text-slate-500">
                Sony headphones were added to your marketplace.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Add Product
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
