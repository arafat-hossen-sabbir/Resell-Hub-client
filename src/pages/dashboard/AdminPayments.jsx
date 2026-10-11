import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { CreditCard, Search, ShieldAlert, Wallet } from "lucide-react";
import api from "../../api/axios";
import Pager from "../../components/dashboard/Pager";
import { formatDate, formatPrice, getErrorMessage } from "../../utils/format";
import { paymentStatusStyles } from "./PaymentHistory";

const FILTERS = ["All", "Paid", "Pending", "Failed", "Needs refund"];

const AdminPayments = () => {
  const { profile, ready } = useOutletContext();
  const isAdmin = profile?.role === "admin";

  const [status, setStatus] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    payments: [],
    pagination: null,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !isAdmin) return undefined;

    let active = true;
    setLoading(true);

    api
      .get("/payment-history/all", { params: { status, search, page } })
      .then(({ data: res }) => {
        if (active) {
          setData(res);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Payments could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isAdmin, status, search, page]);

  if (ready && !isAdmin) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <ShieldAlert className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 text-slate-500">
          This area is only available to administrators.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { payments, pagination, revenue } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Payments
      </h1>
      <p className="mt-2 text-slate-500">
        Monitor every transaction on the platform.
      </p>

      <div className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Total revenue (paid)</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatPrice(revenue)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
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

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
          className="relative w-full lg:w-80"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search transaction ID or product..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </form>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      ) : payments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <CreditCard className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">No transactions found.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {payment.productTitle}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(payment.createdAt)} · Order #
                  {String(payment.orderId).slice(-6).toUpperCase()}
                </p>
                <p className="break-all font-mono text-xs text-slate-400">
                  {payment.transactionId}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">
                  {formatPrice(payment.amountBdt)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    paymentStatusStyles[payment.status] ||
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pager pagination={pagination} onChange={setPage} />
    </div>
  );
};

export default AdminPayments;
