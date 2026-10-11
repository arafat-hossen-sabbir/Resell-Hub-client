import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../../api/axios";
import PageLoader from "../../components/PageLoader";
import { formatPrice, getErrorMessage } from "../../utils/format";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const started = useRef(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!sessionId) {
      setError("No payment session was found.");
      setLoading(false);
      return;
    }

    api
      .post("/payments/confirm", { sessionId })
      .then(({ data }) => setResult(data))
      .catch((err) =>
        setError(getErrorMessage(err, "The payment could not be confirmed.")),
      )
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <PageLoader label="Confirming your payment..." />;

  if (error || !result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-900">Payment problem</p>
        <p className="mt-2 text-slate-500">{error}</p>
        <Link
          to="/dashboard/orders"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  const { payment, order, refundNeeded } = result;

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto text-emerald-500" size={56} />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            {refundNeeded ? "Payment needs a refund" : "Payment successful"}
          </h1>
          <p className="mt-2 text-slate-500">
            {refundNeeded
              ? "Your order was already cancelled. Please contact support for a refund."
              : "Thank you! Your order has been paid."}
          </p>

          <dl className="mt-8 space-y-3 rounded-xl bg-slate-50 p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Product</dt>
              <dd className="text-right font-medium">{order.productTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Quantity</dt>
              <dd className="font-medium">{order.quantity}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Amount paid</dt>
              <dd className="font-bold text-emerald-600">
                {formatPrice(payment.amountBdt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Transaction ID</dt>
              <dd className="break-all text-right font-mono text-xs">
                {payment.transactionId}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Date</dt>
              <dd className="font-medium">
                {new Date(payment.createdAt).toLocaleString("en-GB")}
              </dd>
            </div>
          </dl>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link
              to="/dashboard/orders"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View Order Details
            </Link>
            <Link
              to="/dashboard/orders"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Go to My Orders
            </Link>
            <Link
              to="/products"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
