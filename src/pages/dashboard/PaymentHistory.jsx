import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import api from "../../api/axios";
import { formatDate, formatPrice, getErrorMessage } from "../../utils/format";

export const paymentStatusStyles = {
  Paid: "bg-emerald-50 text-emerald-700",
  Failed: "bg-rose-50 text-rose-700",
  Pending: "bg-amber-50 text-amber-700",
  "Needs refund": "bg-rose-50 text-rose-700",
};

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get("/payment-history/my-payments")
      .then(({ data }) => {
        if (active) setPayments(data.payments);
      })
      .catch((err) => {
        if (active) {
          setError(
            getErrorMessage(err, "Payment history could not be loaded."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-2xl bg-slate-200"
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

  const total = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amountBdt, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Payment History
      </h1>
      <p className="mt-2 text-slate-500">
        All your transactions. Total paid: {formatPrice(total)}
      </p>

      {payments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <CreditCard className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">You have not made any payments.</p>
          <Link
            to="/dashboard/orders"
            className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Go to my orders
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {payment.productImage ? (
                  <img
                    src={payment.productImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {payment.productTitle}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(payment.createdAt)} · {payment.method || "Card"}
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
    </div>
  );
};

export default PaymentHistory;
