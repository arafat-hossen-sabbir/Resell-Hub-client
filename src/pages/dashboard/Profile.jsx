import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/format";
import { showError, toast } from "../../utils/notify";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Profile = () => {
  const { profile, setProfile, ready } = useOutletContext();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    photo: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        photo: profile.photo || "",
      });
    }
  }, [profile]);

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.patch("/users/me", form);
      setProfile(data.user);
      toast("Profile updated");
    } catch (err) {
      showError(getErrorMessage(err, "Your profile could not be saved."));
    } finally {
      setSaving(false);
    }
  };

  if (!ready || !profile) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Profile Settings
      </h1>
      <p className="mt-2 text-slate-500">Update your personal information.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-xl font-bold text-white">
            {form.photo ? (
              <img
                src={form.photo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (form.name || "?").slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{profile.email}</p>
            <p className="text-sm capitalize text-slate-500">
              {profile.role} account
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Dhaka"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Photo link
          </label>
          <input
            type="url"
            value={form.photo}
            onChange={(e) => update("photo", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
