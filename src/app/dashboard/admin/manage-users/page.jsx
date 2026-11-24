
"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  // Count users by role
  const countRole = (role) => {
    return users.filter(
      (user) => user.role?.toLowerCase() === role
    ).length;
  };

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const userRole = user.role?.toLowerCase() || "";

    const matchesRole =
      filter === "all" || userRole === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
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
            <h1 className="text-3xl font-bold">
              Manage Users
            </h1>

            <p className="mt-2 text-sm text-base-content/60">
              Monitor all registered customers and technicians on FixMate.
            </p>
          </div>

          <button
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
              <>
                ↻ Refresh Users
              </>
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Users */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Total Users
              </p>

              <h2 className="text-3xl font-bold">
                {users.length}
              </h2>

              <p className="text-xs text-base-content/50">
                All registered users
              </p>
            </div>
          </div>

          {/* Customers */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Customers
              </p>

              <h2 className="text-3xl font-bold text-info">
                {countRole("customer")}
              </h2>

              <p className="text-xs text-base-content/50">
                Registered customers
              </p>
            </div>
          </div>

          {/* Technicians */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Technicians
              </p>

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
                onClick={() => setFilter(role)}
                className={`btn btn-sm capitalize ${
                  filter === role
                    ? "btn-primary"
                    : "btn-outline"
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
            <h2 className="text-xl font-bold">
              User Records
            </h2>

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
              <div className="mb-3 text-5xl">
                👥
              </div>

              <h3 className="text-xl font-bold">
                No users found
              </h3>

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
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id || user.email || index}>

                      <td>{index + 1}</td>

                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-10 rounded-full bg-primary text-primary-content">
                              <span>
                                {(user.name || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <span className="font-semibold">
                            {user.name || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {user.email || "N/A"}
                      </td>

                      <td>
                        <span
                          className={`badge capitalize ${
                            user.role?.toLowerCase() === "admin"
                              ? "badge-secondary"
                              : user.role?.toLowerCase() === "technician"
                              ? "badge-success"
                              : "badge-info"
                          }`}
                        >
                          {user.role || "N/A"}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* Admin Note */}
        <div className="mt-6 rounded-xl border border-base-300 bg-base-100 p-5">
          <h3 className="font-bold">
            User Monitoring
          </h3>

          <p className="mt-1 text-sm text-base-content/60">
            Admin can monitor registered customers and technicians.
            User information is displayed from the FixMate database.
          </p>
        </div>

      </div>
    </div>
  );
}
