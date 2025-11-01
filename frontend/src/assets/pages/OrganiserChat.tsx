import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  User,
  MessageCircle,
  Search,
  MoreVertical,
  Phone,
  Video,
  File,
  FileText,
} from "lucide-react";
import socket from "../../socket";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { organiserRepository } from "../../repositories/organiserRepositories";
import { messageRepository } from "../../repositories/messageRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import type { IUser } from "../../interfaces/IUser";


const OrganizerChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{
    _id?: string;
    name?: string;
    email?: string;
    isOnline?: boolean;
  }>({});
  const [users, setUsers] = useState<
    { _id: string; name: string; email: string; bookedEvents?: {
      eventId: string;
      title: string;
      date: Date;
      venue: string;
    }[]; }[]
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileurl, setSelectedFileurl] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastMessage, setLastMessage] = useState<
    Record<string, { timestamp: Date; message: string }>
  >({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const organiser = useSelector((state: RootState) => state.auth.user);
  const prevMessagesLengthRef = useRef(0);

  const fetchUsers = async () => {
    const response = await organiserRepository.fetchUsers();
    console.log("chatres", response);
    setUsers(response.response.users.sort((a:IUser,b:IUser)=>((a.name??"").localeCompare(b.name??""))));
  };

  const orgId = organiser?.id;
  const userId = selectedUser._id ?? "";

  const fetchMessages = async () => {
    try {
      console.log("org", selectedUser);
      if (!orgId || !userId) {
        throw new Error("organiser and user id undefined");
      }
      const response = await messageRepository.getMessages(orgId, userId);
      console.log("messres", response);
      
      setMessages(response.messages);
      if (response.messages.length > 0) {
        const lastMsg = response.messages[response.messages.length - 1];
        setLastMessage((prev) => ({
          ...prev,
          [userId]: {
            message: lastMsg.message,
            timestamp: lastMsg.timestamp,
          },
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      if (organiser?.id) {
        socket.emit("register-organiser", organiser.id);
        console.log("Organiser registered:", organiser.id);
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [organiser?.id]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (organiser?.id && selectedUser._id) {
      fetchMessages();
    }
  }, [selectedUser, organiser]);
   
  useEffect(() => {
    socket.on("online-users", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
    return () => {
      socket.off("online-users");
    };
  }, []);

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFileurl) || !selectedUser || !organiser?.id) return;

    let fileUrl = "";
    if (selectedFileurl) {
      const formData = new FormData();
      formData.append("file", selectedFileurl);
      formData.append("senderId", organiser.id);
      formData.append("receiverId", selectedUser?._id ?? "");

      const response = await messageRepository.sendFile(formData);
      fileUrl = response?.fileUrl?.fileUrl || response?.fileUrl;
      console.log("fileurl", fileUrl);
    }

    const newMessage = {
      _id: Math.random().toString(36).substring(2, 15),
      senderId: organiser?.id,
      receiverId: selectedUser._id!,
      message: message || fileUrl,
      timestamp: new Date(),
    };
    setMessages((prevMessage) => [...prevMessage, newMessage]);

    socket.emit("send-message", {
      senderId: organiser?.id,
      receiverId: selectedUser._id,
      message: message || fileUrl,
      isOrganiser: true,
    });

    setMessage("");
    setSelectedFileurl(null);
    setLastMessage((prev) => ({
      ...prev,
      [selectedUser._id!]: {
        message: message || "📎 File sent",
        timestamp: new Date(),
      },
    }));
  };

  useEffect(() => {
    socket.on("receive-message", (data) => {
      console.log("New Message", data);
      setMessages((prevMessage) => [...prevMessage, data]);
      setLastMessage((prev) => ({
        ...prev,
        [data.senderId]: {
          message: data.message,
          timestamp: data.timestamp,
        },
      }));
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
    // Only scroll to bottom when a new message is added (not on initial load)
    if (messages.length > 0 && selectedUser._id && messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, selectedUser._id]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileurl(file);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <OrganiserLayout>
        <div className="flex h-screen bg-gray-900 relative overflow-hidden -m-6">
          {/* Sidebar - Users List */}
          <div className={`${
            selectedUser._id ? 'hidden' : 'flex'
          } md:flex w-full md:w-96 bg-gray-800 md:border-r border-gray-700 flex-col shadow-sm relative z-10`}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="p-2.5 bg-red-500 rounded-2xl shadow-md">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
                  Users
                </h1>
              </div>

              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedUser(user)}
                    className={`group p-4 border-b border-gray-700 cursor-pointer transition-all duration-300 ${
                      selectedUser?._id === user._id
                        ? "bg-red-900/30 border-l-4 border-l-red-500"
                        : "hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* User avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        {onlineUsers.includes(user._id) && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                        )}
                      </div>

                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-100 truncate mb-0.5">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mb-2">{user.email}</p>

                        {/* Booked Events Section */}
                        {user.bookedEvents && user.bookedEvents.length > 0 && (
                          <div className="flex items-center gap-2 bg-gray-700/50 rounded-xl border border-gray-600 p-2 transition-all hover:shadow-sm">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-gray-200 truncate">
                                <p>Booked Event:</p>
                                {user.bookedEvents[0].title}
                              </h4>
                              <p className="text-[11px] text-gray-400 truncate">
                                {new Date(user.bookedEvents[0].date).toLocaleDateString()} ·{" "}
                                {user.bookedEvents[0].venue}
                              </p>
                              {user.bookedEvents.length > 1 && (
                                <p className="text-[11px] text-red-400 mt-1">
                                  +{user.bookedEvents.length - 1} more event{user.bookedEvents.length > 2 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {lastMessage[user._id]?.message && (
                          <p className="text-xs text-gray-500 truncate mt-2">
                            {lastMessage[user._id].message}
                          </p>
                        )}
                        {lastMessage[user._id]?.timestamp && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(lastMessage[user._id].timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`${
            selectedUser._id ? 'flex' : 'hidden'
          } md:flex flex-1 flex-col relative z-10 bg-gray-900`}>
            {selectedUser._id ? (
              <>
                {/* Chat Header */}
                <div className="bg-gray-800 border-b border-gray-700 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <button
                        onClick={() => setSelectedUser({})}
                        className="md:hidden hover:bg-gray-700 p-2 rounded-xl transition-all flex-shrink-0"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-300" />
                      </button>
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        {onlineUsers.includes(selectedUser._id!) && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-100 truncate">
                          {selectedUser.name}
                        </h2>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          {onlineUsers.includes(selectedUser._id!) ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Active now
                            </>
                          ) : (
                            "Offline"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <button className="p-2 sm:p-2.5 hover:bg-gray-700 rounded-xl transition-all group">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                      <button className="p-2 sm:p-2.5 hover:bg-gray-700 rounded-xl transition-all group">
                        <Video className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                      <button className="p-2 sm:p-2.5 hover:bg-gray-700 rounded-xl transition-all group">
                        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${
                        msg.senderId === organiser?.id ? "justify-end" : "justify-start"
                      } mb-2 sm:mb-3`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-md px-4 sm:px-5 py-3 sm:py-3.5 rounded-3xl shadow-sm ${
                          msg.senderId === organiser?.id
                            ? "bg-red-500 text-white"
                            : "bg-gray-800 border border-gray-700 text-gray-100"
                        }`}
                      >
                        {msg.message.startsWith("http") ? (
                          msg.message.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <div className="relative group">
                              <img
                                src={msg.message}
                                alt="Sent file"
                                className="max-w-[200px] sm:max-w-xs rounded-2xl cursor-pointer transition-transform hover:scale-105"
                                onClick={() => window.open(msg.message, "_blank")}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors flex items-center justify-center">
                                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ) : msg.message.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video
                              src={msg.message}
                              controls
                              className="max-w-[200px] sm:max-w-xs rounded-2xl border border-gray-700"
                            />
                          ) : (
                            <a
                              href={msg.message}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs sm:text-sm underline break-all flex items-center gap-2 group ${
                                msg.senderId === organiser?.id
                                  ? "text-white hover:text-red-100"
                                  : "text-red-400 hover:text-red-300"
                              }`}
                            >
                              <File className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="group-hover:underline">{msg.message}</span>
                            </a>
                          )
                        ) : (
                          <p className="text-xs sm:text-sm leading-relaxed break-words">{msg.message}</p>
                        )}
                        <p
                          className={`text-xs mt-2 ${
                            msg.senderId === organiser?.id
                              ? "text-red-100"
                              : "text-gray-500"
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
                <div className="bg-gray-800 border-t border-gray-700 p-3 sm:p-5 shadow-sm">
                  {selectedFileurl && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-700 rounded-xl border border-gray-600 flex items-center gap-2">
                      <File className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-200 truncate">{selectedFileurl.name}</span>
                    </div>
                  )}
                  <div className="flex items-end space-x-2 sm:space-x-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 sm:p-3.5 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-2xl transition-all group flex-shrink-0"
                    >
                      <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform" />
                    </button>

                    <div className="flex-1 relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base border border-gray-600 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none bg-gray-700 text-gray-100 placeholder-gray-400 transition-all"
                      />
                    </div>

                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="p-2.5 sm:p-3.5 text-gray-400 hover:text-yellow-500 hover:bg-gray-700 rounded-2xl transition-all group"
                      >
                        <Smile className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-16 right-0 sm:right-auto z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme={Theme.DARK}
                          />
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!message.trim() && !selectedFileurl}
                      className="p-2.5 sm:p-3.5 bg-red-500 text-white rounded-2xl hover:bg-red-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all group disabled:hover:scale-100 flex-shrink-0"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-md border border-red-800">
                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2 sm:mb-3">
                    Select a conversation
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 max-w-sm leading-relaxed px-4">
                    Choose a user from the sidebar to start chatting and connect
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </OrganiserLayout>
     
    </>
  );
};

export default OrganizerChatPage;