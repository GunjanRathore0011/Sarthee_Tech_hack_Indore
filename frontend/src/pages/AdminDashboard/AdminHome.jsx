import React from "react";
import { Edit, Shield, Key, Bell, Sun, Activity } from "lucide-react";

export default function AdminHome() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src="https://via.placeholder.com/100"
            alt="Admin Avatar"
            className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Rohan Mehta</h2>
            <p className="text-gray-500">Super Admin</p>
            <p className="text-sm text-gray-400">Last login: Aug 12, 2025, 2:45 PM</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
          <Edit size={18} />
          Edit Profile
        </button>
      </div>

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <Shield size={18} /> Personal Information
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Name:</strong> Rohan Mehta</p>
            <p><strong>Email:</strong> rohan.mehta@cybersentinel.com</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
            <p><strong>Department:</strong> Cyber Crime Unit</p>
          </div>
        </div>

        {/* Account & Preferences */}
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <Key size={18} /> Account & Preferences
          </h3>
          <div className="space-y-3 text-gray-700">
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Key size={16} /> Change Password
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Shield size={16} /> Enable 2FA
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Bell size={16} /> Notification Preferences
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Sun size={16} /> Theme Settings
            </button>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition md:col-span-2">
          <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <Activity size={18} /> Recent Activity
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Resolved case <strong>CASE-2025-210</strong> on Aug 11, 2025</li>
            <li>📝 Assigned case <strong>CASE-2025-662</strong> to investigator Mohit Sahu</li>
            <li>📄 Updated rule book policy on Aug 9, 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
