



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

// Get All Services
export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch services");
  }

  return data;
};

// Update Service / Availability
export const updateServiceById = async (id, payload) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update service");
  }

  return data;
};

// Delete Service
export const deleteServiceById = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete service");
  }

  return data;
};
