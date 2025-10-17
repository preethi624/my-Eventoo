import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  User,
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
import EmojiPicker, { Theme } from "emoji-picker-react";
import OrganiserLayout from "../components/OrganiserLayout";
import type { IUser } from "../../interfaces/IUser";
import OrganiserFooter from "../components/OrganiserFooter";

const OrganizerChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{
    _id?: string;
    name?: string;
    email?: string;
    isOnline?: boolean;
  }>({});
  const [users, setUsers] = useState<
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
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileurl(file);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <OrganiserLayout>
      <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden -m-6">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Sidebar - Chat List */}
        <div className="w-80 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-700/50 flex flex-col shadow-2xl relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-5 tracking-tight">
              Messages
            </h1>
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 border-b border-slate-800/50 cursor-pointer transition-all duration-300 ${
                  selectedUser?._id === user._id
                    ? "bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-l-4 border-l-blue-500 shadow-lg shadow-blue-500/10"
                    : "hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-slate-800/50">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    {onlineUsers.includes(user._id) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-slate-900 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-200 truncate mb-1">
                      {user.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                     {lastMessage[user._id]?.message && (
                        <p className="text-xs text-slate-500 truncate">
                          {lastMessage[user._id].message}
                        </p>
                      )}
                      {lastMessage[user._id]?.timestamp && (
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(lastMessage[user._id].timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {selectedUser?._id ? (
            <>
              {/* Chat Header */}
              <div className="bg-slate-900/60 backdrop-blur-2xl border-b border-slate-700/50 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="lg:hidden hover:bg-slate-800/60 p-2 rounded-xl transition-all">
                      <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </button>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/30 ring-2 ring-slate-800/50">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {selectedUser.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-slate-900 rounded-full shadow-lg shadow-green-400/50"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">
                        {selectedUser.name}
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        {selectedUser.isOnline ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Active now
                          </>
                        ) : (
                          "Offline"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2.5 hover:bg-slate-800/60 rounded-xl transition-all group">
                      <Phone className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </button>
                    <button className="p-2.5 hover:bg-slate-800/60 rounded-xl transition-all group">
                      <Video className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    </button>
                    <button className="p-2.5 hover:bg-slate-800/60 rounded-xl transition-all group">
                      <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === organiser?.id ? "justify-end" : "justify-start"
                    } mb-3 animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-5 py-3.5 rounded-3xl shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
                        msg.senderId === organiser?.id
                          ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-purple-500/30"
                          : "bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 text-slate-100 shadow-slate-900/50"
                      }`}
                    >
                      {msg.message.startsWith("http") ? (
                        msg.message.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div className="relative group">
                            <img
                              src={msg.message}
                              alt="Sent file"
                              className="max-w-xs rounded-2xl cursor-pointer transition-transform hover:scale-105"
                              onClick={() => window.open(msg.message, "_blank")}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors flex items-center justify-center">
                              <FileText className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <a
                            href={msg.message}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm underline break-all flex items-center gap-2 group ${
                              msg.senderId === organiser?.id
                                ? "text-blue-100 hover:text-white"
                                : "text-blue-400 hover:text-blue-300"
                            }`}
                          >
                            <File className="w-4 h-4" />
                            <span className="group-hover:underline">{msg.message}</span>
                          </a>
                        )
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          msg.senderId === organiser?.id
                            ? "text-blue-100/70"
                            : "text-slate-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedUser._id && (
                <div className="bg-slate-900/60 backdrop-blur-2xl border-t border-slate-700/50 p-5 shadow-2xl">
                  {selectedFileurl && (
                    <div className="mb-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-2">
                      <File className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-300">{selectedFileurl.name}</span>
                    </div>
                  )}
                  <div className="flex items-end space-x-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={handleAttachClick}
                      className="p-3.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800/60 rounded-2xl transition-all group"
                    >
                      <Paperclip className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </button>

                    <div className="flex-1 relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-5 py-3.5 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 resize-none bg-slate-800/60 text-slate-100 placeholder-slate-500 transition-all scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                      />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="p-3.5 text-slate-400 hover:text-yellow-400 hover:bg-slate-800/60 rounded-2xl transition-all group"
                      >
                        <Smile className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-16 right-0 z-50 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-700/50">
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme={Theme.DARK}
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() && !selectedFileurl}
                      className="p-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 group disabled:hover:scale-100"
                    >
                      <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20 ring-1 ring-slate-700/50 backdrop-blur-xl">
                  <User className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-200 mb-3">
                  Select a conversation
                </h3>
                <p className="text-slate-400 max-w-sm leading-relaxed">
                  Choose a user from the sidebar to start chatting and connect with your
                  community
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      <OrganiserFooter/>
    </OrganiserLayout>
  );
};

export default OrganizerChatPage;