import React, { useState, useEffect } from "react";

const Settings = () => {
  const [secretKeyword, setSecretKeyword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sos_keyword") || "help me sherox";
    setSecretKeyword(saved);
  }, []);

  const handleSave = () => {
    if (secretKeyword.trim().length < 3) {
      alert("Keyword must be at least 3 characters long.");
      return;
    }
    localStorage.setItem("sos_keyword", secretKeyword.toLowerCase().trim());
    alert("Secret keyword saved successfully!");
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h2 className="text-lg font-bold mb-4">🛡️ SOS Settings</h2>
      <label className="block mb-2 font-medium">Enter Secret Keyword:</label>
      <input
        type="text"
        value={secretKeyword}
        onChange={(e) => setSecretKeyword(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Keyword
      </button>
    </div>
  );
};

export default Settings;
