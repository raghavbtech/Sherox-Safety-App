import API_BASE_URL from "../apiConfig";

// Helper to get auth headers and handle 401 redirects
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const handleAuthResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_email");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized: Please log in again");
  }
  return res;
};

export const calculateSafeScore = async ({ lighting, crimes }) => {
  const safescore = Math.max(0, Math.min(10, lighting * 1.2 - crimes * 0.8));
  return { safescore: Math.round(safescore * 10) / 10 };
};

export const logVehicleScan = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/log-scan`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    await handleAuthResponse(res);
    if (!res.ok) {
      throw new Error("Failed to log scan");
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to log vehicle scan", error);
    return { success: false };
  }
};

export const addSafetyContact = async (contactData) => {
  const res = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: contactData.name || contactData.contact_name,
      number: contactData.number || contactData.contact_number,
    }),
  });

  await handleAuthResponse(res);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Failed to add contact");
  }

  return res.json();
};

export const deleteSafetyContact = async (arg1, arg2) => {
  // Support both deleteSafetyContact(id) and legacy deleteSafetyContact(user_email, id)
  const contactId = arg2 !== undefined ? arg2 : arg1;

  const res = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleAuthResponse(res);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Failed to delete contact");
  }

  return res.json();
};

export const getSafetyContacts = async () => {
  const res = await fetch(`${API_BASE_URL}/api/contacts`, {
    headers: getAuthHeaders(),
  });

  await handleAuthResponse(res);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Failed to fetch contacts");
  }

  return res.json();
};
