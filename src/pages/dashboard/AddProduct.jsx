import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import api from "../../api/axios";
import { categories } from "../../data/categories";
import { conditions } from "../../data/conditions";
import { getErrorMessage } from "../../utils/format";
import { uploadImage } from "../../utils/upload";
import { showSuccess } from "../../utils/notify";

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

const AddProduct = () => {
  const { profile, ready } = useOutletContext();
  const navigate = useNavigate();
  const isSeller = ["seller", "admin"].includes(profile?.role);

  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    condition: conditions[0],
    price: "",
    stock: 1,
    location: "",
    phone: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const addFiles = (event) => {
    const picked = Array.from(event.target.files || []);
    setFiles((current) => [...current, ...picked].slice(0, 5));
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    setSaving(true);

    try {
      const images = [];
      for (const file of files) {
        images.push(await uploadImage(file));
      }

      await api.post("/products", {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        images,
      });

      await showSuccess(
        "Product submitted",
        "It will appear in the marketplace after an admin approves it.",
      );
      navigate("/dashboard/products");
    } catch (err) {
      setError(
        err.response ? getErrorMessage(err, "Could not save.") : err.message,
      );
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (!isSeller) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-slate-500">
          You need a seller account to add products.
        </p>
        <Link
          to="/dashboard/products"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Start selling
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Add Product
      </h1>
      <p className="mt-2 text-slate-500">
        New listings are reviewed by an admin before they go live.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

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

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
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
                <option key={item}>{item}</option>
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

          <Field label="Stock quantity">
            <input
              type="number"
              required
              min={1}
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
        </div>

        <Field label="Images (up to 5, max 5 MB each)">
          <div className="flex flex-wrap gap-3">
            {previews.map((url, index) => (
              <div
                key={url}
                className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() =>
                    setFiles((current) => current.filter((_, i) => i !== index))
                  }
                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-700 hover:text-rose-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {files.length < 5 && (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-500 hover:text-emerald-600">
                <ImagePlus size={22} />
                <span className="text-xs">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addFiles}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </Field>

        <Field label="Description">
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe the condition, age, and anything included."
            className={inputClass}
          />
        </Field>

        <div className="flex justify-end gap-3">
          <Link
            to="/dashboard/products"
            className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Uploading..." : "Submit product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
