export const getServices = async () => {
    const res = await fetch("http://localhost:8000/services");

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return res.json();
};


const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create Repair Request
export const createRepairRequest = async (requestData) => {
    const res = await fetch(`${API_URL}/booking-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Request submission failed");
    }

    return data;
};


// add-services 

export async function apiAddServiceFunction(serviceData) {
  const res = await fetch("http://localhost:5000/add-service", {
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
}