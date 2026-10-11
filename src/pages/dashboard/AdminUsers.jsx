import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Search, ShieldAlert, Trash2, Users } from "lucide-react";
import api from "../../api/axios";
import Pager from "../../components/dashboard/Pager";
import { formatDate, getErrorMessage } from "../../utils/format";
import { confirmAction, showError, toast } from "../../utils/notify";

const ROLES = ["All", "buyer", "seller", "admin"];

const AdminUsers = () => {
  const { profile, ready } = useOutletContext();
  const isAdmin = profile?.role === "admin";

  const [role, setRole] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState({ users: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!ready || !isAdmin) return undefined;

    let active = true;
    setLoading(true);

    api
      .get("/admin/users", { params: { role, search, page } })
      .then(({ data: res }) => {
        if (active) {
          setData({ users: res.users, pagination: res.pagination });
          setError("");
        }
      })
      .catch((err) => {
        if (active)
          setError(getErrorMessage(err, "Users could not be loaded."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isAdmin, role, search, page, reload]);

  const update = async (user, changes) => {
    setBusyId(user._id);

    try {
      await api.patch(`/admin/users/${user._id}`, changes);
      toast("User updated");
      setReload((value) => value + 1);
    } catch (err) {
      showError(getErrorMessage(err, "The user could not be updated."));
    } finally {
      setBusyId(null);
    }
  };

  const toggleBlock = async (user) => {
    const blocking = user.status !== "blocked";

    if (blocking) {
      const confirmed = await confirmAction({
        title: `Block ${user.name}?`,
        text: "They will not be able to use their account until unblocked.",
        confirmText: "Yes, block",
      });

      if (!confirmed) return;
    }

    update(user, { status: blocking ? "blocked" : "active" });
  };

  const remove = async (user) => {
    const confirmed = await confirmAction({
      title: `Delete ${user.name}?`,
      text: "This permanently removes the account.",
      confirmText: "Yes, delete",
    });

    if (!confirmed) return;

    setBusyId(user._id);

    try {
      await api.delete(`/admin/users/${user._id}`);
      toast("User deleted");
      setReload((value) => value + 1);
    } catch (err) {
      showError(getErrorMessage(err, "The user could not be deleted."));
    } finally {
      setBusyId(null);
    }
  };

  if (ready && !isAdmin) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <ShieldAlert className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 text-slate-500">
          This area is only available to administrators.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { users, pagination } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Manage Users
      </h1>
      <p className="mt-2 text-slate-500">
        Change roles, block or delete accounts that break the rules.
      </p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {ROLES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setRole(item);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                role === item
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
          className="relative w-full lg:w-72"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </form>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
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
      ) : users.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Users className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">No users found.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {users.map((user) => {
            const isSelf = user._id === profile?._id;
            const blocked = user.status === "blocked";

            return (
              <div
                key={user._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-slate-900">
                      {user.name}
                    </p>
                    {isSelf && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        You
                      </span>
                    )}
                    {blocked && (
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="break-all text-sm text-slate-500">
                    {user.email}
                  </p>
                  {user.createdAt && (
                    <p className="mt-1 text-xs text-slate-400">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={user.role}
                    disabled={isSelf || busyId === user._id}
                    onChange={(e) => update(user, { role: e.target.value })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    <option value="buyer">buyer</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => toggleBlock(user)}
                    disabled={isSelf || busyId === user._id}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                      blocked
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "border border-rose-200 text-rose-600 hover:bg-rose-50"
                    }`}
                  >
                    {blocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(user)}
                    disabled={isSelf || busyId === user._id}
                    aria-label="Delete user"
                    className="rounded-xl border border-slate-200 p-2 text-rose-500 hover:border-rose-300 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pager pagination={pagination} onChange={setPage} />
    </div>
  );
};

export default AdminUsers;
