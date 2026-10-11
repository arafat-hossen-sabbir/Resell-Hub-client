import { useEffect, useState } from "react";
import { Clock3, Package, TrendingUp, Wallet } from "lucide-react";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";

const SellerOverview = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([api.get("/orders/seller-orders"), api.get("/products/my")])
      .then(([orders, products]) => {
        if (active) {
          setData({
            orders: orders.data.orders,
            products: products.data.products,
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return <div className="mt-8 h-28 animate-pulse rounded-2xl bg-slate-200" />;
  }

  const delivered = data.orders.filter((o) => o.orderStatus === "Delivered");

  const cards = [
    { title: "Total Products", value: data.products.length, icon: Package },
    { title: "Total Sales", value: delivered.length, icon: TrendingUp },
    {
      title: "Total Revenue",
      value: formatPrice(delivered.reduce((sum, o) => sum + o.totalPrice, 0)),
      icon: Wallet,
    },
    {
      title: "Pending Orders",
      value: data.orders.filter((o) => o.orderStatus === "Pending").length,
      icon: Clock3,
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">Selling overview</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
    </div>
  );
};

export default SellerOverview;
