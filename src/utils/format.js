export const formatPrice = (value) =>
  `৳ ${Number(value || 0).toLocaleString("en-US")}`;

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export const orderStatusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Accepted: "bg-sky-50 text-sky-700",
  Processing: "bg-indigo-50 text-indigo-700",
  Shipped: "bg-violet-50 text-violet-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-slate-100 text-slate-600",
  Rejected: "bg-rose-50 text-rose-700",
};

export const productStatusStyles = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-rose-50 text-rose-700",
};
