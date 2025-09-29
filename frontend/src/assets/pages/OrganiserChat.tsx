<<<<<<< HEAD
import  { useState, useRef, useEffect } from "react";
import {
  Send,
 
=======
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  Paperclip,
  Smile,
  ArrowLeft,
  User,
} from "lucide-react";
import socket from "../../socket";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { organiserRepository } from "../../repositories/organiserRepositories";
import { messageRepository } from "../../repositories/messageRepositories";

const OrganizerChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{
    _id?: string;
    name?: string;
    email?: string;
<<<<<<< HEAD
    isOnline?:boolean
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
<<<<<<< HEAD
  
=======
  const [searchQuery, setSearchQuery] = useState("");
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const organiser = useSelector((state: RootState) => state.auth.user);
  const fetchUsers = async () => {
    const response = await organiserRepository.fetchUsers();
    console.log("chatres", response);
    setUsers(response.response.users);
  };
  const orgId = organiser?.id;
  const userId = selectedUser._id;
  const fetchMessages = async () => {
    try {
      console.log("org", selectedUser);

      if (!orgId || !userId) {
        throw new Error("organiser and user id undefined");
      }
      const response = await messageRepository.getMessages(orgId, userId);
      console.log("messres", response);
      setMessages(response.messages);
    } catch (error) {
      console.log(error);
    }
  };
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

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser || !organiser?.id) return;
    console.log("seluser", selectedUser);
    const newMessage = {
      _id: Math.random().toString(36).substring(2, 15),
      senderId: organiser?.id,
      receiverId: selectedUser._id!,
      message,
      timestamp: new Date(),
    };
    setMessages((prevMessage) => [...prevMessage, newMessage]);

    socket.emit("send-message", {
      senderId: organiser?.id,
      receiverId: selectedUser._id,
      message,
      isOrganiser: true,
    });

    setMessage("");
  };
  useEffect(() => {
    socket.on("receive-message", (data) => {
      console.log("New Message", data);
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

<<<<<<< HEAD
  


=======
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
<<<<<<< HEAD
          
=======
          {/*<div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>*/}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {onlineUsers.includes(user._id) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </h3>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="lg:hidden">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {selectedUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedUser.name}
                    </h2>
                  </div>
                </div>
<<<<<<< HEAD
               
=======
                {/*<div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>*/}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === organiser?.id
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === organiser?.id
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === organiser?.id
                          ? "text-blue-100"
                          : "text-gray-500"
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
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a user from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerChatPage;
