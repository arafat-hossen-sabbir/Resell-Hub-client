import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Heart,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import api from "../api/axios";
import { getStoredUser } from "../api/session";

const buyerMenu = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Orders", path: "/dashboard/orders", icon: ShoppingBag },
  { name: "Wishlist", path: "/dashboard/wishlist", icon: Heart },
];

const sellerMenu = [
  { name: "My Products", path: "/dashboard/products", icon: Package },
  { name: "Sales Orders", path: "/dashboard/sales", icon: Receipt },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
];

const startSellingMenu = [
  { name: "Start Selling", path: "/dashboard/products", icon: Store },
];

const accountMenu = [
  { name: "Profile Settings", path: "/dashboard/profile", icon: Settings },
];

const MenuGroup = ({ title, items }) => (
  <div className="mt-5 first:mt-0">
    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {title}
    </p>

    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
      {items.map(({ name, path, icon: Icon }) => (
        <NavLink
          key={name}
          to={path}
          end={path === "/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
            }`
          }
        >
          <Icon size={19} />
          <span>{name}</span>
        </NavLink>
      ))}
    </nav>
  </div>
);

const DashboardLayout = () => {
  const [profile, setProfile] = useState(getStoredUser());
  const [ready, setReady] = useState(Boolean(getStoredUser()));

  useEffect(() => {
    let active = true;

    api
      .get("/users/me")
      .then(({ data }) => {
        if (active) setProfile(data.user);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const isSeller = ["seller", "admin"].includes(profile?.role);

  return (
    <section className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 lg:min-h-[calc(100vh-64px)] lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your marketplace activity
            </p>
          </div>

          <MenuGroup title="Buying" items={buyerMenu} />
          <MenuGroup
            title="Selling"
            items={isSeller ? sellerMenu : startSellingMenu}
          />
          <MenuGroup title="Account" items={accountMenu} />
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet context={{ profile, setProfile, ready }} />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
