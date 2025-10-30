import React, { useEffect, useState } from "react";
import { Bell, Clock, User, Check} from "lucide-react";
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
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

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

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />

      <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-red-500 rounded-2xl shadow-md">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-white text-xs font-bold">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "All", value: "all" as const, count: notifications.length },
                { label: "Unread", value: "unread" as const, count: unreadCount },
                { label: "Read", value: "read" as const, count: notifications.length - unreadCount }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-5 py-2 rounded-2xl font-semibold transition-all ${
                    filter === tab.value
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filter === tab.value ? "bg-white/20" : "bg-red-50 text-red-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-6 border border-red-100">
                <Bell className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">All Clear!</h3>
              <p className="text-gray-600 text-lg">No {filter !== "all" && filter} notifications at the moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-5 rounded-2xl transition-all shadow-sm ${
                    notification.isRead
                      ? "bg-white border border-gray-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                        notification.isRead
                          ? "bg-gray-100"
                          : "bg-red-500"
                      }`}>
                        <User className={`w-6 h-6 ${notification.isRead ? "text-gray-500" : "text-white"}`} />
                      </div>
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed mb-2 ${
                        notification.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                      }`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>

                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                          >
                            <Check className="w-3 h-3" />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Read Badge */}
                    {notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotificationPage;