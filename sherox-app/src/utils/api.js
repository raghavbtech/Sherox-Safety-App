export const calculateSafeScore = async ({ lighting, crimes }) => {
  const safescore = Math.max(0, Math.min(10, lighting * 1.2 - crimes * 0.8));
  return { safescore: Math.round(safescore * 10) / 10 };
};


export const logVehicleScan = async (data) => {
  try {
    console.log("Logging scan to backend:", data);
    // Later you can POST this to Flask API
    // await fetch("/api/log-scan", { method: "POST", ... });
    return { success: true };
  } catch (error) {
    console.error("Failed to log vehicle scan", error);
    return { success: false };
  }
};
export const addSafetyContact = async (contactData) => {
  const res = await fetch("http://localhost:5000/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });

  if (!res.ok) {
    throw new Error("Failed to add contact");
  }

  return res.json();
};

export const deleteSafetyContact = async (user_email, contactId) => {
  const res = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_email }),
  });

  if (!res.ok) throw new Error("Failed to delete contact");
};

export const getSafetyContacts = async (user_email) => {
  const res = await fetch(`http://localhost:5000/api/contacts?user_email=${user_email}`);
  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }
  return res.json();
};
