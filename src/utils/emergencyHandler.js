// src/utils/emergencyHandler.js
export const triggerEmergency = ({ plateNumber, source, safescore, location }) => {
  console.log("🚨 Emergency Triggered", {
    plateNumber,
    source,
    safescore,
    location,
  });
  alert("🚨 Emergency Triggered! Plate: " + plateNumber);
};



export async function sendSOSToTrustedContacts(user_email, message) {
  try {
    const res = await fetch("http://localhost:5000/api/contacts/send-sos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email, message }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send SOS");
    return data;
  } catch (err) {
    console.error("❌ SOS Error:", err);
    throw err;
  }
}
