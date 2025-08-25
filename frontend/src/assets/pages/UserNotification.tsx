import React, { useEffect, useState } from "react";

import { Bell, Clock, User } from "lucide-react"; // nice icons
import { notificationRepository } from "../../repositories/notificationRepositories";

import UserNavbar from "../components/UseNavbar";

interface Notification {
  _id: string;
  userId?: string;
  organizerId?: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const UserNotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      
      const res=await notificationRepository.fetchNotification()
      setNotifications(res.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      
      await notificationRepository.markRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 ">
        <UserNavbar/>
   
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-indigo-600 w-6 h-6" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No notifications yet 🎉</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`flex items-start gap-4 p-4 rounded-xl border ${
                  notification.isRead ? "bg-gray-50" : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <User className="text-gray-500 w-6 h-6 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{notification.message}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="mt-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
};

export default UserNotificationPage;
