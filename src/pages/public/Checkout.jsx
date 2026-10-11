import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { CreditCard, ShieldCheck } from "lucide-react";
import api from "../../api/axios";
import PageLoader from "../../components/PageLoader";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { confirmAction, showError, toast } from "../../utils/notify";

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (searchParams.get("payment") === "cancelled") {
      toast("Payment was cancelled", "info");
      setSearchParams({}, { replace: true });
    }
  }, []);

  useEffect(() => {
    let active = true;

    api
      .get(`/orders/${orderId}`)
      .then(({ data }) => {
        if (active) setOrder(data.order);
      })
      .catch((err) => {
        if (active)
          setError(getErrorMessage(err, "Order could not be loaded."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  const proceed = async () => {
    setPaying(true);

    try {
      const { data } = await api.post("/payments/session", { orderId });
      window.location.href = data.url;
    } catch (err) {
      showError(getErrorMessage(err, "Could not start the payment."));
      setPaying(false);
    }
  };

  const cancelCheckout = async () => {
    const confirmed = await confirmAction({
      title: "Cancel checkout?",
      text: "Your order will be cancelled and the item released.",
      confirmText: "Yes, cancel",
    });

    if (!confirmed) return;

    setCancelling(true);

    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast("Checkout cancelled");
      navigate("/products");
    } catch (err) {
      showError(getErrorMessage(err, "Could not cancel the order."));
      setCancelling(false);
    }
  };

  if (loading) return <PageLoader label="Preparing checkout..." />;

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-500">{error || "Order not found."}</p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const closed = ["Cancelled", "Rejected"].includes(order.orderStatus);
  const paid = order.paymentStatus === "Paid";
  const unitPrice = order.totalPrice / order.quantity;

  return (
    <section className="bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-500">Review your order before paying.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Order summary</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {order.productImage ? (
                    <img
                      src={order.productImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {order.productTitle}
                  </p>
                  <p className="text-sm text-slate-500">
                    Seller: {order.sellerInfo?.name}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Product price</dt>
                  <dd className="font-medium">{formatPrice(unitPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Quantity</dt>
                  <dd className="font-medium">{order.quantity}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                  <dt className="font-semibold text-slate-900">Total amount</dt>
                  <dd className="font-bold text-emerald-600">
                    {formatPrice(order.totalPrice)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Delivery information
              </h2>
              <p className="mt-3 font-medium text-slate-900">
                {order.shippingAddress?.name}
              </p>
              <p className="text-sm text-slate-600">
                {order.shippingAddress?.phone}
              </p>
              <p className="text-sm text-slate-600">
                {order.shippingAddress?.address}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Amount to pay</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {formatPrice(order.totalPrice)}
              </p>

              {paid ? (
                <Link
                  to="/dashboard/orders"
                  className="mt-6 block rounded-xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white"
                >
                  Already paid. View orders
                </Link>
              ) : closed ? (
                <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  This order is {order.orderStatus.toLowerCase()} and cannot be
                  paid.
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={proceed}
                    disabled={paying}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <CreditCard size={18} />
                    {paying ? "Redirecting to Stripe..." : "Proceed to Payment"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelCheckout}
                    disabled={cancelling || paying}
                    className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel Checkout
                  </button>
                </>
              )}

              <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={15} className="text-emerald-600" />
                Payments are processed securely by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
