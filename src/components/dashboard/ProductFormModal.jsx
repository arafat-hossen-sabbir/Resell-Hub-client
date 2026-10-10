import { useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios";
import { categories } from "../../data/categories";
import { getErrorMessage } from "../../utils/format";

const conditions = ["Like New", "Good", "Fair"];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Field = ({ label, children }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
  </div>
);

const ProductFormModal = ({ product, onClose, onSaved }) => {
  const editing = Boolean(product);

  const categoryOptions =
    product?.category && !categories.includes(product.category)
      ? [product.category, ...categories]
      : categories;

  const [form, setForm] = useState({
    title: product?.title || "",
    category: product?.category || categories[0],
    condition: product?.condition || conditions[1],
    price: product?.price ?? "",
    stock: product?.stock ?? 1,
    location: product?.location || "",
    phone: product?.sellerInfo?.phone || "",
    images: (product?.images || []).join("\n"),
    description: product?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const images = form.images
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (images.length > 5) {
      setError("You can add up to 5 images.");
      return;
    }

    if (images.some((url) => !/^https?:\/\//i.test(url))) {
      setError("Every image must be a link starting with http:// or https://");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < (editing ? 0 : 1)) {
      setError("Enter a valid stock quantity.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      condition: form.condition,
      price,
      stock,
      location: form.location.trim(),
      phone: form.phone.trim(),
      images,
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      const { data } = editing
        ? await api.patch(`/products/${product._id}`, payload)
        : await api.post("/products", payload);

      onSaved(data.product, !editing);
    } catch (err) {
      setError(getErrorMessage(err, "The product could not be saved."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editing ? "Edit product" : "Add a new product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the details of your listing."
                : "New listings are reviewed by an admin before they go live."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Title">
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Used Dell Inspiron 15 Laptop"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            >
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Condition">
            <select
              value={form.condition}
              onChange={(e) => update("condition", e.target.value)}
              className={inputClass}
            >
              {conditions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Price (৳)">
            <input
              type="number"
              required
              min={1}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Stock">
            <input
              type="number"
              required
              min={editing ? 0 : 1}
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Dhaka"
              className={inputClass}
            />
          </Field>

          <Field label="Contact phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Image links (one per line, up to 5)">
              <textarea
                rows={3}
                value={form.images}
                onChange={(e) => update("images", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the condition, age, and anything included."
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Submit product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormModal;
