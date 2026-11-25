"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES = ["All", "Home Visit", "Shop Drop-off"];

export default function ServicesFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const category = searchParams.get("category") || "All";
  const serviceMode = searchParams.get("serviceMode") || "All";
  const sort = searchParams.get("sort") || "newest";

  function updateQuery(nextValues) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value || value === "All" || value === "newest") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryStr = params.toString();
    router.push(queryStr ? `/services?${queryStr}` : "/services");
    router.refresh();
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateQuery({ search: search.trim() });
  }

  function handleReset() {
    setSearch("");
    router.push("/services");
    router.refresh();
  }

  return (
    <div className="mb-8 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search by title or category */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 lg:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => updateQuery({ category: e.target.value })}
          className="select select-bordered w-full"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* Service Mode Filter */}
        <select
          value={serviceMode}
          onChange={(e) => updateQuery({ serviceMode: e.target.value })}
          className="select select-bordered w-full"
        >
          {SERVICE_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode === "All" ? "All Modes" : mode}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          className="select select-bordered w-full"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {(search || category !== "All" || serviceMode !== "All" || sort !== "newest") && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-ghost btn-xs text-error"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}