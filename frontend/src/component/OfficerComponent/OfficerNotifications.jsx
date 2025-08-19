import React, { useEffect, useState, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';

const socket = io("http://localhost:4000", { withCredentials: true });

const OfficerNotifications = () => {
  const currentUser = useSelector((state) => state.user);
  const investigatorId = currentUser.user.additionDetails;
  // console.log("investigatorId", investigatorId);

  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    socket.on("complaint_assigned", (data) => {
      // ✅ Only show if this officer is the one assigned
      if (data.investigatorId === investigatorId) {
        setCount(prev => prev + 1);
        setNotifications(prev => [
          { id: data.complaintId, message: data.message },
          ...prev
        ]);
      }
    });

    return () => {
      socket.off("complaint_assigned");
    };
  }, [investigatorId]);

  // Close dropdown when clicking outside
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

  const handleNotificationClick = (n) => {
    console.log(`Notification clicked: Complaint ID ${n.id}`);
    // You can also store selected notification in Redux or navigate somewhere
    window.location.reload(); // 🔄 Force reload UI
  };

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
                  onClick={() => handleNotificationClick(n)}
                  className="m-2 p-3 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition cursor-pointer"
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

export default OfficerNotifications;
