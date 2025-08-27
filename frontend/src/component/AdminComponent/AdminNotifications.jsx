// src/components/admin/NotificationDropdown.jsx
import React, { useEffect, useState, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { withCredentials: true });

const AdminNotifications = () => {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      console.log("New notification received:", data);
      setCount(prev => prev + 1);
      setNotifications(prev => [
        { id: data.complaintId, message: data.message },
        ...prev
      ]);
      toast.success("New complaint Registered");
    });

    return () => {
      socket.off("receive_notification");
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        className="relative focus:outline-none"
      >
        <FiBell className="hover:text-blue-600 top-7 transition duration-150" size={20} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-50">
          <div className="p-3 font-semibold border-b flex justify-between items-center">
            Notifications
            {count > 0 && (
              <button
                onClick={() => { setCount(0); setNotifications([]); }}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">No new notifications</div>
            ) : (
              notifications.map((n, index) => (
                <div
                  key={index}
                  className="m-2 p-3 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition cursor-default"
                >
                  <div className="font-semibold text-gray-800 text-sm">
                    {n.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Complaint ID: {n.id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
