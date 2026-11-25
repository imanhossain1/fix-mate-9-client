const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

// ========================================
// 1. PUBLIC / COMMON APIs
// ========================================

// // Get All Services
// export const getServices = async () => {
//   const res = await fetch(`${API_URL}/services`, {
//     cache: "no-store",
//   });

//   const data = await parseJsonSafe(res);

//   if (!res.ok) {
//     throw new Error(data?.message || "Failed to fetch services");
//   }

//   return data;
// };

// Get All Services (supports optional filters: category, search, serviceMode, sort)
export const getServices = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "All") {
    params.set("category", filters.category);
  }
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.serviceMode) {
    params.set("serviceMode", filters.serviceMode);
  }
  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const queryString = params.toString();
  const url = `${API_URL}/services${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch services");
  }

  return data;
};

// Get Single Service by ID
export const getSingleService = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch service details");
  }

  return data;
};

// ========================================
// 2. CUSTOMER APIs
// ========================================

// Customer: Create New Booking
export const createBooking = async (bookingData) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to create booking");
  }

  return data;
};

// Customer: Get My Bookings by Email
export const getCustomerBookings = async (email) => {
  const res = await fetch(
    `${API_URL}/bookings/customer/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load your bookings");
  }

  return data;
};

// ========================================
// 3. TECHNICIAN APIs
// ========================================

// Technician: Add New Service
export const apiAddServiceFunction = async (serviceData) => {
  const res = await fetch(`${API_URL}/add-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to add service");
  }

  return data;
};

// Technician: Get My Services by Email
export const getTechnicianServices = async (email) => {
  const res = await fetch(
    `${API_URL}/services/technician/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load my services");
  }

  return data;
};

// Technician: Update My Service
export const updateServiceById = async (id, updatedData) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update service");
  }

  return data;
};

// Technician: Delete My Service
export const deleteServiceById = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete service");
  }

  return data;
};

// Technician: Get Assigned Booking Requests
export const getTechnicianBookings = async (email) => {
  const res = await fetch(
    `${API_URL}/bookings/technician/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load booking requests");
  }

  return data;
};

// Technician: Update Booking Status (Accept / Reject / Start Work / Complete)
export const updateBookingStatus = async (id, status, extra = {}) => {
  const res = await fetch(`${API_URL}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, ...extra }),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update booking status");
  }

  return data;
};

// ========================================
// 4. ADMIN APIs
// ========================================

// Admin: Get All Users
export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get users");
  }

  return data;
};

// Admin: Get All Services
export const getAdminServices = async () => {
  const res = await fetch(`${API_URL}/admin/services`, {
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get services");
  }

  return data;
};

// Admin: Approve or Reject Service
export const updateServiceApproval = async (id, approvalStatus) => {
  const res = await fetch(`${API_URL}/admin/services/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ approvalStatus }),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update service status");
  }

  return data;
};

// Admin: Get All Bookings
export const getAdminBookings = async () => {
  const res = await fetch(`${API_URL}/admin/bookings`, {
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get bookings");
  }

  return data;
};

// Admin: Update User Role
export const updateUserRole = async (userId, role, adminEmail) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, adminEmail }),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update user role");
  }

  return data;
};



// Update Logged-in User Profile (Customer / Technician / Admin)
export const updateUserProfile = async (profileData) => {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update profile");
  }

  return data;
};