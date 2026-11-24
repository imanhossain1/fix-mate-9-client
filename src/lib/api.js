



const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Add Service
export const apiAddServiceFunction = async (serviceData) => {
  const res = await fetch(`${API_URL}/add-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add service");
  }

  return data;
};

// Get All Services load data
export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);

  const data = await res.json();
 console.log('api responsense', data);
 
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch services");
  }

  return data;
};


/// Get Single Service
export const getSingleService = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Create Booking
export const createBooking = async (bookingData) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Get all services for Admin
export const getAdminServices = async () => {
    const res = await fetch(`${API_URL}/admin/services`);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to get services");
    }

    return data;
};


// admin Approve or Reject service
export const updateServiceApproval = async (id, approvalStatus) => {
    const res = await fetch(
        `${API_URL}/admin/services/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ approvalStatus }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to update service");
    }

    return data;
};

// ========================================
// Admin - Get All Bookings
// ========================================

export const getAdminBookings = async () => {
  const res = await fetch(`${API_URL}/admin/bookings`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get bookings");
  }

  return data;
};



// ========================================
// Admin - Get All Users
// ========================================

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/users`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get users");
  }

  return data;
};
