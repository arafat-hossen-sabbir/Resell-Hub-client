import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  ClipboardCheck,
  CreditCard,
  Heart,
  LayoutDashboard,
  Package,
  PlusCircle,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import api from "../api/axios";
import { getStoredUser } from "../api/session";

const buyerMenu = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Orders", path: "/dashboard/orders", icon: ShoppingBag },
  { name: "Payments", path: "/dashboard/payments", icon: CreditCard },
  { name: "Wishlist", path: "/dashboard/wishlist", icon: Heart },
];

const sellerMenu = [
  { name: "Add Product", path: "/dashboard/add-product", icon: PlusCircle },
  { name: "My Products", path: "/dashboard/products", icon: Package },
  { name: "Sales Orders", path: "/dashboard/sales", icon: Receipt },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
];

const startSellingMenu = [
  { name: "Start Selling", path: "/dashboard/products", icon: Store },
];

const adminMenu = [
  { name: "Admin Overview", path: "/dashboard/admin", icon: ShieldCheck },
  {
    name: "Review Products",
    path: "/dashboard/admin/products",
    icon: ClipboardCheck,
  },
  { name: "Manage Users", path: "/dashboard/admin/users", icon: Users },
  { name: "All Orders", path: "/dashboard/admin/orders", icon: Receipt },
  { name: "Transactions", path: "/dashboard/admin/payments", icon: Wallet },
  {
    name: "Platform Analytics",
    path: "/dashboard/admin/analytics",
    icon: TrendingUp,
  },
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
          end={path === "/dashboard" || path === "/dashboard/admin"}
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
  const isAdmin = profile?.role === "admin";

  return (
    <section className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 lg:min-h-[calc(100vh-64px)] lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 font-bold text-white">
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                (profile?.name || "?").slice(0, 1).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {profile?.name || "Dashboard"}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {profile?.role || "member"}
              </p>
            </div>
          </div>

          <MenuGroup title="Buying" items={buyerMenu} />
          <MenuGroup
            title="Selling"
            items={isSeller ? sellerMenu : startSellingMenu}
          />
          {isAdmin && <MenuGroup title="Administration" items={adminMenu} />}
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
