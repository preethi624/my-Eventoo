import React, { useEffect, useState } from "react";
import { Bell, Clock, User, CheckCheck, Inbox } from "lucide-react";
import { notificationRepository } from "../../repositories/notificationRepositories";
import OrganiserLayout from "../components/OrganiserLayout";

interface Notification {
  _id: string;
  userId?: string;
  organizerId?: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationRepository.fetchNotification();
      setNotifications(res.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationRepository.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <OrganiserLayout>
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-gray-300 text-lg font-medium">Loading notifications...</p>
          </div>
        </OrganiserLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-6">
      <OrganiserLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/30">
                  <Bell className="text-white w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-gray-400 mt-1">Stay updated with your events</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <div className="bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-full">
                  <p className="text-red-300 font-semibold text-sm">
                    {unreadCount} Unread
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Container */}
          <div className="bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-700/50 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="bg-gray-700/30 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Inbox className="text-gray-500 w-12 h-12" />
                </div>
                <p className="text-gray-400 text-xl font-medium mb-2">No notifications yet</p>
                <p className="text-gray-500">You're all caught up! 🎉</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-700/50">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`flex items-start gap-4 p-6 transition-all duration-200 ${
                      notification.isRead 
                        ? "bg-gray-800/30 hover:bg-gray-700/30" 
                        : "bg-blue-500/10 hover:bg-blue-500/15 border-l-4 border-blue-500"
                    }`}
                  >
                    {/* Avatar/Icon */}
                    <div className={`p-3 rounded-xl ${
                      notification.isRead 
                        ? "bg-gray-700/50" 
                        : "bg-blue-500/20 border border-blue-500/30"
                    }`}>
                      <User className={`w-6 h-6 ${
                        notification.isRead ? "text-gray-400" : "text-blue-400"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium mb-2 ${
                        notification.isRead ? "text-gray-300" : "text-white"
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 font-medium"
                        >
                          <CheckCheck className="w-4 h-4" />
                          Mark as Read
                        </button>
                      )}
                    </div>

                    {/* Status Indicator */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Stats Footer */}
          {notifications.length > 0 && (
            <div className="mt-6 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Bell className="w-4 h-4" />
                  <span>Total Notifications: <span className="text-white font-semibold">{notifications.length}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCheck className="w-4 h-4" />
                  <span>Read: <span className="text-green-400 font-semibold">{notifications.length - unreadCount}</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </OrganiserLayout>
    </div>
  );
};

export default NotificationPage;