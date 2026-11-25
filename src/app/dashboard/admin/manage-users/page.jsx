"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const currentAdminEmail = (session?.user?.email || "").trim().toLowerCase();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Helper: normalize role cleanly
  const normalizeRole = (role) => (role || "").toString().trim().toLowerCase();

  // Load all users from backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Users loading error:", error);
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (targetUser, newRole) => {
    const cleanNewRole = normalizeRole(newRole);
    const userId = targetUser._id;
    const isSelf =
      currentAdminEmail &&
      (targetUser.email || "").trim().toLowerCase() === currentAdminEmail;

    if (isSelf) {
      toast.error("You cannot change your own role");
      return;
    }

    if (!userId || normalizeRole(targetUser.role) === cleanNewRole) return;

    try {
      setUpdatingId(userId);
      await updateUserRole(userId, cleanNewRole, currentAdminEmail);

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: cleanNewRole } : u))
      );

      toast.success(`Role updated to ${cleanNewRole}`);
    } catch (error) {
      console.error("Role update error:", error);
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatJoinedDate = (user) => {
    const rawDate = user.createdAt || user.joinedAt;
    if (!rawDate) return "N/A";
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const countRole = (role) => {
    const target = normalizeRole(role);
    return users.filter((user) => normalizeRole(user.role) === target).length;
  };

  const filteredUsers = users.filter((user) => {
    const userRole = normalizeRole(user.role);
    const activeFilter = normalizeRole(filter);
    const searchText = search.trim().toLowerCase();

    const matchesRole = activeFilter === "all" || userRole === activeFilter;

    const matchesSearch =
      !searchText ||
      (user.name || "").toLowerCase().includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText) ||
      userRole.includes(searchText);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="mt-2 text-sm text-base-content/60">
              Monitor all registered users and manage roles on FixMate.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading
              </>
            ) : (
              <>↻ Refresh Users</>
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Total Users</p>
              <h2 className="text-3xl font-bold">{users.length}</h2>
              <p className="text-xs text-base-content/50">
                All registered users
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Customers</p>
              <h2 className="text-3xl font-bold text-info">
                {countRole("customer")}
              </h2>
              <p className="text-xs text-base-content/50">
                Registered customers
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Technicians</p>
              <h2 className="text-3xl font-bold text-success">
                {countRole("technician")}
              </h2>
              <p className="text-xs text-base-content/50">
                Registered technicians
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-base-100 p-5 shadow lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full lg:max-w-sm"
          />

          <div className="flex flex-wrap gap-2">
            {["all", "customer", "technician", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFilter(role)}
                className={`btn btn-sm capitalize cursor-pointer ${
                  filter === role ? "btn-primary" : "btn-outline"
                }`}
              >
                {role === "all" ? "All Users" : role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl bg-base-100 shadow">
          <div className="border-b border-base-300 p-5">
            <h2 className="text-xl font-bold">User Records</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-3 text-5xl">👥</div>
              <h3 className="text-xl font-bold">No users found</h3>
              <p className="mt-2 text-sm text-base-content/60">
                No users match your search or selected role.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Role</th>
                    <th>Change Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, index) => {
                    const userRole = normalizeRole(user.role);
                    const isSelf =
                      currentAdminEmail &&
                      (user.email || "").trim().toLowerCase() ===
                        currentAdminEmail;
                    const isBusy = updatingId === user._id;

                    return (
                      <tr key={user._id || user.email || index}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full bg-base-300">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name || "User"}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary font-bold text-primary-content">
                                  {(user.name || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="font-semibold">
                          {user.name || "N/A"}
                          {isSelf && (
                            <span className="badge badge-outline badge-xs ml-2">
                              You
                            </span>
                          )}
                        </td>

                        <td>{user.email || "N/A"}</td>

                        <td className="whitespace-nowrap text-sm">
                          {formatJoinedDate(user)}
                        </td>

                        <td>
                          <span
                            className={`badge capitalize ${
                              userRole === "admin"
                                ? "badge-secondary"
                                : userRole === "technician"
                                ? "badge-success"
                                : "badge-info"
                            }`}
                          >
                            {userRole || "N/A"}
                          </span>
                        </td>

                        <td>
                          <select
                            className="select select-bordered select-xs capitalize"
                            value={userRole || "customer"}
                            disabled={isSelf || isBusy}
                            onChange={(e) =>
                              handleRoleChange(user, e.target.value)
                            }
                          >
                            <option value="customer">customer</option>
                            <option value="technician">technician</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Note */}
        <div className="mt-6 rounded-xl border border-base-300 bg-base-100 p-5">
          <h3 className="font-bold">Role Management Rule</h3>
          <p className="mt-1 text-sm text-base-content/60">
            Admin can switch any other user between customer, technician, and
            admin roles. For safety, you cannot change your own role.
          </p>
        </div>
      </div>
    </div>
  );
}