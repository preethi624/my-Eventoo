import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, User, Check} from "lucide-react";
import { notificationRepository } from "../../repositories/notificationRepositories";
import UserNavbar from "../components/UseNavbar";
import Footer from "../components/Footer";

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      <UserNavbar />

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-2xl shadow-purple-500/50">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
                      <span className="text-white text-xs font-bold">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white">Notifications</h1>
                  <p className="text-gray-400 text-lg mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: "All", value: "all" as const, count: notifications.length },
                { label: "Unread", value: "unread" as const, count: unreadCount },
                { label: "Read", value: "read" as const, count: notifications.length - unreadCount }
              ].map((tab) => (
                <motion.button
                  key={tab.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(tab.value)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    filter === tab.value
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                      : "bg-white/5 backdrop-blur-xl text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filter === tab.value ? "bg-white/20" : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-20 text-center shadow-2xl">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-8 backdrop-blur-xl border-4 border-white/10">
                  <Bell className="w-16 h-16 text-purple-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4">All Clear!</h3>
                <p className="text-gray-400 text-xl">No {filter !== "all" && filter} notifications at the moment</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    {/* Glow Effect for Unread */}
                    {!notification.isRead && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    )}

                    <div
                      className={`relative p-6 rounded-3xl backdrop-blur-2xl border transition-all ${
                        notification.isRead
                          ? "bg-white/5 border-white/10"
                          : "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30"
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            notification.isRead
                              ? "bg-white/10"
                              : "bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"
                          }`}>
                            <User className={`w-7 h-7 ${notification.isRead ? "text-gray-400" : "text-white"}`} />
                          </div>
                          {!notification.isRead && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-black animate-pulse"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-base leading-relaxed mb-3 ${
                            notification.isRead ? "text-gray-400" : "text-white font-medium"
                          }`}>
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            </div>

                            {!notification.isRead && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => markAsRead(notification._id)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-purple-500/30"
                              >
                                <Check className="w-4 h-4" />
                                Mark as Read
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Read Badge */}
                        {notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default UserNotificationPage;