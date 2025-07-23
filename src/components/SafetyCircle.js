import React, { useState, useEffect } from "react";
import {
  addSafetyContact,
  getSafetyContacts,
  deleteSafetyContact,
} from "../utils/api";
import { Users, UserPlus, Phone, Trash2, Shield, User, AlertCircle, CheckCircle } from 'lucide-react';

const SafetyCircle = () => {
  const user_email = localStorage.getItem("user_email");
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", number: "" });
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    if (!user_email) return;
    try {
      const data = await getSafetyContacts(user_email);
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.number) return;
    if (!/^\d{10}$/.test(form.number)) {
      alert("Phone number must be 10 digits.");
      return;
    }
    if (contacts.length >= 5) {
      alert("You can add up to 5 contacts only.");
      return;
    }

    setLoading(true);
    try {
      await addSafetyContact({
        user_email,
        contact_name: form.name,
        contact_number: form.number,
      });
      setForm({ name: "", number: "" });
      fetchContacts();
    } catch (error) {
      console.error("Failed to add contact:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSafetyContact(user_email, id);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Add Contact Section */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mr-3">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Add Trusted Contact</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-pink-500" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Contact Name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-purple-500" />
            </div>
            <input
              type="text"
              name="number"
              placeholder="Phone Number"
              value={form.number}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`py-3 px-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading 
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Add Contact</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety Circle Section */}
      <div className="bg-white/80 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Safety Circle</h3>
                <p className="text-white/90">Your trusted emergency contacts</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{contacts.length}/5</div>
              <div className="text-sm text-white/80">contacts</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No contacts added yet</h4>
              <p className="text-gray-600 mb-4">Add emergency contacts who will receive SOS alerts</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>Add up to 5 trusted contacts for maximum safety</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{contact.name}</h4>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono text-gray-700">{contact.number}</span>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyCircle;