import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  User,
  MessageCircle,
  Search
} from "lucide-react";
import socket from "../../socket";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { messageRepository } from "../../repositories/messageRepositories";
import { userRepository } from "../../repositories/userRepositories";
import UserNavbar from "../components/UseNavbar";


const UserChatPage: React.FC = () => {
  const [onlineOrganisers, setOnlineOrganisers] = useState<string[]>([]);
  const [selectedOrganiser, setSelectedOrganiser] = useState<{
    _id?: string;
    name?: string;
    email?: string;
    isOnline?: boolean;
  }>({});
  const [organisers, setOrganisers] = useState<
    { _id: string; name: string; email: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      _id: string;
      senderId: string;
      timestamp: Date;
      message: string;
      receiverId: string;
    }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchOrganisers = async () => {
    const response = await userRepository.fetchOrganisers();
    setOrganisers(response.response.organisers);
  };

  const userId = user?.id;
  const orgId = selectedOrganiser._id;

  const fetchMessages = async () => {
    try {
      if (!orgId || !userId) {
        throw new Error("organiser and user id undefined");
      }
      const response = await messageRepository.getMessages(orgId, userId);
      setMessages(response.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrganisers();
  }, []);

  useEffect(() => {
    if (user?.id && selectedOrganiser._id) {
      fetchMessages();
    }
  }, [selectedOrganiser, user]);

  useEffect(() => {
    socket.on("online-users", (orgIds: string[]) => {
      setOnlineOrganisers(orgIds);
    });
    return () => {
      socket.off("online-users");
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedOrganiser || !user?.id) return;

    const newMessage = {
      _id: Math.random().toString(36).substring(2, 15),
      senderId: user?.id,
      receiverId: selectedOrganiser._id!,
      message,
      timestamp: new Date(),
    };
    setMessages((prevMessage) => [...prevMessage, newMessage]);

    socket.emit("send-message", {
      senderId: user?.id,
      receiverId: selectedOrganiser._id,
      message,
      isOrganiser: true,
    });

    setMessage("");
  };

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prevMessage) => [...prevMessage, data]);
    });
    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredOrganisers = organisers.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <UserNavbar/>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Sidebar - Organisers List */}
      <div className="w-96 flex flex-col relative z-10 border-r border-white/10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                Organisers
              </h1>
              <p className="text-gray-400 text-sm mt-10">Connect with event organizers</p>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organisers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Organisers List */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnimatePresence>
                {filteredOrganisers.map((org, index) => (
                  <motion.div
                    key={org._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedOrganiser(org)}
                    className={`p-4 border-b border-white/5 cursor-pointer transition-all ${
                      selectedOrganiser?._id === org._id
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-7 h-7 text-white" />
                        </div>
                        {onlineOrganisers.includes(org._id) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-black rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white truncate">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{org.email}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {selectedOrganiser._id ? (
          <>
            {/* Chat Header */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedOrganiser({})}
                      className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-300" />
                    </button>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {onlineOrganisers.includes(selectedOrganiser._id!) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-black rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedOrganiser.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {onlineOrganisers.includes(selectedOrganiser._id!) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${
                    msg.senderId === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-5 py-3 rounded-2xl backdrop-blur-xl ${
                      msg.senderId === user?.id
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-white/10 border border-white/20 text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.senderId === user?.id
                          ? "text-white/70"
                          : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-t border-white/10 p-6">
                <div className="flex items-end space-x-3">
                  <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-5 py-3 bg-black/40 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
                    />
                  </div>
                  <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Smile className="w-5 h-5" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-30"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20">
                  <MessageCircle className="w-12 h-12 text-purple-400" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-3">
                Select a Conversation
              </h3>
              <p className="text-gray-400 text-lg">
                Choose an organiser from the sidebar to start chatting
              </p>
            </motion.div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default UserChatPage;