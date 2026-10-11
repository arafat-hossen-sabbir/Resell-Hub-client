import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "../../utils/notify";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const info = [
  { icon: MapPin, label: "Address", value: "Dhaka, Bangladesh" },
  { icon: Phone, label: "Phone", value: "+880 1700-000000" },
  { icon: Mail, label: "Email", value: "support@resellhub.com" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    toast("Thanks! We will get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            We would love to hear from you
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Questions about an order, a listing or your account? Send us a
            message.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {info.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <textarea
              required
              rows={6}
              placeholder="How can we help?"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
