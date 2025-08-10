// src/components/admin/NotificationDropdown.jsx
import React, { useEffect, useState, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { withCredentials: true });

const NotificationDropdown = () => {
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
        <FiBell className="hover:text-blue-600 transition duration-150" size={24} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg border rounded-lg z-50">
          <div className="p-2 font-bold border-b flex justify-between">
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
          {notifications.length === 0 ? (
            <div className="p-2 text-gray-500">No new notifications</div>
          ) : (
            notifications.map((n, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-default"
              >
                <div className="font-medium">{n.message}</div>
                <div className="text-sm text-gray-500">Complaint ID: {n.id}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
