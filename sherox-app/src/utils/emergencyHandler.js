import API_BASE_URL from "../apiConfig";
import { getAuthHeaders, handleAuthResponse } from "./api";

export const triggerEmergency = async ({ plateNumber, source = "manual", safescore, location }) => {
  console.log("🚨 Emergency Triggered", {
    plateNumber,
    source,
    safescore,
    location,
  });

  try {
    const res = await fetch(`${API_BASE_URL}/api/emergency-alert`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        plateNumber: plateNumber || "N/A",
        source,
        safescore: safescore || "N/A",
        location: location || {},
      }),
    });
    await handleAuthResponse(res);
  } catch (err) {
    console.warn("Failed to store emergency alert to backend:", err);
  }

  alert("🚨 Emergency Triggered! Plate: " + (plateNumber || "N/A"));
};

export async function sendSOSToTrustedContacts(arg1, arg2) {
  // Support both sendSOSToTrustedContacts(message) and legacy sendSOSToTrustedContacts(user_email, message)
  const message = typeof arg2 === "string" ? arg2 : arg1;
  const plateNumber = localStorage.getItem("last_plate") || undefined;

  try {
    const res = await fetch(`${API_BASE_URL}/api/contacts/send-sos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, plate_number: plateNumber }),
    });

    await handleAuthResponse(res);

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Failed to send SOS");
    return data;
  } catch (err) {
    console.error("❌ SOS Error:", err);
    throw err;
  }
}
